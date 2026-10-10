import { Item } from '../types/game';

export const ITEMS_DATA: Record<string, Item> = {
  gulu_normal: {
    id: 'gulu_normal',
    name: '初级幻灵球',
    category: 'BALL',
    price: 100,
    catchMultiplier: 1.0,
    description: '以精炼魔铜与幻晶打造的魔导幻灵球，可用来收服野外初阶幻灵。',
  },
  gulu_mid: {
    id: 'gulu_mid',
    name: '中级幻灵球',
    category: 'BALL',
    price: 300,
    catchMultiplier: 1.6,
    description: '蕴含精纯幻能的高品质幻灵球，捕获野外幻灵的成功率提升60%。',
  },
  gulu_high: {
    id: 'gulu_high',
    name: '高级幻灵球',
    category: 'BALL',
    price: 800,
    catchMultiplier: 2.5,
    description: '皇家工坊精密炼制的进阶幻灵球，大幅提高野生幻灵的捕获概率。',
  },
  gulu_king: {
    id: 'gulu_king',
    name: '至尊幻灵球',
    category: 'BALL',
    price: 5000,
    catchMultiplier: 99.0,
    isGuaranteed: true,
    description: '幻灵世界至高无上的圣物幻灵球，100%必中！必定能收服任何野外幻灵！',
  },

  // Potions & Elixirs
  potion_small: {
    id: 'potion_small',
    name: '初级HP药水',
    category: 'POTION',
    price: 80,
    healHp: 50,
    description: '莉莉娅护士调配的温和伤药，恢复单只幻灵 50 点精力生命。',
  },
  potion_mid: {
    id: 'potion_mid',
    name: '中级HP药水',
    category: 'POTION',
    price: 200,
    healHp: 120,
    description: '蕴含浓缩魔法因子的药剂，恢复单只幻灵 120 点精力生命。',
  },
  potion_full: {
    id: 'potion_full',
    name: '高级精力全回复剂',
    category: 'POTION',
    price: 600,
    healHp: 9999,
    description: '皇家药剂大师炼制的神奇魔药，瞬间完全回满单只幻灵的全部精力！',
  },
  elixir_pp: {
    id: 'elixir_pp',
    name: 'PP泉水',
    category: 'PP',
    price: 250,
    healPp: 10,
    description: '恢复单只幻灵当前已装备所有招式的 10 点技能魔力（PP）。',
  },
  revive_herb: {
    id: 'revive_herb',
    name: '活力复活药剂',
    category: 'REVIVE',
    price: 500,
    isRevive: true,
    healHp: 100,
    description: '唤醒陷入战斗脱力的幻灵，并恢复其半数精力。',
  },

  // EXP & Evolution Cultivation Treasures (幻灵果 / 智慧圣果)
  exp_pill_small: {
    id: 'exp_pill_small',
    name: '幻灵果',
    category: 'POTION',
    price: 150,
    description: '幻灵世界最受幻灵喜爱的甘甜果实，幻灵食用后立刻获得 200 点升级经验！',
  },
  exp_pill_large: {
    id: 'exp_pill_large',
    name: '智慧圣果',
    category: 'POTION',
    price: 600,
    description: '幻灵世界传说中极其珍贵的魔法圣果，幻灵食用后暴涨 1000 点升级经验！',
  },
  spirit_shard: {
    id: 'spirit_shard',
    name: '友谊幻灵碎片',
    category: 'POTION',
    price: 100,
    description: '小魔法师每日互相赠送的友谊之证，集齐可在好友中心兑换珍稀幻灵球与幻灵果。',
  },

  // Cultivation & Alchemy Treasures
  xi_sui_dan: {
    id: 'xi_sui_dan',
    name: '天赋洗礼魔药',
    category: 'CULTIVATION',
    price: 800,
    sellPrice: 400,
    description: '皇家魔法学院秘制的洗礼魔药，可重塑宠物各项天资与潜能资质(1~31)！',
  },
  ding_hun_dan: {
    id: 'ding_hun_dan',
    name: '性格洗礼魔药',
    category: 'CULTIVATION',
    price: 600,
    sellPrice: 300,
    description: '调和精神力的神奇魔药，可洗练并重塑宠物先天性格，调整属性专精倾向！',
  },
};
