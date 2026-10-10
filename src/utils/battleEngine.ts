import { ElementType, Move, PetInstance, PetSpecies, BattleWeather } from '../types/game';
import { MOVES_DATA } from '../data/moves';
import { PET_SPECIES } from '../data/species';

export const TYPE_CHART: Record<ElementType, Partial<Record<ElementType, number>>> = {
  FIRE: {
    GRASS: 2.0,
    ICE: 2.0,
    WATER: 0.5,
    FIRE: 0.5,
    ROCK: 0.5,
  },
  WATER: {
    FIRE: 2.0,
    ROCK: 2.0,
    GRASS: 0.5,
    WATER: 0.5,
  },
  GRASS: {
    WATER: 2.0,
    ROCK: 2.0,
    FIRE: 0.5,
    GRASS: 0.5,
  },
  ELECTRIC: {
    WATER: 2.0,
    GRASS: 0.5,
    ELECTRIC: 0.5,
  },
  ICE: {
    GRASS: 2.0,
    FIRE: 0.5,
    WATER: 0.5,
    ICE: 0.5,
  },
  ROCK: {
    FIRE: 2.0,
    ICE: 2.0,
    ELECTRIC: 1.5,
    GRASS: 0.5,
    WATER: 0.5,
  },
  NORMAL: {
    ROCK: 0.75,
  },
};

export function getTypeMultiplier(attackType: ElementType, defenderType: ElementType): number {
  const mult = TYPE_CHART[attackType]?.[defenderType];
  return mult !== undefined ? mult : 1.0;
}

export function calculateMaxExp(level: number): number {
  return Math.floor(4 * Math.pow(level, 2.4)) + 40;
}

export function calculateStats(species: PetSpecies, level: number) {
  const hp = Math.floor((species.baseStats.hp * 2 * level) / 100 + level + 10);
  const atk = Math.floor((species.baseStats.atk * 2 * level) / 100 + 5);
  const def = Math.floor((species.baseStats.def * 2 * level) / 100 + 5);
  const spAtk = Math.floor((species.baseStats.spAtk * 2 * level) / 100 + 5);
  const spDef = Math.floor((species.baseStats.spDef * 2 * level) / 100 + 5);
  const speed = Math.floor((species.baseStats.speed * 2 * level) / 100 + 5);
  return { hp, maxHp: hp, atk, def, spAtk, spDef, speed };
}

export const NATURES = ['固执 (+物攻)', '保守 (+魔攻)', '胆小 (+速度)', '勇敢 (+物攻)', '温顺 (+魔防)', '坦率 (平衡)'];

export function createPetInstance(speciesId: string, level: number, customNickname?: string): PetInstance {
  const species = PET_SPECIES[speciesId];
  if (!species) throw new Error(`Species ${speciesId} not found`);

  const stats = calculateStats(species, level);
  const moves: { id: string; pp: number; maxPp: number }[] = [];

  // Pick the 4 most recent moves learnt up to this level
  const availableMoves = species.learnableMoves.filter(m => m.level <= level);
  const chosenMoves = availableMoves.slice(-4);
  if (chosenMoves.length === 0 && species.learnableMoves.length > 0) {
    chosenMoves.push(species.learnableMoves[0]);
  }

  chosenMoves.forEach(m => {
    const moveData = MOVES_DATA[m.moveId];
    if (moveData) {
      moves.push({
        id: m.moveId,
        pp: moveData.maxPp,
        maxPp: moveData.maxPp,
      });
    }
  });

  const nature = NATURES[Math.floor(Math.random() * NATURES.length)];

  return {
    uid: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    speciesId,
    nickname: customNickname || species.name,
    level,
    exp: 0,
    maxExp: calculateMaxExp(level),
    currentHp: stats.hp,
    stats,
    moves,
    statusEffect: null,
    statusTurns: 0,
    nature,
    statStages: { atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 },
    talentScore: Math.floor(Math.random() * 12) + 20,
    isShiny: Math.random() < 0.05, // 5% chance wild shiny!
    learnedMoveIds: chosenMoves.map((m) => m.moveId),
  };
}

export function getUnlockedLearnableMoves(speciesId: string, level: number): string[] {
  const species = PET_SPECIES[speciesId];
  if (!species) return [];
  return species.learnableMoves.filter((m) => m.level <= level).map((m) => m.moveId);
}

export function rerollTalentScore(): number {
  return Math.min(31, Math.floor(Math.random() * 14) + 18);
}

export function getRandomNature(): string {
  return NATURES[Math.floor(Math.random() * NATURES.length)];
}

export function calculateDamage(
  attacker: PetInstance,
  defender: PetInstance,
  move: Move,
  weather: BattleWeather = 'CLEAR'
): {
  damage: number;
  multiplier: number;
  isCritical: boolean;
  weatherMultiplier: number;
  weatherMsg?: string;
} {
  if (move.category === 'STATUS') {
    return { damage: 0, multiplier: 1, isCritical: false, weatherMultiplier: 1.0 };
  }

  const attackerSpecies = PET_SPECIES[attacker.speciesId];
  const defenderSpecies = PET_SPECIES[defender.speciesId];

  const isSpecial = move.category === 'SPECIAL';
  let attackStat = isSpecial ? attacker.stats.spAtk : attacker.stats.atk;
  let defenseStat = isSpecial ? defender.stats.spDef : defender.stats.def;

  // Stat stage multipliers (-6 to +6)
  const getStageMultiplier = (stage: number = 0) => {
    const clamped = Math.max(-6, Math.min(6, stage));
    if (clamped >= 0) return (2 + clamped) / 2;
    return 2 / (2 - clamped);
  };

  const atkStage = isSpecial ? (attacker.statStages?.spAtk || 0) : (attacker.statStages?.atk || 0);
  const defStage = isSpecial ? (defender.statStages?.spDef || 0) : (defender.statStages?.def || 0);

  attackStat = Math.max(1, Math.floor(attackStat * getStageMultiplier(atkStage)));
  defenseStat = Math.max(1, Math.floor(defenseStat * getStageMultiplier(defStage)));

  const multiplier = getTypeMultiplier(move.type, defenderSpecies.type);

  // Weather damage & effect modifier
  let weatherMultiplier = 1.0;
  let weatherMsg: string | undefined;

  if (weather === 'SUNNY') {
    if (move.type === 'FIRE') {
      weatherMultiplier = 1.5;
      weatherMsg = '【烈阳普照】火系威能大增 50%！';
    } else if (move.type === 'WATER') {
      weatherMultiplier = 0.7;
      weatherMsg = '【烈阳普照】水汽蒸腾，水系削弱 30%！';
    }
  } else if (weather === 'RAIN') {
    if (move.type === 'WATER') {
      weatherMultiplier = 1.5;
      weatherMsg = '【倾盆暴雨】汪洋借暴雨狂澜，水系威力暴涨 50%！';
    } else if (move.type === 'FIRE') {
      weatherMultiplier = 0.7;
      weatherMsg = '【倾盆暴雨】大雨浇灭焰芒，火系削弱 30%！';
    }
  } else if (weather === 'SANDSTORM') {
    if (move.type === 'ROCK') {
      weatherMultiplier = 1.3;
      weatherMsg = '【遮天沙暴】沙石如刃，岩土威力提升 30%！';
    }
    if (defenderSpecies.type === 'ROCK') {
      weatherMultiplier *= 0.8;
      weatherMsg = (weatherMsg ? weatherMsg + ' ' : '') + '【遮天沙暴】岩甲护体减免 20% 伤害！';
    }
  } else if (weather === 'THUNDER') {
    if (move.type === 'ELECTRIC') {
      weatherMultiplier = 1.4;
      weatherMsg = '【极天雷暴】引动极光狂雷，电系魔法威力提升 40%！';
    }
  }

  // Critical hit calculation: Base 10%, in Thunderstorm +25%, in Rain electric moves 100%
  let critChance = 0.1;
  if (weather === 'THUNDER') critChance += 0.25;

  let isCritical = Math.random() < critChance;
  if (weather === 'RAIN' && move.type === 'ELECTRIC') {
    isCritical = true; // Rain conduct electricity! Guaranteed crit!
    weatherMsg = (weatherMsg ? weatherMsg + ' ' : '') + '【倾盆暴雨】暴雨导电！雷电必中要害！';
  }
  const critMultiplier = isCritical ? 1.5 : 1.0;

  // Classic Pokemon / Roco damage calculation formula
  const baseDamage =
    (((2 * attacker.level) / 5 + 2) * move.power * (attackStat / Math.max(1, defenseStat))) / 50 + 2;

  // Random fluctuation 0.88 - 1.0
  const randomFactor = 0.88 + Math.random() * 0.12;

  // Same Type Attack Bonus (STAB)
  const stab = attackerSpecies.type === move.type ? 1.25 : 1.0;

  const totalDamage = Math.max(
    1,
    Math.floor(baseDamage * multiplier * weatherMultiplier * critMultiplier * randomFactor * stab)
  );

  return {
    damage: totalDamage,
    multiplier,
    isCritical,
    weatherMultiplier,
    weatherMsg,
  };
}

export function calculateCatchRate(
  wildPet: PetInstance,
  ballMultiplier: number,
  isGuaranteed?: boolean
): { success: boolean; shakes: number } {
  if (isGuaranteed) {
    return { success: true, shakes: 3 };
  }

  const hpFactor = (3 * wildPet.stats.hp - 2 * wildPet.currentHp) / (3 * wildPet.stats.hp);
  const baseChance = 0.35 * hpFactor * ballMultiplier;

  // Cap between 10% and 95%
  const catchProbability = Math.min(0.95, Math.max(0.1, baseChance));
  const roll = Math.random();

  if (roll < catchProbability) {
    return { success: true, shakes: 3 };
  } else {
    // Determine how close: 1, 2, or 3 shakes
    const diff = roll - catchProbability;
    let shakes = 1;
    if (diff < 0.2) shakes = 2;
    return { success: false, shakes };
  }
}

export function checkEvolution(
  speciesId: string,
  level: number
): { newSpeciesId: string; newSpeciesName: string } | null {
  const species = PET_SPECIES[speciesId];
  if (!species || !species.evolutionLevel || !species.evolvesTo) return null;
  if (level >= species.evolutionLevel) {
    const nextSpecies = PET_SPECIES[species.evolvesTo];
    if (nextSpecies) {
      return { newSpeciesId: nextSpecies.id, newSpeciesName: nextSpecies.name };
    }
  }
  return null;
}
