import { Item } from '../types/game';

export const ITEMS_DATA: Record<string, Item> = {
  gulu_normal: {
    id: 'gulu_normal',
    name: '初级星灵球',
    category: 'BALL',
    price: 100,
    catchMultiplier: 1.0,
    description: '以精炼魔铜与星晶打造的魔导星灵球，可用来收服野外初阶宠物。',
  },
  gulu_mid: {
    id: 'gulu_mid',
    name: '中级星灵球',
    category: 'BALL',
    price: 300,
    catchMultiplier: 1.6,
    description: '蕴含精纯星能的高品质星灵球，捕获野外宠物的成功率提升60%。',
  },
  gulu_high: {
    id: 'gulu_high',
    name: '高级星灵球',
    category: 'BALL',
    price: 800,
    catchMultiplier: 2.5,
    description: '皇家工坊精密炼制的进阶星灵球，大幅提高野生宠物的捕获概率。',
  },
  gulu_king: {
    id: 'gulu_king',
    name: '至尊星辰球',
    category: 'BALL',
    price: 5000,
    catchMultiplier: 99.0,
    isGuaranteed: true,
    description: '星灵王国至高无上的圣物星辰球，100%必中！必定能收服任何野外宠物！',
  },

  // Potions & Elixirs
  potion_small: {
    id: 'potion_small',
    name: '初级HP药水',
    category: 'POTION',
    price: 80,
    healHp: 50,
    description: '莉莉娅护士调配的温和伤药，恢复单只宠物 50 点精力生命。',
  },
  potion_mid: {
    id: 'potion_mid',
    name: '中级HP药水',
    category: 'POTION',
    price: 200,
    healHp: 120,
    description: '蕴含浓缩魔法因子的药剂，恢复单只宠物 120 点精力生命。',
  },
  potion_full: {
    id: 'potion_full',
    name: '高级精力全回复剂',
    category: 'POTION',
    price: 600,
    healHp: 9999,
    description: '皇家药剂大师炼制的神奇魔药，瞬间完全回满单只宠物的全部精力！',
  },
  elixir_pp: {
    id: 'elixir_pp',
    name: 'PP泉水',
    category: 'PP',
    price: 250,
    healPp: 10,
    description: '恢复单只宠物当前已装备所有招式的 10 点技能魔力（PP）。',
  },
  revive_herb: {
    id: 'revive_herb',
    name: '活力复活药剂',
    category: 'REVIVE',
    price: 500,
    isRevive: true,
    healHp: 100,
    description: '唤醒陷入战斗不能脱力的宠物，并恢复其半数精力。',
  },

  // EXP & Evolution Cultivation Treasures (星露果 / 智慧圣果)
  exp_pill_small: {
    id: 'exp_pill_small',
    name: '星露果',
    category: 'POTION',
    price: 150,
    description: '星灵王国最受宠物喜爱的甘甜果实，宠物食用后立刻获得 200 点升级经验！',
  },
  exp_pill_large: {
    id: 'exp_pill_large',
    name: '智慧圣果',
    category: 'POTION',
    price: 600,
    description: '星灵王国传说中极其珍贵的魔法圣果，宠物食用后暴涨 1000 点升级经验！',
  },
  spirit_shard: {
    id: 'spirit_shard',
    name: '星光友谊碎片',
    category: 'POTION',
    price: 100,
    description: '小魔法师每日互相赠送的友谊之证，集齐可在好友中心兑换珍稀星灵球与星露果。',
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
