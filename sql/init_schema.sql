-- =========================================================================
-- 《幻灵秘境》(Huan Ling Mi Jing) - 数据库初始化脚本 (PostgreSQL)
-- 包含：用户与角色、幻灵精灵实例、图鉴收集、背包道具、主线任务、公会宗门、战斗日志等
-- 配合：Redis 缓存架构 + RabbitMQ 异步消息总线
-- =========================================================================

-- 1. 开启必要扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. 清理历史表结构 (支持重复执行部署)
DROP TABLE IF EXISTS battle_logs CASCADE;
DROP TABLE IF EXISTS player_quests CASCADE;
DROP TABLE IF EXISTS pokedex_unlocks CASCADE;
DROP TABLE IF EXISTS player_inventory CASCADE;
DROP TABLE IF EXISTS pet_skills CASCADE;
DROP TABLE IF EXISTS player_pets CASCADE;
DROP TABLE IF EXISTS guild_members CASCADE;
DROP TABLE IF EXISTS guilds CASCADE;
DROP TABLE IF EXISTS player_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS game_scenes CASCADE;
DROP TABLE IF EXISTS pet_species_config CASCADE;

-- =========================================================================
-- 基础配置字典表
-- =========================================================================

-- 幻灵原型字典配置表
CREATE TABLE pet_species_config (
    species_id VARCHAR(64) PRIMARY KEY,
    pokedex_num VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    title VARCHAR(64) NOT NULL,
    element_type VARCHAR(16) NOT NULL, -- FIRE, WATER, GRASS, ELECTRIC, NORMAL, ICE, ROCK
    rarity VARCHAR(16) NOT NULL DEFAULT 'COMMON', -- COMMON, RARE, EPIC, LEGENDARY
    base_hp INT NOT NULL DEFAULT 50,
    base_atk INT NOT NULL DEFAULT 50,
    base_def INT NOT NULL DEFAULT 50,
    base_sp_atk INT NOT NULL DEFAULT 50,
    base_sp_def INT NOT NULL DEFAULT 50,
    base_speed INT NOT NULL DEFAULT 50,
    evolution_level INT DEFAULT NULL,
    evolves_to VARCHAR(64) DEFAULT NULL,
    evolves_from VARCHAR(64) DEFAULT NULL,
    acquisition_desc TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 地图场景配置表
CREATE TABLE game_scenes (
    scene_id VARCHAR(32) PRIMARY KEY,
    scene_name VARCHAR(64) NOT NULL,
    region_name VARCHAR(64) NOT NULL,
    theme VARCHAR(32) NOT NULL,
    bg_gradient VARCHAR(128),
    min_player_level INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 核心玩家体系
-- =========================================================================

-- 用户账号表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, BANNED, MUTED
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 玩家角色档案表 (洛克/奥奇/赛尔风格玩家核心数据)
CREATE TABLE player_profiles (
    player_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(64) NOT NULL,
    title VARCHAR(64) DEFAULT '初阶灵契使',
    avatar_id VARCHAR(32) DEFAULT 'magician_boy',
    gender VARCHAR(8) DEFAULT 'MALE',
    level INT NOT NULL DEFAULT 1,
    current_exp BIGINT NOT NULL DEFAULT 0,
    vitality INT NOT NULL DEFAULT 100,
    max_vitality INT NOT NULL DEFAULT 100,
    spirit_coins BIGINT NOT NULL DEFAULT 1000, -- 灵石(普通金币)
    spirit_gems INT NOT NULL DEFAULT 50,       -- 灵晶(充值货币/绑定钻石)
    vip_level INT NOT NULL DEFAULT 0,
    combat_power INT NOT NULL DEFAULT 100,     -- 玩家综合战力评分
    current_scene_id VARCHAR(32) DEFAULT 'ACADEMY' REFERENCES game_scenes(scene_id),
    pos_x NUMERIC(5,2) DEFAULT 50.00,
    pos_y NUMERIC(5,2) DEFAULT 65.00,
    active_leader_slot INT DEFAULT 0,          -- 当前首发跟随幻灵栏位 (0-5)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_player_nickname ON player_profiles(nickname);
CREATE INDEX idx_player_power ON player_profiles(combat_power DESC);
CREATE INDEX idx_player_scene ON player_profiles(current_scene_id);

-- =========================================================================
-- 幻灵宠物资产 (玩家拥有的幻灵实例)
-- =========================================================================

CREATE TABLE player_pets (
    pet_uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    species_id VARCHAR(64) NOT NULL REFERENCES pet_species_config(species_id),
    nickname VARCHAR(64) NOT NULL,
    level INT NOT NULL DEFAULT 5,
    exp BIGINT NOT NULL DEFAULT 0,
    max_exp BIGINT NOT NULL DEFAULT 100,
    in_party BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE: 在6只随行背包中, FALSE: 在仓库/家园
    party_slot INT DEFAULT NULL,            -- 0-5 栏位
    current_hp INT NOT NULL DEFAULT 50,
    max_hp INT NOT NULL DEFAULT 50,
    stat_atk INT NOT NULL DEFAULT 20,
    stat_def INT NOT NULL DEFAULT 20,
    stat_sp_atk INT NOT NULL DEFAULT 20,
    stat_sp_def INT NOT NULL DEFAULT 20,
    stat_speed INT NOT NULL DEFAULT 20,
    talent_score INT DEFAULT 20,             -- 个体资质/潜力 (1-31)
    nature VARCHAR(16) DEFAULT 'BRAVE',      -- 性格 (增加某种属性修正)
    is_shiny BOOLEAN DEFAULT FALSE,          -- 是否变异/闪光神宠
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pet_player ON player_pets(player_id);
CREATE INDEX idx_pet_party ON player_pets(player_id, in_party);

-- 幻灵掌握的技能 (至多4个技能槽)
CREATE TABLE pet_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_uid UUID NOT NULL REFERENCES player_pets(pet_uid) ON DELETE CASCADE,
    move_id VARCHAR(64) NOT NULL,
    slot_index INT NOT NULL CHECK (slot_index BETWEEN 0 AND 3),
    current_pp INT NOT NULL,
    max_pp INT NOT NULL,
    UNIQUE (pet_uid, slot_index)
);

-- =========================================================================
-- 图鉴解锁记录
-- =========================================================================

CREATE TABLE pokedex_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    species_id VARCHAR(64) NOT NULL REFERENCES pet_species_config(species_id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    catch_count INT DEFAULT 1,
    seen_only BOOLEAN DEFAULT FALSE,
    UNIQUE(player_id, species_id)
);

CREATE INDEX idx_pokedex_player ON pokedex_unlocks(player_id);

-- =========================================================================
-- 背包道具与资源
-- =========================================================================

CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL,
    item_category VARCHAR(32) NOT NULL, -- BALL(灵契晶), POTION(仙丹灵药), EVOLUTION(进化石), MATERIAL(材料)
    count INT NOT NULL DEFAULT 1 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, item_id)
);

-- =========================================================================
-- 主线剧情与新手引导任务
-- =========================================================================

CREATE TABLE player_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    quest_id VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CLAIMED
    current_count INT NOT NULL DEFAULT 0,
    target_count INT NOT NULL DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(player_id, quest_id)
);

-- =========================================================================
-- 宗门/公会与社交系统
-- =========================================================================

CREATE TABLE guilds (
    guild_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL UNIQUE,
    leader_player_id UUID NOT NULL REFERENCES player_profiles(player_id),
    level INT NOT NULL DEFAULT 1,
    exp BIGINT NOT NULL DEFAULT 0,
    notice TEXT DEFAULT '欢迎来到幻灵宗门！共探大陆诸峰！',
    max_members INT DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guild_members (
    guild_id UUID NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL DEFAULT 'MEMBER', -- LEADER, ELDER, MEMBER
    contributed_exp INT DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (guild_id, player_id)
);

-- =========================================================================
-- 战斗与战报记录
-- =========================================================================

CREATE TABLE battle_logs (
    battle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id),
    opponent_type VARCHAR(16) NOT NULL, -- WILD, NPC, PVP
    opponent_name VARCHAR(64) NOT NULL,
    result VARCHAR(16) NOT NULL,        -- VICTORY, DEFEAT, FLED, CAPTURED
    exp_gained INT DEFAULT 0,
    coins_gained INT DEFAULT 0,
    captured_pet_uid UUID REFERENCES player_pets(pet_uid),
    battle_turns INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 自动更新 updated_at 触发器函数
-- =========================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_update BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER trg_player_profiles_update BEFORE UPDATE ON player_profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER trg_player_pets_update BEFORE UPDATE ON player_pets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER trg_player_inventory_update BEFORE UPDATE ON player_inventory FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- =========================================================================
-- 初始元数据预埋 (SEED DATA)
-- =========================================================================

-- 预设场景
INSERT INTO game_scenes (scene_id, scene_name, region_name, theme, bg_gradient, description) VALUES
('ACADEMY', '幻灵圣殿', '大陆圣境核心', 'mystic', 'from-indigo-950 via-slate-900 to-blue-950', '诸灵汇聚的崇高圣殿，九峰浮岛环绕'),
('PRAIRIE', '云梦古原', '圣境南部平原', 'nature', 'from-emerald-950 via-slate-900 to-teal-950', '古老纯净的原野，碧草连天，微风拂动灵气'),
('VOLCANO', '苍炎熔渊', '西域烈焰裂谷', 'fire', 'from-rose-950 via-stone-900 to-amber-950', '地火翻涌的古老炽热熔岩地脉，火系幻灵栖息地'),
('BAY', '瀚海澜湾', '东海灵汐之畔', 'water', 'from-cyan-950 via-slate-900 to-blue-950', '蔚蓝浪涛连绵不绝的滨海秘境，水润灵气充沛'),
('HOSPITAL', '天医仙泉', '圣境回春灵地', 'holy', 'from-pink-950 via-slate-900 to-rose-950', '圣殿医圣葛仙翁结庐之处，灵泉滋养万兽'),
('SHOP', '万象宝阁', '天墉商盟分舵', 'gold', 'from-amber-950 via-slate-900 to-orange-950', '网罗天下奇珍异宝与高阶灵契晶石的交易行'),
('ARENA', '通天擂台', '至高斗灵决斗场', 'electric', 'from-purple-950 via-slate-900 to-indigo-950', '灵契大师切磋竞技之所，电闪雷鸣万众瞩目');

-- 预设核心幻灵原型
INSERT INTO pet_species_config 
(species_id, pokedex_num, name, title, element_type, rarity, base_hp, base_atk, base_def, base_sp_atk, base_sp_def, base_speed, evolution_level, evolves_to, acquisition_desc, description) VALUES
('chiyanque', '001', '赤焰雀', '火系初阶幻灵', 'FIRE', 'RARE', 46, 54, 42, 62, 48, 68, 16, 'zhuoyuying', '大长老授羽仪式御三家选择 / 苍炎熔渊外围偶遇', '诞生于苍炎地脉火晶之中的赤羽雏鸟，尾羽燃动着永不熄灭的灵火。'),
('zhuoyuying', '002', '灼羽鹰', '火系进阶猛禽', 'FIRE', 'EPIC', 60, 68, 56, 84, 62, 85, 36, 'fentianhuang', '由【赤焰雀】达到 Lv.16 蜕变进化', '双翼展开烈焰翻滚，能够划破长空以极速猎杀目标。'),
('fentianhuang', '003', '焚天凰', '火系神荒主宰', 'FIRE', 'LEGENDARY', 85, 92, 78, 128, 88, 110, NULL, NULL, '由【灼羽鹰】达到 Lv.36 终极蜕变觉醒', '南荒神话中的天火神鸟，长鸣一声可燃尽万里劫云。'),
('bishuiling', '004', '碧水灵', '水系初阶幻灵', 'WATER', 'RARE', 52, 45, 50, 60, 65, 55, 16, 'canglanjiao', '大长老授羽仪式御三家选择 / 瀚海澜湾清潭深处', '由纯净水精幻化而成的灵动精灵，能自由操控水滴与浪花。'),
('canglanjiao', '005', '沧澜蛟', '水系进阶幻蛟', 'WATER', 'EPIC', 68, 58, 66, 82, 85, 72, 36, 'lingxiaohaihuang', '由【碧水灵】达到 Lv.16 蜕变进化', '身覆苍青龙鳞的巡海蛟龙，御浪而行，性情温润却威能无匹。'),
('lingxiaohaihuang', '006', '凌霄海皇', '水系九霄至尊', 'WATER', 'LEGENDARY', 95, 80, 92, 120, 115, 90, NULL, NULL, '由【沧澜蛟】达到 Lv.36 终极蜕变觉醒', '统领四海千百海族的至尊霸主，举手投足间掀起通天巨浪。'),
('qingmulu', '007', '青木鹿', '草系初阶幻灵', 'GRASS', 'RARE', 55, 48, 52, 58, 62, 50, 16, 'biyelinglu', '大长老授羽仪式御三家选择 / 云梦古原浅林偶遇', '头顶绽放碧绿新芽的小鹿，所过之处枯木逢春百花盛开。'),
('biyelinglu', '008', '碧野灵鹿', '草系进阶神骏', 'GRASS', 'EPIC', 72, 60, 68, 80, 84, 66, 36, 'huanqiongfeicuilu', '由【青木鹿】达到 Lv.16 蜕变进化', '踏云而行的古林守护者，鹿角犹如苍劲翡翠灵树枝桠。'),
('huanqiongfeicuilu', '009', '幻穹翡翠鹿', '草系天地神尊', 'GRASS', 'LEGENDARY', 105, 82, 95, 115, 118, 80, NULL, NULL, '由【碧野灵鹿】达到 Lv.36 终极蜕变觉醒', '执掌生生不息自然法则的远古神祇，能唤醒整片大陆的灵脉。');

-- =========================================================================
-- 常用查询示例与视图
-- =========================================================================

CREATE OR REPLACE VIEW v_player_full_status AS
SELECT 
    p.player_id,
    p.nickname,
    p.title,
    p.level,
    p.combat_power,
    p.spirit_coins,
    p.spirit_gems,
    p.vip_level,
    p.current_scene_id,
    s.scene_name,
    COUNT(DISTINCT pp.pet_uid) AS total_pets_owned,
    COUNT(DISTINCT pu.species_id) AS pokedex_count
FROM player_profiles p
LEFT JOIN game_scenes s ON p.current_scene_id = s.scene_id
LEFT JOIN player_pets pp ON p.player_id = pp.player_id
LEFT JOIN pokedex_unlocks pu ON p.player_id = pu.player_id
GROUP BY p.player_id, p.nickname, p.title, p.level, p.combat_power, p.spirit_coins, p.spirit_gems, p.vip_level, p.current_scene_id, s.scene_name;

COMMENT ON TABLE player_profiles IS '《幻灵秘境》核心玩家档案与养成属性';
COMMENT ON TABLE player_pets IS '玩家拥有的幻灵实例，支持战斗资质、技能槽、进化与数值';
COMMENT ON TABLE pokedex_unlocks IS '图鉴解锁总表，自动填充与收录';
