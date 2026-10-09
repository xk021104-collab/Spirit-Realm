import React, { useState, useEffect } from 'react';
import { PetInstance, Move, Item, InventorySlot, SceneId } from '../types/game';
import { MOVES_DATA } from '../data/moves';
import { PET_SPECIES } from '../data/species';
import { ITEMS_DATA } from '../data/items';
import { calculateDamage, calculateCatchRate, calculateStats, calculateMaxExp } from '../utils/battleEngine';
import { sound } from '../utils/audio';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { Swords, Backpack, CircleDot, ArrowRightLeft, Sparkles, Heart, Zap, ShieldAlert, Award } from 'lucide-react';

interface BattleViewProps {
  playerParty: PetInstance[];
  enemyPet: PetInstance;
  isWild: boolean;
  sceneId: SceneId;
  inventory: InventorySlot[];
  onBattleEnd: (result: {
    won: boolean;
    fled?: boolean;
    capturedPet?: PetInstance;
    updatedParty: PetInstance[];
    updatedInventory: InventorySlot[];
    coinsEarned: number;
    expEarned: number;
  }) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  playerParty: initialParty,
  enemyPet: initialEnemy,
  isWild,
  sceneId,
  inventory: initialInventory,
  onBattleEnd,
}) => {
  // Party state
  const [party, setParty] = useState<PetInstance[]>(initialParty);
  const [activePetIndex, setActivePetIndex] = useState<number>(() => {
    const firstAlive = initialParty.findIndex((p) => p.currentHp > 0);
    return firstAlive !== -1 ? firstAlive : 0;
  });
  const [enemy, setEnemy] = useState<PetInstance>(initialEnemy);
  const [inventory, setInventory] = useState<InventorySlot[]>(initialInventory);

  // Battle menu mode
  const [battleMenu, setBattleMenu] = useState<'ACTIONS' | 'MOVES' | 'BALLS' | 'POTIONS' | 'SWITCH'>('ACTIONS');

  // Animation & Log states
  const [battleLog, setBattleLog] = useState<string[]>(['战斗开始！全神贯注！']);
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [playerAttacking, setPlayerAttacking] = useState<boolean>(false);
  const [enemyAttacking, setEnemyAttacking] = useState<boolean>(false);
  const [playerHit, setPlayerHit] = useState<boolean>(false);
  const [enemyHit, setEnemyHit] = useState<boolean>(false);
  const [damagePopup, setDamagePopup] = useState<{ target: 'player' | 'enemy'; text: string; isCrit?: boolean } | null>(null);

  // Catch sequence state
  const [catchingState, setCatchingState] = useState<{ active: boolean; ballId: string; shakeCount: number; message: string } | null>(null);

  // Victory modal state
  const [victoryData, setVictoryData] = useState<{
    show: boolean;
    expEarned: number;
    coinsEarned: number;
    levelUps: { petName: string; oldLevel: number; newLevel: number }[];
    evolutions: { petName: string; newSpeciesName: string; newSpeciesId: string }[];
    captured?: PetInstance;
  } | null>(null);

  const activePet = party[activePetIndex];
  const activeSpecies = PET_SPECIES[activePet.speciesId];
  const enemySpecies = PET_SPECIES[enemy.speciesId];

  const logMessage = (msg: string) => {
    setBattleLog((prev) => [msg, ...prev.slice(0, 5)]);
  };

  // Helper for background scene styling
  const getSceneBackgroundClass = () => {
    switch (sceneId) {
      case 'VOLCANO':
        return 'from-rose-950 via-stone-900 to-amber-950';
      case 'BAY':
        return 'from-cyan-950 via-slate-900 to-blue-950';
      case 'PRAIRIE':
        return 'from-emerald-950 via-slate-900 to-teal-950';
      case 'ARENA':
        return 'from-purple-950 via-slate-900 to-indigo-950';
      case 'HOSPITAL':
      case 'SHOP':
      case 'ACADEMY':
      default:
        return 'from-indigo-950 via-slate-900 to-blue-950';
    }
  };

  // Turn resolution: Player picks a move
  const handleSelectMove = async (moveId: string) => {
    if (isProcessingTurn || activePet.currentHp <= 0) return;
    const move = MOVES_DATA[moveId];
    if (!move) return;

    // Check PP
    const moveSlot = activePet.moves.find((m) => m.id === moveId);
    if (!moveSlot || moveSlot.pp <= 0) {
      logMessage('此技能 PP 已耗尽，请选择其他招式！');
      return;
    }

    setIsProcessingTurn(true);
    setBattleMenu('ACTIONS');

    // Deduct 1 PP
    const updatedMoves = activePet.moves.map((m) => (m.id === moveId ? { ...m, pp: m.pp - 1 } : m));
    const petWithPpDeducted = { ...activePet, moves: updatedMoves };
    const updatedPartyWithPp = party.map((p, idx) => (idx === activePetIndex ? petWithPpDeducted : p));
    setParty(updatedPartyWithPp);

    // Determine Turn Order based on Speed
    const playerSpeed = activePet.stats.speed;
    const enemySpeed = enemy.stats.speed;
    const playerGoesFirst = playerSpeed >= enemySpeed;

    if (playerGoesFirst) {
      // 1. Player attacks
      const enemyDied = await executePlayerAttack(petWithPpDeducted, move);
      if (enemyDied) {
        handleBattleWin();
        return;
      }
      // 2. Enemy attacks back if alive
      await new Promise((r) => setTimeout(r, 600));
      await executeEnemyAttack(petWithPpDeducted);
    } else {
      // 1. Enemy attacks first
      const playerDied = await executeEnemyAttack(petWithPpDeducted);
      if (!playerDied) {
        // 2. Player attacks back if still alive
        await new Promise((r) => setTimeout(r, 600));
        const enemyDied = await executePlayerAttack(petWithPpDeducted, move);
        if (enemyDied) {
          handleBattleWin();
          return;
        }
      }
    }

    setIsProcessingTurn(false);
  };

  const executePlayerAttack = async (attacker: PetInstance, move: Move): Promise<boolean> => {
    logMessage(`${attacker.nickname} 使用了【${move.name}】！`);
    setPlayerAttacking(true);
    await new Promise((r) => setTimeout(r, 200));
    setPlayerAttacking(false);

    if (move.category === 'STATUS') {
      sound.playClick();
      logMessage(`技能生效了！`);
      return false;
    }

    const { damage, multiplier, isCritical } = calculateDamage(attacker, enemy, move);
    sound.playAttackHit(isCritical);
    if (multiplier > 1.2) {
      sound.playSuperEffective();
    }

    setEnemyHit(true);
    setDamagePopup({
      target: 'enemy',
      text: `-${damage}${multiplier > 1.2 ? ' 拔群!' : multiplier < 0.8 ? ' 不佳' : ''}`,
      isCrit: isCritical,
    });
    await new Promise((r) => setTimeout(r, 300));
    setEnemyHit(false);

    const newEnemyHp = Math.max(0, enemy.currentHp - damage);
    setEnemy((prev) => ({ ...prev, currentHp: newEnemyHp }));

    if (multiplier > 1.2) {
      logMessage('效果拔群！造成了显著伤害！');
    } else if (multiplier < 0.8) {
      logMessage('效果不是太好...');
    }
    if (isCritical) {
      logMessage('击中要害！会心一击！');
    }

    await new Promise((r) => setTimeout(r, 300));
    setDamagePopup(null);

    if (newEnemyHp <= 0) {
      logMessage(`野生 ${enemySpecies.name} 倒下了！`);
      return true;
    }
    return false;
  };

  const executeEnemyAttack = async (currentActivePet: PetInstance): Promise<boolean> => {
    // Pick random available move from enemy
    const enemyAvailableMoves = enemy.moves.length > 0 ? enemy.moves : [{ id: 'scratch', pp: 35, maxPp: 35 }];
    const chosenSlot = enemyAvailableMoves[Math.floor(Math.random() * enemyAvailableMoves.length)];
    const enemyMove = MOVES_DATA[chosenSlot.id] || MOVES_DATA.scratch;

    logMessage(`对方 ${enemySpecies.name} 使用了【${enemyMove.name}】！`);
    setEnemyAttacking(true);
    await new Promise((r) => setTimeout(r, 200));
    setEnemyAttacking(false);

    const { damage, multiplier, isCritical } = calculateDamage(enemy, currentActivePet, enemyMove);
    sound.playAttackHit(isCritical);
    if (multiplier > 1.2) sound.playSuperEffective();

    setPlayerHit(true);
    setDamagePopup({
      target: 'player',
      text: `-${damage}`,
      isCrit: isCritical,
    });
    await new Promise((r) => setTimeout(r, 300));
    setPlayerHit(false);

    const newPlayerHp = Math.max(0, currentActivePet.currentHp - damage);
    const updatedPartyHp = party.map((p, idx) => (idx === activePetIndex ? { ...p, currentHp: newPlayerHp } : p));
    setParty(updatedPartyHp);

    await new Promise((r) => setTimeout(r, 300));
    setDamagePopup(null);

    if (newPlayerHp <= 0) {
      logMessage(`${currentActivePet.nickname} 倒下了！`);
      // Check if all party pets are dead
      const hasAlivePet = updatedPartyHp.some((p) => p.currentHp > 0);
      if (!hasAlivePet) {
        logMessage('所有随行幻灵均已失去战斗力！战斗失败...');
        await new Promise((r) => setTimeout(r, 1200));
        onBattleEnd({
          won: false,
          updatedParty: updatedPartyHp,
          updatedInventory: inventory,
          coinsEarned: 0,
          expEarned: 0,
        });
      } else {
        // Prompt pet switch
        setBattleMenu('SWITCH');
      }
      return true;
    }
    return false;
  };

  // Throw Spirit Crystal capture attempt
  const handleThrowBall = async (ballId: string) => {
    if (!isWild || isProcessingTurn) return;
    const item = ITEMS_DATA[ballId];
    if (!item) return;

    // Deduct ball from inventory
    const slot = inventory.find((i) => i.itemId === ballId);
    if (!slot || slot.count <= 0) {
      logMessage('灵契晶石数量不足！');
      return;
    }

    const updatedInv = inventory
      .map((i) => (i.itemId === ballId ? { ...i, count: i.count - 1 } : i))
      .filter((i) => i.count > 0);
    setInventory(updatedInv);

    setIsProcessingTurn(true);
    setBattleMenu('ACTIONS');

    sound.playBallThrow();
    logMessage(`祭出了【${item.name}】！`);

    setCatchingState({
      active: true,
      ballId,
      shakeCount: 0,
      message: '灵契晶石化作流光飞向目标...',
    });

    const { success, shakes } = calculateCatchRate(enemy, item.catchMultiplier || 1, item.isGuaranteed);

    // Simulate 1, 2, 3 shakes
    for (let s = 1; s <= shakes; s++) {
      await new Promise((r) => setTimeout(r, 700));
      sound.playBallShake();
      setCatchingState((prev) => (prev ? { ...prev, shakeCount: s, message: `灵晶神光剧烈共鸣... (${s}/3)` } : null));
    }

    await new Promise((r) => setTimeout(r, 600));

    if (success) {
      sound.playCatchSuccess();
      setCatchingState((prev) => (prev ? { ...prev, message: `★ 契约成功！成功收服了【${enemySpecies.name}】！` } : null));
      logMessage(`太棒了！成功收服了野生 ${enemySpecies.name}！`);

      await new Promise((r) => setTimeout(r, 1200));
      setCatchingState(null);

      // Finish battle with captured pet
      const capturedInstance: PetInstance = {
        ...enemy,
        uid: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };

      setVictoryData({
        show: true,
        expEarned: 100,
        coinsEarned: 200,
        levelUps: [],
        evolutions: [],
        captured: capturedInstance,
      });
    } else {
      sound.playClick();
      setCatchingState((prev) => (prev ? { ...prev, message: `哎呀！野生 ${enemySpecies.name} 挣脱了灵契晶石！` } : null));
      logMessage(`契约失败！野生 ${enemySpecies.name} 震碎了灵光！`);

      await new Promise((r) => setTimeout(r, 900));
      setCatchingState(null);

      // Enemy counter attacks
      await executeEnemyAttack(activePet);
      setIsProcessingTurn(false);
    }
  };

  // Use Medicine in battle
  const handleUsePotion = (potionId: string) => {
    if (isProcessingTurn) return;
    const potion = ITEMS_DATA[potionId];
    if (!potion) return;

    if (potion.isRevive && activePet.currentHp > 0) {
      logMessage('该宠物尚未濒死，无需使用复活药剂！');
      return;
    }
    if (!potion.isRevive && activePet.currentHp <= 0) {
      logMessage('濒死宠物只能使用复活药剂！');
      return;
    }

    const updatedInv = inventory
      .map((i) => (i.itemId === potionId ? { ...i, count: i.count - 1 } : i))
      .filter((i) => i.count > 0);
    setInventory(updatedInv);

    let updatedPet = { ...activePet };

    if (potion.healHp) {
      const restored = Math.min(activePet.stats.hp, activePet.currentHp + potion.healHp);
      updatedPet.currentHp = restored;
      sound.playHeal();
      logMessage(`${activePet.nickname} 恢复了生命值！`);
    } else if (potion.healPp) {
      updatedPet.moves = activePet.moves.map((m) => ({
        ...m,
        pp: Math.min(m.maxPp, m.pp + (potion.healPp || 10)),
      }));
      sound.playHeal();
      logMessage(`${activePet.nickname} 的技能 PP 恢复了！`);
    }

    const updatedParty = party.map((p, idx) => (idx === activePetIndex ? updatedPet : p));
    setParty(updatedParty);
    setBattleMenu('ACTIONS');

    // Enemy attacks turn
    setIsProcessingTurn(true);
    setTimeout(async () => {
      await executeEnemyAttack(updatedPet);
      setIsProcessingTurn(false);
    }, 600);
  };

  // Switch pet
  const handleSwitchPet = (index: number) => {
    if (index === activePetIndex || party[index].currentHp <= 0 || isProcessingTurn) return;
    sound.playClick();
    logMessage(`回来吧，${activePet.nickname}！上吧，${party[index].nickname}！`);
    setActivePetIndex(index);
    setBattleMenu('ACTIONS');

    // If switched voluntarily during active fight, enemy gets a turn
    if (activePet.currentHp > 0) {
      setIsProcessingTurn(true);
      setTimeout(async () => {
        await executeEnemyAttack(party[index]);
        setIsProcessingTurn(false);
      }, 700);
    }
  };

  // Flee battle
  const handleFlee = () => {
    if (!isWild) {
      logMessage('正规训练师与擂台对决中无法逃跑！');
      return;
    }
    sound.playClick();
    logMessage('成功安全逃跑！');
    setTimeout(() => {
      onBattleEnd({
        won: false,
        fled: true,
        updatedParty: party,
        updatedInventory: inventory,
        coinsEarned: 0,
        expEarned: 0,
      });
    }, 500);
  };

  // Battle win resolution: Exp calculation, level-up & evolution checks
  const handleBattleWin = async () => {
    sound.playVictory();
    const expGain = Math.floor(enemy.level * 45 + Math.random() * 20);
    const coinsGain = Math.floor(enemy.level * 35 + 50);

    const levelUps: { petName: string; oldLevel: number; newLevel: number }[] = [];
    const evolutions: { petName: string; newSpeciesName: string; newSpeciesId: string }[] = [];

    // Award EXP to active pet (or all alive party)
    const updatedParty = party.map((pet, idx) => {
      if (idx !== activePetIndex || pet.currentHp <= 0) return pet;

      let newExp = pet.exp + expGain;
      let newLevel = pet.level;
      let currentMaxExp = pet.maxExp;
      let currentSpeciesId = pet.speciesId;
      let didLevelUp = false;

      while (newExp >= currentMaxExp && newLevel < 100) {
        newExp -= currentMaxExp;
        newLevel += 1;
        currentMaxExp = calculateMaxExp(newLevel);
        didLevelUp = true;
      }

      if (didLevelUp) {
        levelUps.push({ petName: pet.nickname, oldLevel: pet.level, newLevel });
        sound.playLevelUp();
      }

      // Check evolution
      const species = PET_SPECIES[currentSpeciesId];
      if (species.evolutionLevel && newLevel >= species.evolutionLevel && species.evolvesTo) {
        const nextSpecies = PET_SPECIES[species.evolvesTo];
        if (nextSpecies) {
          evolutions.push({
            petName: pet.nickname,
            newSpeciesName: nextSpecies.name,
            newSpeciesId: nextSpecies.id,
          });
          currentSpeciesId = nextSpecies.id;
          sound.playEvolution();
        }
      }

      const newStats = calculateStats(PET_SPECIES[currentSpeciesId], newLevel);

      return {
        ...pet,
        level: newLevel,
        exp: newExp,
        maxExp: currentMaxExp,
        speciesId: currentSpeciesId,
        nickname: pet.nickname === species.name ? PET_SPECIES[currentSpeciesId].name : pet.nickname,
        stats: newStats,
        currentHp: Math.min(newStats.hp, pet.currentHp + (newStats.hp - pet.stats.hp)),
      };
    });

    setParty(updatedParty);

    setVictoryData({
      show: true,
      expEarned: expGain,
      coinsEarned: coinsGain,
      levelUps,
      evolutions,
    });
  };

  const handleFinishVictoryModal = () => {
    if (!victoryData) return;
    onBattleEnd({
      won: true,
      capturedPet: victoryData.captured,
      updatedParty: party,
      updatedInventory: inventory,
      coinsEarned: victoryData.coinsEarned,
      expEarned: victoryData.expEarned,
    });
  };

  return (
    <div className={`relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-gradient-to-b ${getSceneBackgroundClass()} text-slate-100 flex flex-col min-h-[580px]`}>
      {/* Top Banner / Location & Status */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/40 border-b border-white/10 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-300 text-sm tracking-wide">
            {isWild ? '野生遭遇' : '竞技决斗'} · {enemySpecies.name}
          </span>
          <span className="text-xs text-slate-400">回合制对决</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span>我方出战: {activePet.nickname}</span>
          <span className="text-slate-500">|</span>
          <span>等级: Lv.{activePet.level}</span>
        </div>
      </div>

      {/* Battle Field Arena */}
      <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between overflow-hidden">
        {/* Subtle magical circle ground lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full border-4 border-amber-400 border-dashed animate-[spin_60s_linear_infinite]" />
        </div>

        {/* Damage Popup Overlay */}
        {damagePopup && (
          <div
            className={`absolute z-30 font-extrabold text-2xl tracking-wider animate-bounce ${
              damagePopup.target === 'enemy' ? 'top-20 right-32' : 'bottom-32 left-32'
            } ${damagePopup.isCrit ? 'text-amber-300 text-3xl' : 'text-rose-400'}`}
          >
            {damagePopup.text}
          </div>
        )}

        {/* 1. Enemy Pet Zone (Top-Right) */}
        <div className="flex items-center justify-end gap-6 relative z-10">
          {/* Enemy Info Card */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md min-w-[240px]">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-bold text-white text-base">{enemySpecies.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-400/20">
                Lv.{enemy.level}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  ELEMENT_COLORS[enemySpecies.type].bg
                } ${ELEMENT_COLORS[enemySpecies.type].text} ${ELEMENT_COLORS[enemySpecies.type].border} border`}
              >
                {ELEMENT_COLORS[enemySpecies.type].label}系
              </span>
              <span className="text-xs text-slate-400 truncate">{enemySpecies.title}</span>
            </div>
            {/* Enemy HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>生命值</span>
                <span>
                  {enemy.currentHp} / {enemy.stats.hp}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    enemy.currentHp / enemy.stats.hp > 0.5
                      ? 'bg-emerald-500'
                      : enemy.currentHp / enemy.stats.hp > 0.2
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, (enemy.currentHp / enemy.stats.hp) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Enemy Pet Avatar with Stage Shadow */}
          <div className="relative flex flex-col items-center">
            {/* Catching Animation Ball */}
            {catchingState?.active ? (
              <div className="w-24 h-24 flex flex-col items-center justify-center animate-pulse">
                <div
                  className={`w-14 h-14 rounded-full border-2 border-slate-900 shadow-2xl flex items-center justify-center transition-transform ${
                    catchingState.shakeCount % 2 === 1 ? 'rotate-12' : '-rotate-12'
                  } ${
                    catchingState.ballId === 'gulu_king'
                      ? 'bg-gradient-to-b from-amber-400 via-purple-600 to-amber-400'
                      : catchingState.ballId === 'gulu_high'
                      ? 'bg-gradient-to-b from-purple-500 to-slate-800'
                      : catchingState.ballId === 'gulu_mid'
                      ? 'bg-gradient-to-b from-blue-500 to-slate-800'
                      : 'bg-gradient-to-b from-rose-500 to-slate-200'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-900" />
                </div>
                <span className="text-xs text-amber-300 font-bold mt-2 whitespace-nowrap bg-black/60 px-2 py-0.5 rounded">
                  {catchingState.message}
                </span>
              </div>
            ) : (
              <>
                <PetAvatar
                  speciesId={enemy.speciesId}
                  size={120}
                  isAttacking={enemyAttacking}
                  isHit={enemyHit}
                  className="transition-transform duration-300"
                />
                <div className="w-24 h-4 bg-black/40 rounded-full blur-xs mt-1" />
              </>
            )}
          </div>
        </div>

        {/* 2. Player Pet Zone (Bottom-Left) */}
        <div className="flex items-center justify-start gap-6 relative z-10 mt-6">
          {/* Player Pet Avatar with Stage Shadow */}
          <div className="relative flex flex-col items-center">
            <PetAvatar
              speciesId={activePet.speciesId}
              size={135}
              isFlipped={true}
              isAttacking={playerAttacking}
              isHit={playerHit}
              className="transition-transform duration-300"
            />
            <div className="w-28 h-5 bg-black/40 rounded-full blur-xs mt-1" />
          </div>

          {/* Player Info Card */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md min-w-[260px]">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-bold text-white text-base">{activePet.nickname}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-400/20">
                Lv.{activePet.level}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  ELEMENT_COLORS[activeSpecies.type].bg
                } ${ELEMENT_COLORS[activeSpecies.type].text} ${ELEMENT_COLORS[activeSpecies.type].border} border`}
              >
                {ELEMENT_COLORS[activeSpecies.type].label}系
              </span>
              <span className="text-xs text-slate-400">{activePet.nature}</span>
            </div>
            {/* Player HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>生命值</span>
                <span className="font-semibold">
                  {activePet.currentHp} / {activePet.stats.hp}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activePet.currentHp / activePet.stats.hp > 0.5
                      ? 'bg-emerald-500'
                      : activePet.currentHp / activePet.stats.hp > 0.2
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, (activePet.currentHp / activePet.stats.hp) * 100)}%` }}
                />
              </div>
            </div>
            {/* EXP Bar */}
            <div className="mt-2 space-y-0.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>经验值 (EXP)</span>
                <span>
                  {activePet.exp} / {activePet.maxExp}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (activePet.exp / activePet.maxExp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Command Center */}
      <div className="bg-slate-950/95 border-t border-slate-800 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 z-20">
        {/* Left: Battle Log / Announcer Box */}
        <div className="md:col-span-5 bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between h-[128px]">
          <div className="text-xs font-semibold text-amber-400/90 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>战斗日志播报</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-xs pr-1">
            {battleLog.map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-white font-medium' : 'text-slate-400'}>
                {idx === 0 ? '▶ ' : '  '}
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Right: Interactive Command Panels */}
        <div className="md:col-span-7 flex flex-col justify-center">
          {battleMenu === 'ACTIONS' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                disabled={isProcessingTurn || activePet.currentHp <= 0}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('MOVES');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-rose-400/30"
              >
                <Swords className="w-5 h-5 mb-1" />
                <span className="text-sm font-bold">战斗技能</span>
              </button>

              <button
                disabled={isProcessingTurn || !isWild}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('BALLS');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-amber-400/30"
              >
                <CircleDot className="w-5 h-5 mb-1" />
                <span className="text-sm font-bold">灵晶契约</span>
              </button>

              <button
                disabled={isProcessingTurn}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('POTIONS');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-emerald-400/30"
              >
                <Backpack className="w-5 h-5 mb-1" />
                <span className="text-sm font-bold">药品道具</span>
              </button>

              <button
                disabled={isProcessingTurn}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('SWITCH');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-cyan-400/30"
              >
                <ArrowRightLeft className="w-5 h-5 mb-1" />
                <span className="text-sm font-bold">更换幻灵</span>
              </button>

              {isWild && (
                <div className="col-span-2 sm:col-span-4 flex justify-end pt-1">
                  <button
                    disabled={isProcessingTurn}
                    onClick={handleFlee}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer transition-colors"
                  >
                    逃跑 (脱离战斗)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Moves Selection */}
          {battleMenu === 'MOVES' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-300">选择要释放的灵术技能:</span>
                <button
                  onClick={() => setBattleMenu('ACTIONS')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  返回主菜单
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activePet.moves.map((m) => {
                  const moveData = MOVES_DATA[m.id];
                  if (!moveData) return null;
                  const elColor = ELEMENT_COLORS[moveData.type];
                  return (
                    <button
                      key={m.id}
                      disabled={isProcessingTurn || m.pp <= 0}
                      onClick={() => handleSelectMove(m.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer disabled:opacity-40 bg-slate-900 hover:bg-slate-800 ${elColor.border}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{moveData.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${elColor.bg} ${elColor.text}`}>
                          {elColor.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>威力 {moveData.power || '-'}</span>
                        <span className={m.pp <= 3 ? 'text-rose-400 font-bold' : ''}>
                          PP: {m.pp}/{m.maxPp}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spirit Crystal Capture Selection */}
          {battleMenu === 'BALLS' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-amber-300">选择灵契晶石收服野生幻灵:</span>
                <button
                  onClick={() => setBattleMenu('ACTIONS')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  返回主菜单
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {inventory
                  .filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL')
                  .map((slot) => {
                    const item = ITEMS_DATA[slot.itemId];
                    return (
                      <button
                        key={slot.itemId}
                        disabled={isProcessingTurn || slot.count <= 0}
                        onClick={() => handleThrowBall(slot.itemId)}
                        className="text-left p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-sm text-amber-200">{item.name}</div>
                          <div className="text-[11px] text-slate-400">{item.description}</div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 text-amber-300">
                          x{slot.count}
                        </span>
                      </button>
                    );
                  })}
              </div>
              {inventory.filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL').length === 0 && (
                <div className="text-xs text-slate-400 text-center py-4">背包里没有灵契晶石了，请前往万象宝阁购买！</div>
              )}
            </div>
          )}

          {/* Potions Selection */}
          {battleMenu === 'POTIONS' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-emerald-300">选择恢复药品:</span>
                <button
                  onClick={() => setBattleMenu('ACTIONS')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  返回主菜单
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {inventory
                  .filter((i) => ['POTION', 'PP', 'REVIVE'].includes(ITEMS_DATA[i.itemId]?.category))
                  .map((slot) => {
                    const item = ITEMS_DATA[slot.itemId];
                    return (
                      <button
                        key={slot.itemId}
                        disabled={isProcessingTurn || slot.count <= 0}
                        onClick={() => handleUsePotion(slot.itemId)}
                        className="text-left p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-sm text-emerald-200">{item.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{item.description}</div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 text-emerald-300">
                          x{slot.count}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Pet Switch Selection */}
          {battleMenu === 'SWITCH' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-cyan-300">选择要换上场的随行幻灵:</span>
                {activePet.currentHp > 0 && (
                  <button
                    onClick={() => setBattleMenu('ACTIONS')}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    取消更换
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {party.map((p, idx) => {
                  const spec = PET_SPECIES[p.speciesId];
                  const isDead = p.currentHp <= 0;
                  const isCurrent = idx === activePetIndex;
                  return (
                    <button
                      key={p.uid}
                      disabled={isDead || isCurrent}
                      onClick={() => handleSwitchPet(idx)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                          : isDead
                          ? 'bg-slate-900/40 border-slate-800 opacity-40 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-700 hover:border-cyan-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PetAvatar speciesId={p.speciesId} size={36} />
                        <div className="truncate">
                          <div className="font-bold text-xs text-white truncate">{p.nickname}</div>
                          <div className="text-[10px] text-slate-400">Lv.{p.level}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        HP: {p.currentHp}/{p.stats.hp}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Victory / Rewards Modal */}
      {victoryData?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Award className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-amber-300">战斗大获全胜！</h2>
              <p className="text-slate-300 text-sm mt-1">
                恭喜灵契师！你与幻灵伙伴的心念合一提升了！
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-black/40 rounded-xl p-4 border border-slate-800">
              <div className="text-left">
                <span className="text-xs text-slate-400">获得经验值</span>
                <p className="text-xl font-bold text-cyan-300 font-mono">+{victoryData.expEarned} EXP</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">获得灵石</span>
                <p className="text-xl font-bold text-amber-300 font-mono">+{victoryData.coinsEarned} 灵石</p>
              </div>
            </div>

            {/* Level Ups announcements */}
            {victoryData.levelUps.map((lvl, i) => (
              <div key={i} className="bg-emerald-950/60 border border-emerald-500/30 p-3 rounded-xl text-emerald-200 text-sm font-semibold">
                🎉 【{lvl.petName}】 等级提升至 Lv.{lvl.newLevel}！全属性大幅增强！
              </div>
            ))}

            {/* Evolution announcements */}
            {victoryData.evolutions.map((evo, i) => (
              <div key={i} className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 p-4 rounded-xl text-purple-200 text-sm">
                <p className="text-amber-300 font-bold text-base mb-1">✨ 华丽进化！</p>
                【{evo.petName}】 领悟了更强大的自然魔法，成功进化为 【{evo.newSpeciesName}】！
                <div className="flex justify-center mt-3">
                  <PetAvatar speciesId={evo.newSpeciesId} size={72} />
                </div>
              </div>
            ))}

            {/* Captured pet info */}
            {victoryData.captured && (
              <div className="bg-amber-950/50 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-sm flex items-center justify-center gap-3">
                <PetAvatar speciesId={victoryData.captured.speciesId} size={48} />
                <span>成功收服了新伙伴 【{PET_SPECIES[victoryData.captured.speciesId].name}】！已加入宠物背包！</span>
              </div>
            )}

            <button
              onClick={handleFinishVictoryModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              继续探险
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
