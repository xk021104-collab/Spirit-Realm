-- ============================================================
-- 《幻灵秘境》 PostgreSQL 初始基础数据填充脚本 (Seeds)
-- ============================================================

-- 1. 插入道具字典 (items)
INSERT INTO items (item_id, name, category, price, description, effects) VALUES
('gulu_normal', '初阶灵契晶', 'BALL', 100, '以灵玉打磨的初级契约晶石，可用来收服野外初阶幻灵。', '{"catchMultiplier": 1.0}'::jsonb),
('gulu_mid', '玄阶凝灵晶', 'BALL', 300, '蕴含精纯灵力的凝灵宝玉，契约捕获概率提升60%。', '{"catchMultiplier": 1.6}'::jsonb),
('gulu_high', '天阶破界晶', 'BALL', 800, '天工古法炼制的破界晶石，散发耀目光辉，大幅提高捕获概率。', '{"catchMultiplier": 2.5}'::jsonb),
('gulu_king', '混元圣皇晶', 'BALL', 5000, '幻灵秘境至高无上的圣物，必定能与任何野外幻灵结下本命契约！', '{"isGuaranteed": true, "catchMultiplier": 99.0}'::jsonb),
('potion_small', '初级回春灵露', 'POTION', 80, '采集灵草清晨凝露炼制，恢复单只幻灵 50 点生命值。', '{"healHp": 50}'::jsonb),
('potion_mid', '紫玉凝气丸', 'POTION', 200, '紫灵花瓣研磨成的珍贵灵丹，恢复单只幻灵 120 点生命值。', '{"healHp": 120}'::jsonb),
('potion_full', '天髓造化灵泉', 'POTION', 600, '蕴含无尽生命精华的古泉之水，瞬间完全回复幻灵全部生命！', '{"healHp": 9999}'::jsonb),
('elixir_pp', '凝神还真丹', 'PP', 250, '恢复单只幻灵所有招式的 10 点技能灵力（PP）。', '{"healPp": 10}'::jsonb),
('revive_herb', '返魂定魄草', 'REVIVE', 500, '唤醒陷入濒死脱力的幻灵，并恢复其半数生命值。', '{"isRevive": true, "healHp": 100}'::jsonb)
ON CONFLICT (item_id) DO NOTHING;

-- 2. 插入幻灵物种图鉴数据 (spirit_species)
INSERT INTO spirit_species (species_id, pokedex_num, name, title, element_type, rarity, description, acquisition_method, base_stats, learnable_moves, evolution_chain, habitat) VALUES
(
    'chiyanque', '001', '赤焰雀', '火系初阶幻灵', 'FIRE', 'RARE',
    '诞生于苍炎地脉火晶之中的赤羽雏鸟，尾羽燃动着永不熄灭的灵火，性格桀骜勇猛。',
    '幻灵圣殿大长老授羽仪式御三家选择 / 苍炎熔渊外围偶遇',
    '{"hp": 46, "atk": 54, "def": 42, "spAtk": 62, "spDef": 48, "speed": 68}'::jsonb,
    '[{"level": 1, "moveId": "shadow_claw"}, {"level": 1, "moveId": "intimidate_roar"}, {"level": 7, "moveId": "ember_feather"}, {"level": 13, "moveId": "flame_talon"}, {"level": 18, "moveId": "searing_tempest"}, {"level": 32, "moveId": "sky_burning_wrath"}]'::jsonb,
    '[{"stage": 1, "speciesId": "chiyanque", "name": "赤焰雀"}, {"stage": 2, "speciesId": "zhuoyuying", "name": "灼羽鹰", "reqLevel": 16}, {"stage": 3, "speciesId": "fentianhuang", "name": "焚天凰", "reqLevel": 36}]'::jsonb,
    '["VOLCANO", "ACADEMY"]'::jsonb
),
(
    'zhuoyuying', '002', '灼羽鹰', '火系进阶猛禽', 'FIRE', 'EPIC',
    '赤焰雀初次蜕变后的雄鹰形态，双翼展开烈焰翻滚，能够划破长空以极速猎杀目标。',
    '由【赤焰雀】达到 Lv.16 蜕变进化',
    '{"hp": 60, "atk": 68, "def": 56, "spAtk": 84, "spDef": 62, "speed": 85}'::jsonb,
    '[{"level": 16, "moveId": "searing_tempest"}, {"level": 24, "moveId": "flame_talon"}, {"level": 36, "moveId": "sky_burning_wrath"}]'::jsonb,
    '[{"stage": 1, "speciesId": "chiyanque", "name": "赤焰雀"}, {"stage": 2, "speciesId": "zhuoyuying", "name": "灼羽鹰", "reqLevel": 16}, {"stage": 3, "speciesId": "fentianhuang", "name": "焚天凰", "reqLevel": 36}]'::jsonb,
    '["VOLCANO"]'::jsonb
),
(
    'fentianhuang', '003', '焚天凰', '火系至尊神禽', 'FIRE', 'LEGENDARY',
    '幻灵大陆苍炎熔渊的古老图腾，凤鸣九霄，周身缠绕混沌神火，举翼焚尽八荒邪祟！',
    '由【灼羽鹰】达到 Lv.36 终极浴火涅槃',
    '{"hp": 80, "atk": 86, "def": 78, "spAtk": 114, "spDef": 86, "speed": 106}'::jsonb,
    '[{"level": 36, "moveId": "sky_burning_wrath"}, {"level": 42, "moveId": "searing_tempest"}]'::jsonb,
    '[{"stage": 1, "speciesId": "chiyanque", "name": "赤焰雀"}, {"stage": 2, "speciesId": "zhuoyuying", "name": "灼羽鹰", "reqLevel": 16}, {"stage": 3, "speciesId": "fentianhuang", "name": "焚天凰", "reqLevel": 36}]'::jsonb,
    '["VOLCANO", "ARENA"]'::jsonb
),
(
    'bishuiling', '004', '碧水灵', '水系初阶幻灵', 'WATER', 'RARE',
    '由极纯净的灵泉凝聚而成的水滴精灵，性情温柔聪慧，周身流转着剔透的生命水韵。',
    '幻灵圣殿大长老授水仪式御三家选择 / 星辰碧海浪花中偶遇',
    '{"hp": 48, "atk": 46, "def": 62, "spAtk": 54, "spDef": 66, "speed": 44}'::jsonb,
    '[{"level": 1, "moveId": "soul_tackle"}, {"level": 1, "moveId": "spirit_gaze"}, {"level": 7, "moveId": "azure_wave"}, {"level": 13, "moveId": "tidal_crash"}, {"level": 18, "moveId": "abyssal_pulse"}, {"level": 32, "moveId": "deluge_sovereign"}]'::jsonb,
    '[{"stage": 1, "speciesId": "bishuiling", "name": "碧水灵"}, {"stage": 2, "speciesId": "yuanchaoshou", "name": "渊潮兽", "reqLevel": 16}, {"stage": 3, "speciesId": "huanhailingzun", "name": "幻海灵尊", "reqLevel": 36}]'::jsonb,
    '["BAY", "ACADEMY"]'::jsonb
),
(
    'yuanchaoshou', '005', '渊潮兽', '水系进阶渊兽', 'WATER', 'EPIC',
    '碧水灵化身为乘风破浪的深海异兽，头顶珊瑚宝玉，掌控深海高压激流。',
    '由【碧水灵】达到 Lv.16 凝水化形进化',
    '{"hp": 64, "atk": 58, "def": 82, "spAtk": 72, "spDef": 84, "speed": 60}'::jsonb,
    '[{"level": 16, "moveId": "abyssal_pulse"}, {"level": 25, "moveId": "tidal_crash"}, {"level": 36, "moveId": "deluge_sovereign"}]'::jsonb,
    '[{"stage": 1, "speciesId": "bishuiling", "name": "碧水灵"}, {"stage": 2, "speciesId": "yuanchaoshou", "name": "渊潮兽", "reqLevel": 16}, {"stage": 3, "speciesId": "huanhailingzun", "name": "幻海灵尊", "reqLevel": 36}]'::jsonb,
    '["BAY"]'::jsonb
),
(
    'huanhailingzun', '006', '幻海灵尊', '水系沧海尊者', 'WATER', 'LEGENDARY',
    '统御无尽星辰碧海的至高神灵，所立之处惊涛如莲华绽放，深蓝神力深不可测。',
    '由【渊潮兽】达到 Lv.36 领悟深渊真意蜕变',
    '{"hp": 84, "atk": 76, "def": 104, "spAtk": 98, "spDef": 108, "speed": 80}'::jsonb,
    '[{"level": 36, "moveId": "deluge_sovereign"}, {"level": 42, "moveId": "abyssal_pulse"}]'::jsonb,
    '[{"stage": 1, "speciesId": "bishuiling", "name": "碧水灵"}, {"stage": 2, "speciesId": "yuanchaoshou", "name": "渊潮兽", "reqLevel": 16}, {"stage": 3, "speciesId": "huanhailingzun", "name": "幻海灵尊", "reqLevel": 36}]'::jsonb,
    '["BAY", "ARENA"]'::jsonb
),
(
    'qingmulu', '007', '青木鹿', '草系初阶幻灵', 'GRASS', 'RARE',
    '双角生有嫩绿幼芽的通灵小鹿，天生具有亲和万物的草木灵气，能够倾听森林心语。',
    '幻灵圣殿大长老授木仪式御三家选择 / 云梦古原繁花中偶遇',
    '{"hp": 48, "atk": 50, "def": 50, "spAtk": 60, "spDef": 60, "speed": 52}'::jsonb,
    '[{"level": 1, "moveId": "soul_tackle"}, {"level": 1, "moveId": "intimidate_roar"}, {"level": 7, "moveId": "leaf_cutter"}, {"level": 12, "moveId": "life_drain"}, {"level": 18, "moveId": "verdant_rupture"}, {"level": 32, "moveId": "primordial_canopy"}]'::jsonb,
    '[{"stage": 1, "speciesId": "qingmulu", "name": "青木鹿"}, {"stage": 2, "speciesId": "feicuijiaolu", "name": "翡翠角鹿", "reqLevel": 16}, {"stage": 3, "speciesId": "canglinshenzun", "name": "苍林神尊", "reqLevel": 36}]'::jsonb,
    '["PRAIRIE", "ACADEMY"]'::jsonb
),
(
    'feicuijiaolu', '008', '翡翠角鹿', '草系进阶灵鹿', 'GRASS', 'EPIC',
    '青木鹿头顶犄角如翡翠晶玉般繁盛生长，奔跑于原野之上便会留下一地芬芳花丛。',
    '由【青木鹿】达到 Lv.16 沐浴晨露进化',
    '{"hp": 64, "atk": 62, "def": 64, "spAtk": 82, "spDef": 78, "speed": 70}'::jsonb,
    '[{"level": 16, "moveId": "verdant_rupture"}, {"level": 25, "moveId": "life_drain"}, {"level": 36, "moveId": "primordial_canopy"}]'::jsonb,
    '[{"stage": 1, "speciesId": "qingmulu", "name": "青木鹿"}, {"stage": 2, "speciesId": "feicuijiaolu", "name": "翡翠角鹿", "reqLevel": 16}, {"stage": 3, "speciesId": "canglinshenzun", "name": "苍林神尊", "reqLevel": 36}]'::jsonb,
    '["PRAIRIE"]'::jsonb
),
(
    'canglinshenzun', '009', '苍林神尊', '草系远古森皇', 'GRASS', 'LEGENDARY',
    '苍林神境的太古守护神，顶天立地的神鹿之躯环绕天地本源绿芒，生生不息，浩瀚无边！',
    '由【翡翠角鹿】达到 Lv.36 领悟万木归一蜕变',
    '{"hp": 86, "atk": 80, "def": 85, "spAtk": 108, "spDef": 102, "speed": 89}'::jsonb,
    '[{"level": 36, "moveId": "primordial_canopy"}, {"level": 42, "moveId": "verdant_rupture"}]'::jsonb,
    '[{"stage": 1, "speciesId": "qingmulu", "name": "青木鹿"}, {"stage": 2, "speciesId": "feicuijiaolu", "name": "翡翠角鹿", "reqLevel": 16}, {"stage": 3, "speciesId": "canglinshenzun", "name": "苍林神尊", "reqLevel": 36}]'::jsonb,
    '["PRAIRIE", "ARENA"]'::jsonb
),
(
    'rongfengtu', '010', '绒风兔', '轻灵逐风灵兔', 'NORMAL', 'COMMON',
    '云梦古原极速奔跑的毛茸绒兔子，耳尖能捕捉千里微风，擅长灵巧规避攻击。',
    '【云梦古原】使用灵契晶石捕捉',
    '{"hp": 42, "atk": 52, "def": 40, "spAtk": 40, "spDef": 42, "speed": 74}'::jsonb,
    '[{"level": 1, "moveId": "soul_tackle"}, {"level": 5, "moveId": "shadow_claw"}, {"level": 14, "moveId": "spirit_gaze"}]'::jsonb,
    '[{"stage": 1, "speciesId": "rongfengtu", "name": "绒风兔"}, {"stage": 2, "speciesId": "yingfenglingtu", "name": "影风灵兔", "reqLevel": 18}]'::jsonb,
    '["PRAIRIE"]'::jsonb
),
(
    'yingfenglingtu', '011', '影风灵兔', '疾风幻影刺客', 'NORMAL', 'RARE',
    '突破速度桎梏的疾影兔，足踏狂风残影，双爪犹如疾风骤雨般迅捷无伦。',
    '由【绒风兔】达到 Lv.18 觉醒进化',
    '{"hp": 62, "atk": 84, "def": 58, "spAtk": 55, "spDef": 60, "speed": 110}'::jsonb,
    '[{"level": 18, "moveId": "shadow_claw"}, {"level": 28, "moveId": "soul_tackle"}]'::jsonb,
    '[{"stage": 1, "speciesId": "rongfengtu", "name": "绒风兔"}, {"stage": 2, "speciesId": "yingfenglingtu", "name": "影风灵兔", "reqLevel": 18}]'::jsonb,
    '["PRAIRIE"]'::jsonb
),
(
    'leiwenhou', '012', '雷纹吼', '惊雷狂暴古兽', 'ELECTRIC', 'RARE',
    '周身生有金色雷霆魔纹的凶悍灵兽，一声咆哮足以引动九天落雷震慑四方！',
    '【凌霄试炼台】雷暴浮岛使用灵契晶石捕捉',
    '{"hp": 55, "atk": 76, "def": 54, "spAtk": 80, "spDef": 58, "speed": 82}'::jsonb,
    '[{"level": 1, "moveId": "soul_tackle"}, {"level": 6, "moveId": "thunder_flash"}, {"level": 15, "moveId": "furious_spark"}, {"level": 28, "moveId": "celestial_judgment"}]'::jsonb,
    '[{"stage": 1, "speciesId": "leiwenhou", "name": "雷纹吼"}]'::jsonb,
    '["ARENA"]'::jsonb
),
(
    'jingjiaxuangui', '013', '晶甲玄龟', '厚土紫晶负岳龟', 'ROCK', 'COMMON',
    '背负嶙峋紫灵晶石的万年古龟，防御浑厚如高耸山岳，受击反震石崩巨浪。',
    '【苍炎熔渊】暗礁岩窟使用灵契晶石捕捉',
    '{"hp": 65, "atk": 62, "def": 98, "spAtk": 38, "spDef": 75, "speed": 28}'::jsonb,
    '[{"level": 1, "moveId": "soul_tackle"}, {"level": 6, "moveId": "rock_slam"}, {"level": 16, "moveId": "crystal_avalanche"}]'::jsonb,
    '[{"stage": 1, "speciesId": "jingjiaxuangui", "name": "晶甲玄龟"}]'::jsonb,
    '["VOLCANO"]'::jsonb
),
(
    'jiguangxuehu', '014', '极光雪狐', '九渊冰魄天狐', 'ICE', 'RARE',
    '雪原深处凝练极光灵气化形的银白仙狐，尾摇冰霜，吐息凝冰成镜，美丽非凡。',
    '【幻灵圣殿】后山玄冰灵池使用灵契晶石捕捉',
    '{"hp": 52, "atk": 48, "def": 56, "spAtk": 84, "spDef": 74, "speed": 76}'::jsonb,
    '[{"level": 1, "moveId": "soul_tackle"}, {"level": 6, "moveId": "frost_breath"}, {"level": 20, "moveId": "absolute_frost"}]'::jsonb,
    '[{"stage": 1, "speciesId": "jiguangxuehu", "name": "极光雪狐"}]'::jsonb,
    '["ACADEMY", "ARENA"]'::jsonb
)
ON CONFLICT (species_id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    base_stats = EXCLUDED.base_stats,
    learnable_moves = EXCLUDED.learnable_moves,
    evolution_chain = EXCLUDED.evolution_chain,
    description = EXCLUDED.description;
