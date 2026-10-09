import { BattleWeather, ElementType, PetInstance, SceneId } from '../types/game';
import { PET_SPECIES } from './species';

export interface WeatherConfig {
  id: BattleWeather;
  name: string;
  subName: string;
  icon: string;
  color: {
    badgeBg: string;
    badgeBorder: string;
    textColor: string;
    glow: string;
    bgGradient: string;
  };
  buffs: string[];
  description: string;
}

export const WEATHER_CONFIGS: Record<BattleWeather, WeatherConfig> = {
  CLEAR: {
    id: 'CLEAR',
    name: '风和日丽',
    subName: '灵气均衡',
    icon: 'SunDim',
    color: {
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-400/50',
      textColor: 'text-emerald-300',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      bgGradient: 'from-sky-950/40 to-emerald-950/40',
    },
    buffs: ['天地灵气安详，各系招式发挥正常无额外修正'],
    description: '天朗气清，惠风和畅。所有五行术法维持常规威能。',
  },

  SUNNY: {
    id: 'SUNNY',
    name: '烈阳普照',
    subName: '炽热阳炎',
    icon: 'Sun',
    color: {
      badgeBg: 'bg-amber-950/90',
      badgeBorder: 'border-amber-400',
      textColor: 'text-amber-300',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      bgGradient: 'from-orange-950/50 via-amber-950/40 to-slate-950',
    },
    buffs: [
      '🔥 火系技能威力提升 50%',
      '💧 水系技能受高温压制，威力降低 30%',
      '🌿 草木系幻灵每回合吸收阳光，回复 5% 气血',
      '❄️ 极冰系幻灵在骄阳下每回合承受 4% 融解伤害',
    ],
    description: '炽烈金阳当空，炎道气运大昌！火系神威暴涨，极冰与流水皆遭压制。',
  },

  RAIN: {
    id: 'RAIN',
    name: '倾盆暴雨',
    subName: '苍茫雨幕',
    icon: 'CloudRain',
    color: {
      badgeBg: 'bg-cyan-950/90',
      badgeBorder: 'border-cyan-400',
      textColor: 'text-cyan-300',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.6)]',
      bgGradient: 'from-blue-950/50 via-cyan-950/40 to-slate-950',
    },
    buffs: [
      '💧 水系技能受汪洋加持，威力提升 50%',
      '🔥 火系技能受水幕冲刷，威力降低 30%',
      '⚡ 暴雨导电！雷电系技能命中必中要害 (100% 暴击)',
      '🔥 火系幻灵每回合受到 4% 湿寒雨水侵蚀',
    ],
    description: '玄冥大雨连绵，水元充塞天地！水系招式翻江倒海，火系受制，天雷随水势更显迅猛。',
  },

  SANDSTORM: {
    id: 'SANDSTORM',
    name: '遮天沙暴',
    subName: '狂沙飞卷',
    icon: 'Wind',
    color: {
      badgeBg: 'bg-yellow-950/90',
      badgeBorder: 'border-yellow-500',
      textColor: 'text-yellow-300',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]',
      bgGradient: 'from-yellow-950/50 via-amber-950/40 to-slate-950',
    },
    buffs: [
      '🪨 岩石/土系技能受风暴狂澜加持，威力提升 30%',
      '🛡️ 岩石/土系幻灵特防提升，受到伤害减免 20%',
      '🌪️ 非岩石系的幻灵每回合受到 6% 最大生命值的刮擦风沙伤害',
    ],
    description: '大漠狂沙呼啸席卷，日月无光！岩土幻灵受大地庇护，其余生灵皆遭风沙刮骨。',
  },

  THUNDER: {
    id: 'THUNDER',
    name: '九天雷暴',
    subName: '神霄劫雷',
    icon: 'Zap',
    color: {
      badgeBg: 'bg-purple-950/90',
      badgeBorder: 'border-purple-400',
      textColor: 'text-purple-300',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]',
      bgGradient: 'from-purple-950/50 via-indigo-950/40 to-slate-950',
    },
    buffs: [
      '⚡ 雷电系技能受天劫引动，威力提升 40%',
      '💥 战场狂暴电磁！全员招式暴击率额外提升 25%',
      '⚡ 非雷系幻灵每回合有 25% 几率遭受天雷轰击，损失 5% 气血',
    ],
    description: '九天劫云翻滚，紫青神雷穿梭！全场电闪雷鸣，极易引动致命会心一击。',
  },
};

/**
 * Determine initial battle weather based on scene or random encounter
 */
export function getInitialWeatherForScene(sceneId: SceneId): { weather: BattleWeather; turnsLeft: number } {
  switch (sceneId) {
    case 'VOLCANO':
      return { weather: 'SUNNY', turnsLeft: 5 };
    case 'BAY':
      return { weather: 'RAIN', turnsLeft: 5 };
    case 'PRAIRIE':
      return Math.random() < 0.4 ? { weather: 'SANDSTORM', turnsLeft: 5 } : { weather: 'CLEAR', turnsLeft: 0 };
    case 'HOSPITAL':
      return { weather: 'RAIN', turnsLeft: 4 };
    case 'ARENA': {
      // Arena has rotating environmental weather!
      const weathers: BattleWeather[] = ['CLEAR', 'SUNNY', 'RAIN', 'SANDSTORM', 'THUNDER'];
      const chosen = weathers[Math.floor(Math.random() * weathers.length)];
      return { weather: chosen, turnsLeft: chosen === 'CLEAR' ? 0 : 5 };
    }
    case 'ACADEMY':
    default:
      // Academy starts clear, or 20% chance for divine thunder
      if (Math.random() < 0.2) {
        return { weather: 'THUNDER', turnsLeft: 4 };
      }
      return { weather: 'CLEAR', turnsLeft: 0 };
  }
}

/**
 * Calculate damage multiplier caused by active weather
 */
export function getWeatherDamageMultiplier(
  moveType: ElementType,
  weather: BattleWeather
): { multiplier: number; message?: string } {
  if (weather === 'SUNNY') {
    if (moveType === 'FIRE') {
      return { multiplier: 1.5, message: '【烈阳普照】烈火得骄阳助燃，威力大幅提升 50%！' };
    }
    if (moveType === 'WATER') {
      return { multiplier: 0.7, message: '【烈阳普照】水汽遭高温蒸腾，水系威力被削弱 30%！' };
    }
  } else if (weather === 'RAIN') {
    if (moveType === 'WATER') {
      return { multiplier: 1.5, message: '【倾盆暴雨】汪洋借暴雨狂澜，水系威力暴涨 50%！' };
    }
    if (moveType === 'FIRE') {
      return { multiplier: 0.7, message: '【倾盆暴雨】狂雨浇灭焰芒，火系威力被削弱 30%！' };
    }
  } else if (weather === 'SANDSTORM') {
    if (moveType === 'ROCK') {
      return { multiplier: 1.3, message: '【遮天沙暴】沙石借狂风之势，岩土威力提升 30%！' };
    }
  } else if (weather === 'THUNDER') {
    if (moveType === 'ELECTRIC') {
      return { multiplier: 1.4, message: '【九天雷暴】紫电引动劫雷轰鸣，雷系威力提升 40%！' };
    }
  }

  return { multiplier: 1.0 };
}

/**
 * End-of-turn passive weather effects on a pet (Damage or Heal)
 */
export function calculateWeatherTurnEnd(
  pet: PetInstance,
  weather: BattleWeather
): { hpChange: number; message?: string } {
  if (pet.currentHp <= 0) return { hpChange: 0 };

  const species = PET_SPECIES[pet.speciesId];
  if (!species) return { hpChange: 0 };

  const maxHp = pet.stats.hp;

  if (weather === 'SUNNY') {
    // Grass pets heal 5% max HP
    if (species.type === 'GRASS') {
      const healAmount = Math.max(1, Math.floor(maxHp * 0.05));
      return {
        hpChange: healAmount,
        message: `☀️【烈阳普照】${pet.nickname} 进行光合调息，吸收日光回复了 ${healAmount} 点气血！`,
      };
    }
    // Ice pets lose 4% HP
    if (species.type === 'ICE') {
      const chipDmg = Math.max(1, Math.floor(maxHp * 0.04));
      return {
        hpChange: -chipDmg,
        message: `☀️【烈阳普照】烈日炎炎，冰魄幻灵 ${pet.nickname} 融解损失了 ${chipDmg} 点气血！`,
      };
    }
  } else if (weather === 'RAIN') {
    // Fire pets lose 4% HP
    if (species.type === 'FIRE') {
      const chipDmg = Math.max(1, Math.floor(maxHp * 0.04));
      return {
        hpChange: -chipDmg,
        message: `🌧️【倾盆暴雨】大雨冰冷，火灵 ${pet.nickname} 受雨水侵蚀损失了 ${chipDmg} 点气血！`,
      };
    }
  } else if (weather === 'SANDSTORM') {
    // Non-Rock pets take 6% chip damage
    if (species.type !== 'ROCK') {
      const chipDmg = Math.max(1, Math.floor(maxHp * 0.06));
      return {
        hpChange: -chipDmg,
        message: `🌪️【遮天沙暴】沙石如刃！${pet.nickname} 受到狂沙割裂 ${chipDmg} 点伤害！`,
      };
    }
  } else if (weather === 'THUNDER') {
    // Non-Electric pets 25% chance to take 5% damage from random thunderbolt
    if (species.type !== 'ELECTRIC' && Math.random() < 0.25) {
      const chipDmg = Math.max(1, Math.floor(maxHp * 0.05));
      return {
        hpChange: -chipDmg,
        message: `⚡【九天雷暴】余雷轰鸣！${pet.nickname} 不慎遭天雷波及，损失了 ${chipDmg} 点气血！`,
      };
    }
  }

  return { hpChange: 0 };
}
