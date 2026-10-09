import { ElementType, Move, PetInstance, PetSpecies } from '../types/game';
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
  };
}

export function calculateDamage(
  attacker: PetInstance,
  defender: PetInstance,
  move: Move
): { damage: number; multiplier: number; isCritical: boolean } {
  if (move.category === 'STATUS') {
    return { damage: 0, multiplier: 1, isCritical: false };
  }

  const attackerSpecies = PET_SPECIES[attacker.speciesId];
  const defenderSpecies = PET_SPECIES[defender.speciesId];

  const isSpecial = move.category === 'SPECIAL';
  const attackStat = isSpecial ? attacker.stats.spAtk : attacker.stats.atk;
  const defenseStat = isSpecial ? defender.stats.spDef : defender.stats.def;

  const multiplier = getTypeMultiplier(move.type, defenderSpecies.type);

  // Critical hit 10% chance
  const isCritical = Math.random() < 0.1;
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
    Math.floor(baseDamage * multiplier * critMultiplier * randomFactor * stab)
  );

  return {
    damage: totalDamage,
    multiplier,
    isCritical,
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
