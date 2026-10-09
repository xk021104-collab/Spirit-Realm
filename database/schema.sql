-- ============================================================
-- 《幻灵秘境》 PostgreSQL 关系型数据库结构脚本
-- 版本: 1.0.0
-- 包含: 用户玩家、幻灵图鉴、随行幻灵、背包储物、任务日志、战斗历史
-- ============================================================

-- 1. 创建扩展 (如需 UUID 支持与 JSONB 索引)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 玩家/用户表 (players)
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL DEFAULT '云游灵契师',
    email VARCHAR(100),
    password_hash VARCHAR(255),
    coins BIGINT NOT NULL DEFAULT 1000 CHECK (coins >= 0),
    level INT NOT NULL DEFAULT 1,
    exp BIGINT NOT NULL DEFAULT 0,
    current_scene_id VARCHAR(32) NOT NULL DEFAULT 'ACADEMY',
    badges JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_coins ON players(coins);

-- 3. 幻灵物种图鉴定义表 (spirit_species)
CREATE TABLE IF NOT EXISTS spirit_species (
    species_id VARCHAR(32) PRIMARY KEY,
    pokedex_num VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL,
    element_type VARCHAR(20) NOT NULL, -- FIRE, WATER, GRASS, ELECTRIC, ICE, ROCK, NORMAL
    rarity VARCHAR(20) NOT NULL,       -- COMMON, RARE, EPIC, LEGENDARY
    description TEXT NOT NULL,
    acquisition_method TEXT NOT NULL,
    base_stats JSONB NOT NULL,         -- { hp, atk, def, spAtk, spDef, speed }
    learnable_moves JSONB NOT NULL,    -- [{ level, moveId }]
    evolution_chain JSONB,             -- [{ stage, speciesId, name, reqLevel }]
    habitat JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_spirit_species_element ON spirit_species(element_type);
CREATE INDEX IF NOT EXISTS idx_spirit_species_rarity ON spirit_species(rarity);

-- 4. 玩家拥有的幻灵实例表 (player_spirits)
CREATE TABLE IF NOT EXISTS player_spirits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    species_id VARCHAR(32) NOT NULL REFERENCES spirit_species(species_id),
    nickname VARCHAR(50) NOT NULL,
    level INT NOT NULL DEFAULT 5 CHECK (level >= 1 AND level <= 100),
    exp INT NOT NULL DEFAULT 0,
    max_exp INT NOT NULL DEFAULT 100,
    current_hp INT NOT NULL,
    stats JSONB NOT NULL,             -- { hp, maxHp, atk, def, spAtk, spDef, speed }
    moves JSONB NOT NULL,             -- [{ id, pp, maxPp }]
    is_in_party BOOLEAN NOT NULL DEFAULT false,
    party_slot INT CHECK (party_slot >= 0 AND party_slot <= 5),
    nature VARCHAR(30) NOT NULL DEFAULT '坦率',
    status_effect VARCHAR(20) DEFAULT NULL,
    caught_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_player_spirits_player ON player_spirits(player_id);
CREATE INDEX IF NOT EXISTS idx_player_spirits_party ON player_spirits(player_id, is_in_party);

-- 5. 道具字典表 (items)
CREATE TABLE IF NOT EXISTS items (
    item_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,     -- BALL, POTION, PP, REVIVE
    price INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    effects JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. 玩家背包道具槽位表 (player_inventory)
CREATE TABLE IF NOT EXISTS player_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    item_id VARCHAR(32) NOT NULL REFERENCES items(item_id),
    count INT NOT NULL DEFAULT 0 CHECK (count >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_player_item UNIQUE (player_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_player_inventory_player ON player_inventory(player_id);

-- 7. 玩家图鉴解锁记录表 (player_pokedex)
CREATE TABLE IF NOT EXISTS player_pokedex (
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    species_id VARCHAR(32) NOT NULL REFERENCES spirit_species(species_id),
    first_caught_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id, species_id)
);

CREATE INDEX IF NOT EXISTS idx_player_pokedex_player ON player_pokedex(player_id);

-- 8. 玩家主线任务状态表 (player_quests)
CREATE TABLE IF NOT EXISTS player_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    quest_id VARCHAR(32) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'LOCKED', -- LOCKED, ACTIVE, COMPLETED, CLAIMED
    current_count INT NOT NULL DEFAULT 0,
    target_count INT NOT NULL DEFAULT 1,
    claimed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_player_quest UNIQUE (player_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_player_quests_status ON player_quests(player_id, status);

-- 9. 战斗历史记录表 (battle_history)
CREATE TABLE IF NOT EXISTS battle_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    battle_type VARCHAR(20) NOT NULL DEFAULT 'WILD', -- WILD, ARENA, PVP
    enemy_species_id VARCHAR(32),
    won BOOLEAN NOT NULL DEFAULT false,
    exp_earned INT NOT NULL DEFAULT 0,
    coins_earned INT NOT NULL DEFAULT 0,
    captured_spirit_id UUID REFERENCES player_spirits(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_battle_history_player ON battle_history(player_id);
CREATE INDEX IF NOT EXISTS idx_battle_history_time ON battle_history(created_at DESC);
