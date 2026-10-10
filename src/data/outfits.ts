import { CharacterOutfit, OutfitItem, OutfitPreset, OutfitSlot } from '../types/game';

/**
 * 默认初始穿搭 (Default Young Wizard Outfit)
 */
export const DEFAULT_CHARACTER_OUTFIT: CharacterOutfit = {
  hatId: 'hat_classic_wizard',
  hairId: 'hair_golden_fluffy',
  robeId: 'robe_academy_blue',
  handheldId: 'wand_star_crystal',
  wingsId: 'wings_none',
  auraId: 'aura_starlight',
};

/**
 * 星灵王国 装扮部位数据字典
 */
export const OUTFIT_ITEMS: Record<string, OutfitItem> = {
  // ==========================================
  // 1. 帽子 / 头部发饰 (HAT)
  // ==========================================
  hat_classic_wizard: {
    id: 'hat_classic_wizard',
    name: '经典星夜魔法帽',
    slot: 'HAT',
    rarity: 'COMMON',
    description: '深蓝缎面星芒大巫师帽，顶端微微弯曲，缀以金星胸针，是星灵王国的经典象征。',
    bonusText: '魔攻加成 +5',
    unlockedByDefault: true,
    colors: { primary: '#1e3a8a', secondary: '#facc15', accent: '#38bdf8' },
  },
  hat_knight_helm: {
    id: 'hat_knight_helm',
    name: '皇家骑士金羽战盔',
    slot: 'HAT',
    rarity: 'EPIC',
    description: '兰斯洛团长亲授的皇家骑士团黄金羽盔，流转纯白圣光，象征坚毅与荣耀。',
    priceCoins: 1200,
    bonusText: '物防 +15 · 战斗减伤 3%',
    colors: { primary: '#e2e8f0', secondary: '#eab308', accent: '#ffffff' },
  },
  hat_flame_crown: {
    id: 'hat_flame_crown',
    name: '炽焰红莲法师冠',
    slot: 'HAT',
    rarity: 'RARE',
    description: '烈焰峡谷地心淬炼的炽火冠冕，镶嵌璀璨红宝石，跃动着温暖纯净的火苗。',
    priceCoins: 800,
    bonusText: '火系技能伤害 +8%',
    colors: { primary: '#dc2626', secondary: '#f59e0b', accent: '#ef4444' },
  },
  hat_academy_beret: {
    id: 'hat_academy_beret',
    name: '微风学园贝雷帽',
    slot: 'HAT',
    rarity: 'COMMON',
    description: '微风轻拂的草香针织贝雷帽，缀有羽毛胸针，尽显年轻学者的儒雅学风。',
    priceCoins: 500,
    bonusText: '经验获取 +5%',
    colors: { primary: '#0284c7', secondary: '#facc15', accent: '#38bdf8' },
  },
  hat_bunny_hood: {
    id: 'hat_bunny_hood',
    name: '灵动萌兔绒毛帽',
    slot: 'HAT',
    rarity: 'RARE',
    description: '软萌毛绒白兔长耳帽，垂下两只毛绒长耳，元气满满，萌力翻倍！',
    priceCoins: 900,
    bonusText: '野外捕捉成功率 +5%',
    colors: { primary: '#fdf2f8', secondary: '#ec4899', accent: '#fbcfe8' },
  },
  hat_astrologer_hood: {
    id: 'hat_astrologer_hood',
    name: '幽夜幻星占星兜帽',
    slot: 'HAT',
    rarity: 'LEGENDARY',
    description: '深邃紫夜织就的占星学大师兜帽，缀满细碎星屑，能洞察万物天机。',
    priceDiamonds: 88,
    bonusText: '暴击率 +8% · 魔攻 +20',
    colors: { primary: '#4c1d95', secondary: '#c084fc', accent: '#e9d5ff' },
  },

  // ==========================================
  // 2. 发型 / 发色 (HAIR)
  // ==========================================
  hair_golden_fluffy: {
    id: 'hair_golden_fluffy',
    name: '金阳蓬松微卷发',
    slot: 'HAIR',
    rarity: 'COMMON',
    description: '如同暖阳般温暖耀眼的金色卷发，阳光帅气，活力充沛。',
    bonusText: '移速 +3%',
    unlockedByDefault: true,
    colors: { primary: '#facc15', secondary: '#d97706', accent: '#fef08a' },
  },
  hair_deep_navy: {
    id: 'hair_deep_navy',
    name: '幽邃星夜深蓝发',
    slot: 'HAIR',
    rarity: 'RARE',
    description: '神秘深邃的静谧蓝调短发，如夜空般沉静内敛，令人倍感信赖。',
    priceCoins: 600,
    bonusText: '魔抗 +10',
    colors: { primary: '#1e40af', secondary: '#0f172a', accent: '#60a5fa' },
  },
  hair_sakura_twintails: {
    id: 'hair_sakura_twintails',
    name: '樱粉流光双马尾',
    slot: 'HAIR',
    rarity: 'RARE',
    description: '轻盈俏皮的樱花粉色双马尾，随风起舞跃动甜美魔法光晕。',
    priceCoins: 750,
    bonusText: '生命精力上限 +30',
    colors: { primary: '#f472b6', secondary: '#be185d', accent: '#fbcfe8' },
  },
  hair_silver_frost: {
    id: 'hair_silver_frost',
    name: '银月霜雪凌霜发',
    slot: 'HAIR',
    rarity: 'EPIC',
    description: '纯净清冽的白银齐肩发，宛若雪人谷皑皑白雪中折射的月华。',
    priceCoins: 1100,
    bonusText: '冰系技能减伤 10%',
    colors: { primary: '#e2e8f0', secondary: '#94a3b8', accent: '#ffffff' },
  },
  hair_crimson_wild: {
    id: 'hair_crimson_wild',
    name: '烈火赤红飞扬发',
    slot: 'HAIR',
    rarity: 'EPIC',
    description: '炽热如火的赤红烈焰飞扬短发，张扬果敢，战意高昂。',
    priceCoins: 1100,
    bonusText: '物攻 +15 · 暴击伤害 +10%',
    colors: { primary: '#ef4444', secondary: '#991b1b', accent: '#fca5a5' },
  },

  // ==========================================
  // 3. 服饰 / 法袍 (ROBE)
  // ==========================================
  robe_academy_blue: {
    id: 'robe_academy_blue',
    name: '经典皇家学园袍',
    slot: 'ROBE',
    rarity: 'COMMON',
    description: '深蓝披风搭配红色马甲与金色排扣，每一位初入王国的学员标志性制服。',
    bonusText: '全属性 +3',
    unlockedByDefault: true,
    colors: { primary: '#1e3a8a', secondary: '#b91c1c', accent: '#facc15' },
  },
  robe_paladin_armor: {
    id: 'robe_paladin_armor',
    name: '皇家神圣圣骑铠',
    slot: 'ROBE',
    rarity: 'EPIC',
    description: '厚重的白银胸甲镶嵌黄金十字纹章，内衬神圣雪白披风，固若金汤。',
    priceCoins: 1500,
    bonusText: '物防 +25 · 受到暴击概率降低 15%',
    colors: { primary: '#e2e8f0', secondary: '#d97706', accent: '#ffffff' },
  },
  robe_flame_archmage: {
    id: 'robe_flame_archmage',
    name: '烈焰魔导长袍',
    slot: 'ROBE',
    rarity: 'EPIC',
    description: '烈火赤红披风流转熔岩魔纹，下摆翻涌着真火之炎，威仪非凡。',
    priceCoins: 1500,
    bonusText: '魔攻 +25 · 火系威能 +12%',
    colors: { primary: '#dc2626', secondary: '#7f1d1d', accent: '#f59e0b' },
  },
  robe_ocean_mermaid: {
    id: 'robe_ocean_mermaid',
    name: '蔚蓝海湾灵波裙',
    slot: 'ROBE',
    rarity: 'RARE',
    description: '以深海珍珠丝与蔚蓝灵波织就的法裙，走动间泛起碧波涟漪。',
    priceCoins: 950,
    bonusText: '水系技能威力 +10% · 闪避 +4%',
    colors: { primary: '#0284c7', secondary: '#0e7490', accent: '#38bdf8' },
  },
  robe_starlight_tuxedo: {
    id: 'robe_starlight_tuxedo',
    name: '星夜占星礼服',
    slot: 'ROBE',
    rarity: 'LEGENDARY',
    description: '暗夜深紫丝绒礼服，肩部装点银河星轨刺绣，低调奢华，光彩夺目。',
    priceDiamonds: 128,
    bonusText: '魔攻 +30 · 速度 +15 · 幸运 +10%',
    colors: { primary: '#3b0764', secondary: '#1e1b4b', accent: '#c084fc' },
  },

  // ==========================================
  // 4. 手持 / 魔杖法器 (HANDHELD)
  // ==========================================
  wand_star_crystal: {
    id: 'wand_star_crystal',
    name: '星光蓝晶魔杖',
    slot: 'HANDHELD',
    rarity: 'COMMON',
    description: '精雕神木杖身，顶端镶嵌微光闪耀的蔚蓝星钻，小魔法师的基本法器。',
    bonusText: '技能PP消耗降低 5%',
    unlockedByDefault: true,
    colors: { primary: '#92400e', secondary: '#38bdf8', accent: '#67e8f9' },
  },
  wand_oath_blade: {
    id: 'wand_oath_blade',
    name: '皇家誓约黄金短剑',
    slot: 'HANDHELD',
    rarity: 'EPIC',
    description: '皇家骑士团荣誉短剑，剑鞘镶嵌王室红宝石，出鞘时伴有龙吟剑鸣。',
    priceCoins: 1200,
    bonusText: '物攻 +20 · 破甲 +10%',
    colors: { primary: '#eab308', secondary: '#dc2626', accent: '#ffffff' },
  },
  wand_aurora_staff: {
    id: 'wand_aurora_staff',
    name: '极光极冰神木法杖',
    slot: 'HANDHELD',
    rarity: 'RARE',
    description: '采集永冻冰晶研磨的长柄法杖，顶端绽放极光之芒，冰冷刺骨。',
    priceCoins: 850,
    bonusText: '冰系招式冻结几率 +8%',
    colors: { primary: '#06b6d4', secondary: '#1e3a8a', accent: '#a5f3fc' },
  },
  wand_phoenix_fan: {
    id: 'wand_phoenix_fan',
    name: '神凰烈火灵羽宝扇',
    slot: 'HANDHELD',
    rarity: 'EPIC',
    description: '以赤焰神凰尾羽织造的温润宝扇，挥动间热浪滔天、火雨连绵。',
    priceCoins: 1300,
    bonusText: '火系暴击率 +10%',
    colors: { primary: '#ea580c', secondary: '#facc15', accent: '#ffedd5' },
  },
  wand_carrot_wand: {
    id: 'wand_carrot_wand',
    name: '魔法胡萝卜仙女棒',
    slot: 'HANDHELD',
    rarity: 'RARE',
    description: '镶嵌草系粉钻的可爱胡萝卜法杖，轻轻一点便能召唤花瓣与胡萝卜雨！',
    priceCoins: 700,
    bonusText: '治疗恢复效果提升 15%',
    colors: { primary: '#f97316', secondary: '#22c55e', accent: '#fef08a' },
  },

  // ==========================================
  // 5. 背饰 / 羽翼 (WINGS)
  // ==========================================
  wings_none: {
    id: 'wings_none',
    name: '轻装上阵 (无背饰)',
    slot: 'WINGS',
    rarity: 'COMMON',
    description: '卸下厚重背饰，轻快灵巧，无拘无束。',
    unlockedByDefault: true,
  },
  wings_seraph_light: {
    id: 'wings_seraph_light',
    name: '圣天使幻彩流光翼',
    slot: 'WINGS',
    rarity: 'LEGENDARY',
    description: '舒展如天神降世的六瓣圣洁神翼，散发淡淡七彩霞光，尊贵威严。',
    priceDiamonds: 99,
    bonusText: '全属性 +10 · 场景移动速度 +20%',
    colors: { primary: '#ffffff', secondary: '#fde047', accent: '#38bdf8' },
  },
  wings_steampunk_jet: {
    id: 'wings_steampunk_jet',
    name: '机械发条飞行背包',
    slot: 'WINGS',
    rarity: 'RARE',
    description: '皇家工程院特制的蒸汽发条飞行器，黄铜齿轮飞转，蒸汽轰鸣。',
    priceCoins: 1200,
    bonusText: '逃跑成功率 +20%',
    colors: { primary: '#b45309', secondary: '#78350f', accent: '#f59e0b' },
  },
  wings_shadow_demon: {
    id: 'wings_shadow_demon',
    name: '幽暗夜影恶魔蝠翼',
    slot: 'WINGS',
    rarity: 'EPIC',
    description: '漆黑幽紫的恶魔小巧蝠翼，周围萦绕淡淡幽火，散发神秘危险气息。',
    priceCoins: 1600,
    bonusText: '先手速度 +12 · 恶魔系克制伤害 +10%',
    colors: { primary: '#3b0764', secondary: '#7e22ce', accent: '#c084fc' },
  },
  wings_astral_rings: {
    id: 'wings_astral_rings',
    name: '星轨奥术浮空法环',
    slot: 'WINGS',
    rarity: 'EPIC',
    description: '背后悬浮的三道环状奥术星轨，按照天体定律缓缓旋转运转。',
    priceCoins: 1400,
    bonusText: '魔攻 +18 · 闪避 +5%',
    colors: { primary: '#0284c7', secondary: '#818cf8', accent: '#67e8f9' },
  },

  // ==========================================
  // 6. 脚底光环 / 足迹 (AURA)
  // ==========================================
  aura_starlight: {
    id: 'aura_starlight',
    name: '星芒微光法阵',
    slot: 'AURA',
    rarity: 'COMMON',
    description: '脚下徐徐旋转的淡蓝星芒魔法圆盘，象征小魔法师与星空的誓约。',
    unlockedByDefault: true,
    colors: { primary: '#38bdf8', secondary: '#818cf8', accent: '#ffffff' },
  },
  aura_blazing_fire: {
    id: 'aura_blazing_fire',
    name: '炽热红莲炎印',
    slot: 'AURA',
    rarity: 'RARE',
    description: '脚底烈火翻涌的八瓣火莲法阵，每踏一步皆有火星四溅飞舞。',
    priceCoins: 800,
    bonusText: '火系威能 +5%',
    colors: { primary: '#ef4444', secondary: '#f59e0b', accent: '#fee2e2' },
  },
  aura_azure_ripples: {
    id: 'aura_azure_ripples',
    name: '碧波水涟光环',
    slot: 'AURA',
    rarity: 'RARE',
    description: '脚底流转清透的碧波水浪，如步履踏在清泉之水上，心神宁静。',
    priceCoins: 800,
    bonusText: '每回合生命回复 +2%',
    colors: { primary: '#06b6d4', secondary: '#0284c7', accent: '#e0f2fe' },
  },
  aura_golden_glory: {
    id: 'aura_golden_glory',
    name: '王者真金耀芒',
    slot: 'AURA',
    rarity: 'LEGENDARY',
    description: '尊贵耀眼的皇家金辉辐射光轮，金光万道，彰显至尊天梯王者身份。',
    priceDiamonds: 68,
    bonusText: '对战初始威压：敌方攻击降低 5%',
    colors: { primary: '#facc15', secondary: '#eab308', accent: '#ffffff' },
  },
};

/**
 * 经典官方全套预设 (Full Outfit Presets)
 */
export const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    id: 'preset_classic_academy',
    name: '经典学园生',
    description: '星灵王国最经典的学员装扮，星夜巫师帽搭配深蓝斗篷。',
    themeColor: '#2563eb',
    outfit: {
      hatId: 'hat_classic_wizard',
      hairId: 'hair_golden_fluffy',
      robeId: 'robe_academy_blue',
      handheldId: 'wand_star_crystal',
      wingsId: 'wings_none',
      auraId: 'aura_starlight',
    },
  },
  {
    id: 'preset_royal_paladin',
    name: '皇家圣骑士',
    description: '兰斯洛骑士团直属近卫骑士装束，黄金战盔与荣耀誓约短剑。',
    themeColor: '#eab308',
    outfit: {
      hatId: 'hat_knight_helm',
      hairId: 'hair_golden_fluffy',
      robeId: 'robe_paladin_armor',
      handheldId: 'wand_oath_blade',
      wingsId: 'wings_seraph_light',
      auraId: 'aura_golden_glory',
    },
  },
  {
    id: 'preset_flame_archmage',
    name: '烈焰大魔导',
    description: '烈焰峡谷熔岩掌控者，赤红冠冕与烈火大披风。',
    themeColor: '#ea580c',
    outfit: {
      hatId: 'hat_flame_crown',
      hairId: 'hair_crimson_wild',
      robeId: 'robe_flame_archmage',
      handheldId: 'wand_phoenix_fan',
      wingsId: 'wings_shadow_demon',
      auraId: 'aura_blazing_fire',
    },
  },
  {
    id: 'preset_ocean_mermaid',
    name: '沧海人鱼灵',
    description: '蔚蓝海湾沧海之女与蔚蓝水族装扮，流光羽扇与碧波清涟。',
    themeColor: '#06b6d4',
    outfit: {
      hatId: 'hat_academy_beret',
      hairId: 'hair_deep_navy',
      robeId: 'robe_ocean_mermaid',
      handheldId: 'wand_aurora_staff',
      wingsId: 'wings_astral_rings',
      auraId: 'aura_azure_ripples',
    },
  },
  {
    id: 'preset_star_astrologer',
    name: '星夜占星师',
    description: '云霄星轨占星阁大导师，幽紫长袍与浮空奥术环。',
    themeColor: '#8b5cf6',
    outfit: {
      hatId: 'hat_astrologer_hood',
      hairId: 'hair_silver_frost',
      robeId: 'robe_starlight_tuxedo',
      handheldId: 'wand_star_crystal',
      wingsId: 'wings_astral_rings',
      auraId: 'aura_starlight',
    },
  },
  {
    id: 'preset_bunny_sweet',
    name: '元气萌兔使',
    description: '翡翠平原花海间的可爱兔耳少女，搭配仙女胡萝卜棒。',
    themeColor: '#ec4899',
    outfit: {
      hatId: 'hat_bunny_hood',
      hairId: 'hair_sakura_twintails',
      robeId: 'robe_academy_blue',
      handheldId: 'wand_carrot_wand',
      wingsId: 'wings_steampunk_jet',
      auraId: 'aura_starlight',
    },
  },
];

export const RARITY_LABELS: Record<string, { label: string; badgeClass: string; borderClass: string }> = {
  COMMON: {
    label: '经典',
    badgeClass: 'bg-slate-700/80 text-slate-200 border-slate-600',
    borderClass: 'border-slate-700',
  },
  RARE: {
    label: '精良',
    badgeClass: 'bg-blue-900/80 text-blue-300 border-blue-500',
    borderClass: 'border-blue-500/60',
  },
  EPIC: {
    label: '史诗',
    badgeClass: 'bg-purple-900/80 text-purple-300 border-purple-500',
    borderClass: 'border-purple-500/70',
  },
  LEGENDARY: {
    label: '传世',
    badgeClass: 'bg-amber-900/90 text-amber-300 border-amber-400 font-bold',
    borderClass: 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  },
};

export const OUTFIT_SLOT_TABS: { slot: OutfitSlot | 'ALL'; label: string; icon: string }[] = [
  { slot: 'ALL', label: '全部装扮', icon: 'Sparkles' },
  { slot: 'HAT', label: '头部/帽子', icon: 'Crown' },
  { slot: 'HAIR', label: '发型/发色', icon: 'Smile' },
  { slot: 'ROBE', label: '服饰/法袍', icon: 'Shirt' },
  { slot: 'HANDHELD', label: '手持/法器', icon: 'Wand2' },
  { slot: 'WINGS', label: '背饰/羽翼', icon: 'Feather' },
  { slot: 'AURA', label: '光环/足迹', icon: 'Sun' },
];
