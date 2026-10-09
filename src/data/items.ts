import { Item } from '../types/game';

export const ITEMS_DATA: Record<string, Item> = {
  gulu_normal: {
    id: 'gulu_normal',
    name: '初阶灵契晶',
    category: 'BALL',
    price: 100,
    catchMultiplier: 1.0,
    description: '以灵玉打磨的初级契约晶石，可用来收服野外初阶幻灵。',
  },
  gulu_mid: {
    id: 'gulu_mid',
    name: '玄阶凝灵晶',
    category: 'BALL',
    price: 300,
    catchMultiplier: 1.6,
    description: '蕴含精纯灵力的凝灵宝玉，契约捕获概率提升60%。',
  },
  gulu_high: {
    id: 'gulu_high',
    name: '天阶破界晶',
    category: 'BALL',
    price: 800,
    catchMultiplier: 2.5,
    description: '天工古法炼制的破界晶石，散发耀目光辉，大幅提高捕获概率。',
  },
  gulu_king: {
    id: 'gulu_king',
    name: '混元圣皇晶',
    category: 'BALL',
    price: 5000,
    catchMultiplier: 99.0,
    isGuaranteed: true,
    description: '幻灵秘境至高无上的圣物，必定能与任何野外幻灵结下本命契约！',
  },

  // Potions & Elixirs
  potion_small: {
    id: 'potion_small',
    name: '初级回春灵露',
    category: 'POTION',
    price: 80,
    healHp: 50,
    description: '采集灵草清晨凝露炼制，恢复单只幻灵 50 点生命值。',
  },
  potion_mid: {
    id: 'potion_mid',
    name: '紫玉凝气丸',
    category: 'POTION',
    price: 200,
    healHp: 120,
    description: '紫灵花瓣研磨成的珍贵灵丹，恢复单只幻灵 120 点生命值。',
  },
  potion_full: {
    id: 'potion_full',
    name: '天髓造化灵泉',
    category: 'POTION',
    price: 600,
    healHp: 9999,
    description: '蕴含无尽生命精华的古泉之水，瞬间完全回复幻灵全部生命！',
  },
  elixir_pp: {
    id: 'elixir_pp',
    name: '凝神还真丹',
    category: 'PP',
    price: 250,
    healPp: 10,
    description: '恢复单只幻灵所有招式的 10 点技能灵力（PP）。',
  },
  revive_herb: {
    id: 'revive_herb',
    name: '返魂定魄草',
    category: 'REVIVE',
    price: 500,
    isRevive: true,
    healHp: 100,
    description: '唤醒陷入濒死脱力的幻灵，并恢复其半数生命值。',
  },

  // EXP & Evolution Treasures (洛克王国严父果 / 赛尔号升级经验果 / 奥奇传说经验果)
  exp_pill_small: {
    id: 'exp_pill_small',
    name: '玄灵凝魄果',
    category: 'POTION',
    price: 150,
    description: '蕴含充沛灵蕴的奇异果实，幻灵食用后立刻获得 200 点历练经验！',
  },
  exp_pill_large: {
    id: 'exp_pill_large',
    name: '九转通天仙果',
    category: 'POTION',
    price: 600,
    description: '千年一熟的天地仙果，幻灵吞服后立刻暴涨 1000 点历练经验，极速觉醒！',
  },
  spirit_shard: {
    id: 'spirit_shard',
    name: '灵力碎片',
    category: 'POTION',
    price: 100,
    description: '仙友每日灵犀相通互赠的灵力碎片，集齐可在灵友仙阁兑换珍稀契约晶石与九转仙果。',
  },
};
