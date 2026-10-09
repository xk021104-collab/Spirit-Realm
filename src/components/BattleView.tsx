import React, { useState, useEffect } from 'react';
import { PetInstance, Move, Item, InventorySlot, SceneId, BattleWeather, WeatherState } from '../types/game';
import { MOVES_DATA } from '../data/moves';
import { PET_SPECIES } from '../data/species';
import { ITEMS_DATA } from '../data/items';
import { WEATHER_CONFIGS, getInitialWeatherForScene, calculateWeatherTurnEnd } from '../data/weather';
import { calculateDamage, calculateCatchRate, calculateStats, calculateMaxExp } from '../utils/battleEngine';
import { sound } from '../utils/audio';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { WeatherOverlay } from './WeatherOverlay';
import {
  Swords,
  Backpack,
  CircleDot,
  ArrowRightLeft,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Award,
  ChevronRight,
  Flame,
  Droplets,
  Trees,
  Sun,
  CloudRain,
  Wind,
  SunDim,
  Info,
} from 'lucide-react';

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
  const [party, setParty] = useState<PetInstance[]>(initialParty);
  const [activePetIndex, setActivePetIndex] = useState<number>(() => {
    const firstAlive = initialParty.findIndex((p) => p.currentHp > 0);
    return firstAlive !== -1 ? firstAlive : 0;
  });
  const [enemy, setEnemy] = useState<PetInstance>(initialEnemy);
  const [inventory, setInventory] = useState<InventorySlot[]>(initialInventory);

  const [battleMenu, setBattleMenu] = useState<'ACTIONS' | 'MOVES' | 'BALLS' | 'POTIONS' | 'SWITCH'>('ACTIONS');

  const [battleLog, setBattleLog] = useState<string[]>(['★ 战斗开始！双方幻灵已就位！']);
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [playerAttacking, setPlayerAttacking] = useState<boolean>(false);
  const [enemyAttacking, setEnemyAttacking] = useState<boolean>(false);
  const [playerHit, setPlayerHit] = useState<boolean>(false);
  const [enemyHit, setEnemyHit] = useState<boolean>(false);
  const [screenShaking, setScreenShaking] = useState<boolean>(false);

  // Floating damage text
  const [damagePopup, setDamagePopup] = useState<{
    target: 'player' | 'enemy';
    text: string;
    isCrit?: boolean;
    isEffective?: boolean;
  } | null>(null);

  // Capture sequence
  const [catchingState, setCatchingState] = useState<{
    active: boolean;
    ballId: string;
    shakeCount: number;
    message: string;
  } | null>(null);

  // Victory Rewards Modal
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

  // Weather System State
  const [weatherState, setWeatherState] = useState<WeatherState>(() => {
    return getInitialWeatherForScene(sceneId || 'ACADEMY');
  });
  const [showWeatherTooltip, setShowWeatherTooltip] = useState<boolean>(false);

  const logMessage = (msg: string) => {
    setBattleLog((prev) => [msg, ...prev.slice(0, 5)]);
  };

  // Announce initial weather on mount
  useEffect(() => {
    if (weatherState.weather !== 'CLEAR') {
      const cfg = WEATHER_CONFIGS[weatherState.weather];
      logMessage(`【天象显化】战场笼罩在【${cfg.name}】之中！（${cfg.subName}）`);
    }
  }, []);

  // Weather switch manual handler
  const handleSetWeather = (newWeather: BattleWeather) => {
    sound.playClick();
    const cfg = WEATHER_CONFIGS[newWeather];
    setWeatherState({
      weather: newWeather,
      turnsLeft: newWeather === 'CLEAR' ? 0 : 5,
    });
    setShowWeatherTooltip(false);
    logMessage(`【天象变幻】契灵使引动天象异变，战场转为【${cfg.name}】！`);
  };

  // Scene Arena Backgrounds
  const getArenaGradients = () => {
    switch (sceneId) {
      case 'VOLCANO':
        return 'from-rose-950 via-stone-900 to-amber-950';
      case 'BAY':
        return 'from-cyan-950 via-slate-900 to-blue-950';
      case 'PRAIRIE':
        return 'from-emerald-950 via-slate-900 to-teal-950';
      case 'ARENA':
        return 'from-purple-950 via-slate-900 to-indigo-950';
      default:
        return 'from-indigo-950 via-slate-900 to-blue-950';
    }
  };

  // Turn-end weather effects (Heal Grass in Sunny, Sandstorm chip damage, Rain chip on Fire, Decay turns)
  const handleTurnEndWeather = async (
    currentParty: PetInstance[],
    currentEnemy: PetInstance
  ): Promise<{ ended: boolean }> => {
    let activeW = weatherState.weather;

    // 1. Decrement Weather Duration
    if (activeW !== 'CLEAR') {
      const nextTurns = weatherState.turnsLeft - 1;
      if (nextTurns <= 0) {
        setWeatherState({ weather: 'CLEAR', turnsLeft: 0 });
        logMessage('【天象更迭】异象平息，战场恢复风和日丽。');
        activeW = 'CLEAR';
      } else {
        setWeatherState((prev) => ({ ...prev, turnsLeft: nextTurns }));
      }
    }

    if (activeW === 'CLEAR') return { ended: false };

    // 2. Player Active Pet Weather Passive
    let currentP = currentParty[activePetIndex];
    if (currentP && currentP.currentHp > 0) {
      const pRes = calculateWeatherTurnEnd(currentP, activeW);
      if (pRes.hpChange !== 0) {
        await new Promise((r) => setTimeout(r, 260));
        const newHp = Math.min(currentP.stats.hp, Math.max(0, currentP.currentHp + pRes.hpChange));
        currentP = { ...currentP, currentHp: newHp };
        const updatedParty = currentParty.map((p, idx) => (idx === activePetIndex ? currentP : p));
        setParty(updatedParty);
        if (pRes.message) logMessage(pRes.message);
        if (pRes.hpChange > 0) sound.playHeal();
        else sound.playAttackHit(false);

        if (newHp <= 0) {
          logMessage(`${currentP.nickname} 耗尽气血倒下了！`);
          const hasAlive = updatedParty.some((p) => p.currentHp > 0);
          if (!hasAlive) {
            logMessage('所有随行幻灵均已脱力！本次战斗失败。');
            setTimeout(() => {
              onBattleEnd({
                won: false,
                updatedParty,
                updatedInventory: inventory,
                coinsEarned: 0,
                expEarned: 0,
              });
            }, 1000);
            return { ended: true };
          } else {
            setBattleMenu('SWITCH');
            return { ended: true };
          }
        }
      }
    }

    // 3. Enemy Pet Weather Passive
    if (currentEnemy && currentEnemy.currentHp > 0) {
      const eRes = calculateWeatherTurnEnd(currentEnemy, activeW);
      if (eRes.hpChange !== 0) {
        await new Promise((r) => setTimeout(r, 260));
        const newHp = Math.min(currentEnemy.stats.hp, Math.max(0, currentEnemy.currentHp + eRes.hpChange));
        const updatedE = { ...currentEnemy, currentHp: newHp };
        setEnemy(updatedE);
        if (eRes.message) logMessage(eRes.message);
        if (eRes.hpChange > 0) sound.playHeal();
        else sound.playAttackHit(false);

        if (newHp <= 0) {
          logMessage(`对方 ${enemySpecies.name} 耗尽气血倒下了！`);
          handleBattleWin();
          return { ended: true };
        }
      }
    }

    return { ended: false };
  };

  // Trigger attack
  const handleSelectMove = async (moveId: string) => {
    if (isProcessingTurn || activePet.currentHp <= 0) return;
    const move = MOVES_DATA[moveId];
    if (!move) return;

    const moveSlot = activePet.moves.find((m) => m.id === moveId);
    if (!moveSlot || moveSlot.pp <= 0) {
      logMessage('此招式灵力 (PP) 已耗尽，请使用其他灵术！');
      return;
    }

    setIsProcessingTurn(true);
    setBattleMenu('ACTIONS');

    // Deduct 1 PP
    const updatedMoves = activePet.moves.map((m) => (m.id === moveId ? { ...m, pp: m.pp - 1 } : m));
    const petWithPpDeducted = { ...activePet, moves: updatedMoves };
    const updatedPartyWithPp = party.map((p, idx) => (idx === activePetIndex ? petWithPpDeducted : p));
    setParty(updatedPartyWithPp);

    // Speed comparison
    const playerSpeed = activePet.stats.speed;
    const enemySpeed = enemy.stats.speed;
    const playerGoesFirst = playerSpeed >= enemySpeed;

    if (playerGoesFirst) {
      const enemyDied = await executePlayerAttack(petWithPpDeducted, move);
      if (enemyDied) {
        handleBattleWin();
        return;
      }
      await new Promise((r) => setTimeout(r, 650));
      const playerDied = await executeEnemyAttack(petWithPpDeducted);
      if (playerDied) {
        setIsProcessingTurn(false);
        return;
      }
    } else {
      const playerDied = await executeEnemyAttack(petWithPpDeducted);
      if (playerDied) {
        setIsProcessingTurn(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 650));
      const enemyDied = await executePlayerAttack(petWithPpDeducted, move);
      if (enemyDied) {
        handleBattleWin();
        return;
      }
    }

    // === Round End: Weather Passive Calculations ===
    await handleTurnEndWeather(updatedPartyWithPp, enemy);

    setIsProcessingTurn(false);
  };

  const executePlayerAttack = async (attacker: PetInstance, move: Move): Promise<boolean> => {
    logMessage(`【我方】${attacker.nickname} 运转灵力施展【${move.name}】！`);
    setPlayerAttacking(true);
    await new Promise((r) => setTimeout(r, 220));
    setPlayerAttacking(false);

    if (move.category === 'STATUS') {
      sound.playClick();
      logMessage(`状态灵术生效了！`);
      return false;
    }

    const { damage, multiplier, isCritical, weatherMsg } = calculateDamage(
      attacker,
      enemy,
      move,
      weatherState.weather
    );
    sound.playAttackHit(isCritical);
    if (multiplier > 1.2) sound.playSuperEffective();

    setEnemyHit(true);
    setScreenShaking(true);
    setDamagePopup({
      target: 'enemy',
      text: `-${damage}`,
      isCrit: isCritical,
      isEffective: multiplier > 1.2,
    });

    await new Promise((r) => setTimeout(r, 320));
    setEnemyHit(false);
    setScreenShaking(false);

    const newEnemyHp = Math.max(0, enemy.currentHp - damage);
    setEnemy((prev) => ({ ...prev, currentHp: newEnemyHp }));

    if (multiplier > 1.2) logMessage('⚡ 属性克制！造成双倍致命重创！');
    else if (multiplier < 0.8) logMessage('属性被克制，伤害受到削弱...');
    if (isCritical) logMessage('💥 会心一击！暴击命中要害！');
    if (weatherMsg) logMessage(weatherMsg);

    await new Promise((r) => setTimeout(r, 300));
    setDamagePopup(null);

    if (newEnemyHp <= 0) {
      logMessage(`对方 ${enemySpecies.name} 耗尽气血倒下了！`);
      return true;
    }
    return false;
  };

  const executeEnemyAttack = async (currentActivePet: PetInstance): Promise<boolean> => {
    const enemyAvailableMoves = enemy.moves.length > 0 ? enemy.moves : [{ id: 'shadow_claw', pp: 35, maxPp: 35 }];
    const chosenSlot = enemyAvailableMoves[Math.floor(Math.random() * enemyAvailableMoves.length)];
    const enemyMove = MOVES_DATA[chosenSlot.id] || MOVES_DATA.shadow_claw;

    logMessage(`【敌方】${enemySpecies.name} 咆哮发动了【${enemyMove.name}】！`);
    setEnemyAttacking(true);
    await new Promise((r) => setTimeout(r, 220));
    setEnemyAttacking(false);

    const { damage, multiplier, isCritical, weatherMsg } = calculateDamage(
      enemy,
      currentActivePet,
      enemyMove,
      weatherState.weather
    );
    sound.playAttackHit(isCritical);
    if (multiplier > 1.2) sound.playSuperEffective();

    setPlayerHit(true);
    setScreenShaking(true);
    setDamagePopup({
      target: 'player',
      text: `-${damage}`,
      isCrit: isCritical,
      isEffective: multiplier > 1.2,
    });

    await new Promise((r) => setTimeout(r, 320));
    setPlayerHit(false);
    setScreenShaking(false);

    const newPlayerHp = Math.max(0, currentActivePet.currentHp - damage);
    const updatedPartyHp = party.map((p, idx) => (idx === activePetIndex ? { ...p, currentHp: newPlayerHp } : p));
    setParty(updatedPartyHp);

    if (multiplier > 1.2) logMessage('对方招式属性克制我方！造成剧烈创伤！');
    if (isCritical) logMessage('对方打出了会心一击！');
    if (weatherMsg) logMessage(weatherMsg);

    await new Promise((r) => setTimeout(r, 300));
    setDamagePopup(null);

    if (newPlayerHp <= 0) {
      logMessage(`${currentActivePet.nickname} 耗尽气血倒下了！`);
      const hasAlivePet = updatedPartyHp.some((p) => p.currentHp > 0);
      if (!hasAlivePet) {
        logMessage('所有随行幻灵均已脱力！本次试炼失败...');
        await new Promise((r) => setTimeout(r, 1200));
        onBattleEnd({
          won: false,
          updatedParty: updatedPartyHp,
          updatedInventory: inventory,
          coinsEarned: 0,
          expEarned: 0,
        });
      } else {
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
    logMessage(`祭出【${item.name}】，划破长空飞向目标！`);

    setCatchingState({
      active: true,
      ballId,
      shakeCount: 0,
      message: '灵契晶石化作宝光笼罩目标...',
    });

    const { success, shakes } = calculateCatchRate(enemy, item.catchMultiplier || 1, item.isGuaranteed);

    for (let s = 1; s <= shakes; s++) {
      await new Promise((r) => setTimeout(r, 700));
      sound.playBallShake();
      setCatchingState((prev) => (prev ? { ...prev, shakeCount: s, message: `晶石共鸣晃动... (${s}/3)` } : null));
    }

    await new Promise((r) => setTimeout(r, 600));

    if (success) {
      sound.playCatchSuccess();
      setCatchingState((prev) => (prev ? { ...prev, message: `★ 契约达成！成功收服【${enemySpecies.name}】！` } : null));
      logMessage(`太棒了！成功与野生 ${enemySpecies.name} 缔结契约！`);

      await new Promise((r) => setTimeout(r, 1200));
      setCatchingState(null);

      const capturedInstance: PetInstance = {
        ...enemy,
        uid: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };

      setVictoryData({
        show: true,
        expEarned: 120,
        coinsEarned: 250,
        levelUps: [],
        evolutions: [],
        captured: capturedInstance,
      });
    } else {
      sound.playClick();
      setCatchingState((prev) => (prev ? { ...prev, message: `哎呀！野生 ${enemySpecies.name} 震碎了灵契宝光！` } : null));
      logMessage(`契约失败！野生 ${enemySpecies.name} 挣脱了束缚！`);

      await new Promise((r) => setTimeout(r, 900));
      setCatchingState(null);

      await executeEnemyAttack(activePet);
      setIsProcessingTurn(false);
    }
  };

  // Use Medicine
  const handleUsePotion = (potionId: string) => {
    if (isProcessingTurn) return;
    const potion = ITEMS_DATA[potionId];
    if (!potion) return;

    if (potion.isRevive && activePet.currentHp > 0) {
      logMessage('该幻灵尚未脱力，无需使用复生灵草！');
      return;
    }
    if (!potion.isRevive && activePet.currentHp <= 0) {
      logMessage('脱力幻灵需使用返魂定魄草！');
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
      logMessage(`${activePet.nickname} 服用灵药，恢复了气血！`);
    } else if (potion.healPp) {
      updatedPet.moves = activePet.moves.map((m) => ({
        ...m,
        pp: Math.min(m.maxPp, m.pp + (potion.healPp || 10)),
      }));
      sound.playHeal();
      logMessage(`${activePet.nickname} 招式灵力 (PP) 恢复了！`);
    }

    const updatedParty = party.map((p, idx) => (idx === activePetIndex ? updatedPet : p));
    setParty(updatedParty);
    setBattleMenu('ACTIONS');

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
    logMessage(`召回 ${activePet.nickname}，唤出出战幻灵 ${party[index].nickname}！`);
    setActivePetIndex(index);
    setBattleMenu('ACTIONS');

    if (activePet.currentHp > 0) {
      setIsProcessingTurn(true);
      setTimeout(async () => {
        await executeEnemyAttack(party[index]);
        setIsProcessingTurn(false);
      }, 700);
    }
  };

  // Flee
  const handleFlee = () => {
    if (!isWild) {
      logMessage('凌霄试炼与正规对决中不可避战逃跑！');
      return;
    }
    sound.playClick();
    logMessage('成功脱离战斗！');
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

  // Battle win resolution
  const handleBattleWin = async () => {
    sound.playVictory();
    const expGain = Math.floor(enemy.level * 50 + Math.random() * 25);
    const coinsGain = Math.floor(enemy.level * 40 + 60);

    const levelUps: { petName: string; oldLevel: number; newLevel: number }[] = [];
    const evolutions: { petName: string; newSpeciesName: string; newSpeciesId: string }[] = [];

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
    <div
      className={`relative w-full max-w-5xl mx-auto flash-viewport-wrapper rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b ${getArenaGradients()} text-slate-100 flex flex-col min-h-[600px] ${
        screenShaking ? 'animate-screen-shake' : ''
      }`}
    >
      {/* Decorative Gilded Corner Brackets */}
      <div className="corner-ornament-tl" />
      <div className="corner-ornament-tr" />
      <div className="corner-ornament-bl" />
      <div className="corner-ornament-br" />

      {/* Top Arena Header Bar (Image 1 Layout) */}
      <div className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 bg-gradient-to-b from-[#0a1527]/95 via-[#09101f]/90 to-transparent z-30 shadow-md">
        {/* Left: 幻灵秘境 SPIRIT REALM Logo with Vermilion Seal (Image 1) */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="game-title-font text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
                幻灵秘境
              </span>
              <span className="text-[9px] bg-red-700 text-amber-200 px-1 py-0.2 rounded border border-red-500/60 font-serif shadow-xs">
                幻灵
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-amber-300/80 font-mono font-bold -mt-0.5">
              — SPIRIT REALM —
            </span>
          </div>
        </div>

        {/* Center: 动作顺序 (Action Order Track) from Image 1 */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-amber-300/90 tracking-widest">
            动作顺序
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-500/40 shadow-inner">
            <span className="text-amber-400 font-bold text-xs">‹</span>
            {/* Player Spirit Icons */}
            <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-emerald-950 flex items-center justify-center overflow-hidden shadow-sm" title="我方动作">
              <PetAvatar speciesId={activePet.speciesId} size={28} />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-emerald-950 flex items-center justify-center overflow-hidden opacity-85 shadow-sm" title="我方动作">
              <PetAvatar speciesId={activePet.speciesId} size={28} />
            </div>
            {/* Enemy Spirit Icons */}
            <div className="w-7 h-7 rounded-full border-2 border-rose-400 bg-rose-950 flex items-center justify-center overflow-hidden opacity-85 shadow-sm" title="敌方动作">
              <PetAvatar speciesId={enemy.speciesId} size={28} />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-rose-400 bg-rose-950 flex items-center justify-center overflow-hidden opacity-70 shadow-sm" title="敌方动作">
              <PetAvatar speciesId={enemy.speciesId} size={28} />
            </div>
            <span className="text-amber-400 font-bold text-xs">›</span>
          </div>
        </div>

        {/* Right: Weather Pill & Ornate Utility Buttons (Image 1: 拥存 / 逃跑) */}
        <div className="flex items-center gap-2.5">
          {/* Weather Dropdown */}
          {(() => {
            const cfg = WEATHER_CONFIGS[weatherState.weather];
            return (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowWeatherTooltip(!showWeatherTooltip)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md ${cfg.color.badgeBg} ${cfg.color.badgeBorder} ${cfg.color.glow}`}
                >
                  <span className={cfg.color.textColor}>{cfg.name}</span>
                </button>
              </div>
            );
          })()}

          {/* 拥存 (Inventory / Bag Button from Image 1) */}
          <button
            onClick={() => {
              sound.playClick();
              setBattleMenu(battleMenu === 'POTIONS' ? 'ACTIONS' : 'POTIONS');
            }}
            className="flex flex-col items-center group cursor-pointer"
            title="查看储物袋与灵药"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-amber-200 shadow-md group-hover:scale-105 transition-transform">
              <Backpack className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-amber-200 mt-0.5">拥存</span>
          </button>

          {/* 逃跑 (Flee Button from Image 1) */}
          <button
            onClick={handleFlee}
            disabled={isProcessingTurn}
            className="flex flex-col items-center group cursor-pointer disabled:opacity-40"
            title="脱离本次对决"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-rose-950 to-slate-900 border-2 border-amber-400 flex items-center justify-center text-rose-300 shadow-md group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-amber-200 mt-0.5">逃跑</span>
          </button>
        </div>
      </div>

      {/* Main Battle Stage Arena: Roco Kingdom Style Sunlit Magic Academy & Whispering Wind Meadow */}
      <div className="relative flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden bg-[#0c2240]">
        {/* =========================================================================
            Roco Kingdom Illustrated Magic Meadow & Fairy Sky (Image 1 Style)
            ========================================================================= */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
          {/* Sunny Magic Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e40af] via-[#0284c7] via-50% to-[#0f766e]" />

          {/* Distant Floating Islands, Magic Academy Spires & Fluffy Clouds */}
          <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full object-cover opacity-85">
            {/* Distant Sunny Mountains */}
            <path d="M 0 340 Q 220 220 460 280 Q 720 180 1000 300 L 1000 600 L 0 600 Z" fill="#044e54" opacity="0.6" />
            <path d="M 120 360 Q 340 250 600 310 Q 820 230 1000 330" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.5" />

            {/* Distant Magic Academy Castle Spires on Mountain (Center Right) */}
            <g transform="translate(680, 160)" opacity="0.75">
              {/* Central Spire */}
              <rect x="30" y="40" width="24" height="80" fill="#1e3a8a" />
              <polygon points="30,40 42,0 54,40" fill="#3b82f6" stroke="#fde047" strokeWidth="1" />
              <polygon points="42,0 43,2 45,2 43.5,3.5 44,5 42,4 40,5 40.5,3.5 39,2 41,2" fill="#fde047" />
              {/* Left Spire */}
              <rect x="10" y="60" width="16" height="60" fill="#1e3a8a" />
              <polygon points="10,60 18,30 26,60" fill="#3b82f6" stroke="#fde047" strokeWidth="1" />
              {/* Right Spire */}
              <rect x="58" y="65" width="16" height="55" fill="#1e3a8a" />
              <polygon points="58,65 66,35 74,65" fill="#3b82f6" stroke="#fde047" strokeWidth="1" />
            </g>

            {/* Floating Island in Sky (Top Left) */}
            <g transform="translate(80, 80)" opacity="0.8">
              <ellipse cx="60" cy="50" rx="55" ry="16" fill="#15803d" />
              <path d="M 5 50 Q 60 90 115 50 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              {/* Little tree on floating island */}
              <rect x="56" y="30" width="6" height="20" fill="#78350f" />
              <circle cx="59" cy="24" r="16" fill="#22c55e" />
              <circle cx="50" cy="20" r="12" fill="#4ade80" />
            </g>

            {/* Soft Whimsical Anime Clouds */}
            <g fill="#ffffff" opacity="0.35">
              <ellipse cx="280" cy="140" rx="80" ry="24" />
              <circle cx="250" cy="125" r="30" />
              <circle cx="310" cy="130" r="25" />
              <ellipse cx="820" cy="110" rx="90" ry="26" />
              <circle cx="800" cy="95" r="32" />
              <circle cx="850" cy="100" r="28" />
            </g>

            {/* Lush Foreground Green Meadow Grassland Waves */}
            <path d="M -20 440 Q 220 380 500 420 Q 780 370 1020 430 L 1020 600 L -20 600 Z" fill="#15803d" opacity="0.85" />
            <path d="M -20 480 Q 260 430 520 470 Q 780 430 1020 480 L 1020 600 L -20 600 Z" fill="#166534" />
            
            {/* Cute Daisies & Clover Flowers on Meadow */}
            <circle cx="160" cy="470" r="3" fill="#fef08a" />
            <circle cx="156" cy="468" r="2" fill="#ffffff" />
            <circle cx="164" cy="468" r="2" fill="#ffffff" />
            <circle cx="160" cy="464" r="2" fill="#ffffff" />
            <circle cx="160" cy="474" r="2" fill="#ffffff" />

            <circle cx="840" cy="460" r="3" fill="#fef08a" />
            <circle cx="836" cy="458" r="2" fill="#ffffff" />
            <circle cx="844" cy="458" r="2" fill="#ffffff" />
            <circle cx="840" cy="454" r="2" fill="#ffffff" />
            <circle cx="840" cy="464" r="2" fill="#ffffff" />
          </svg>

          {/* Floating Starlight Motes & Fairy Dust */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-200 blur-2xs top-1/4 left-1/4 animate-ping" style={{ animationDuration: '3.5s' }} />
          <div className="absolute w-3 h-3 rounded-full bg-cyan-200 blur-2xs top-1/3 right-1/4 animate-pulse" />
          <div className="absolute w-2 h-2 rounded-full bg-amber-200 blur-2xs top-2/3 left-1/3 animate-ping" style={{ animationDuration: '4.5s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-200 blur-2xs bottom-1/3 right-1/3 animate-pulse" />

          {/* Soft Sunlight Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#065f46]/10 to-[#022c22]/40 pointer-events-none" />
        </div>

        {/* Dynamic Weather Particle & Light Rays Overlay */}
        <WeatherOverlay weather={weatherState.weather} />

        {/* Floating Damage Text Popup */}
        {damagePopup && (
          <div
            className={`absolute z-40 font-black text-3xl tracking-wider select-none animate-bounce game-title-font ${
              damagePopup.target === 'enemy' ? 'top-20 right-36' : 'bottom-36 left-36'
            } ${
              damagePopup.isCrit
                ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] scale-125'
                : damagePopup.isEffective
                ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                : 'text-amber-200'
            }`}
          >
            {damagePopup.isCrit && '★ 暴击! '}
            {damagePopup.text}
            {damagePopup.isEffective && ' 拔群!'}
          </div>
        )}

        {/* =========================================================================
            DUELISTS ARENA STAGE (Image 1: Left Fawn & Right Phoenix)
            ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center flex-1 my-auto">
          {/* 1. LEFT: Player Spirit (主灵唯鹿 / 青木鹿) */}
          <div className="flex flex-col items-start space-y-3">
            {/* Player Status Plaque (Image 1 Style) */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#0d2238]/90 via-[#0a1b2d]/85 to-transparent border-2 border-emerald-500/40 shadow-xl backdrop-blur-md min-w-[260px] max-w-xs">
              {/* Left Wood Element Badge (WOOD 🌿 in Image 1) */}
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-gradient-to-br from-emerald-600 to-teal-800 flex flex-col items-center justify-center text-white shadow-md shrink-0">
                <Trees className="w-4 h-4 text-emerald-200" />
                <span className="text-[7px] font-black uppercase tracking-wider -mt-0.5">WOOD</span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-white tracking-wide">
                    {activePet.nickname || '主灵唯鹿'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">
                    Lv.{activePet.level}
                  </span>
                </div>

                {/* HP Gauge (Red-Orange with Gold Border in Image 1) */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="text-rose-400 font-bold shrink-0">HP</span>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-amber-500/50 p-0.2 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, (activePet.currentHp / activePet.stats.hp) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-300 shrink-0">
                    {activePet.currentHp}/{activePet.stats.hp}
                  </span>
                </div>

                {/* MP Gauge (Cyan-Blue with Gold Border in Image 1) */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold shrink-0">MP</span>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-amber-500/50 p-0.2 shadow-inner">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full" />
                  </div>
                  <span className="text-[8px] text-slate-400 shrink-0">100/100</span>
                </div>
              </div>
            </div>

            {/* Player Spirit Sprite on Meadow Grass with Glowing Flora (Image 1 Left) */}
            <div className="relative flex flex-col items-center ml-2 sm:ml-6 mt-1">
              <PetAvatar
                speciesId={activePet.speciesId}
                size={180}
                isFlipped={true}
                isAttacking={playerAttacking}
                isHit={playerHit}
                className="transition-transform duration-200 drop-shadow-[0_12px_32px_rgba(16,185,129,0.55)]"
              />
              {/* Grand Floating Celestial Meadow Dais with Ancient Runes & Cyan Spores */}
              <div className="relative w-56 h-12 -mt-5 flex items-center justify-center pointer-events-none">
                <div className="absolute inset-0 rounded-[50%] bg-gradient-to-r from-emerald-600/30 via-teal-500/40 to-cyan-500/30 border-2 border-emerald-400/60 shadow-[0_0_36px_rgba(52,211,153,0.7)] animate-pulse" />
                <div className="absolute w-40 h-6 rounded-[50%] border border-cyan-300/80 blur-2xs" />
                <div className="absolute w-24 h-3 rounded-[50%] bg-white/40 blur-xs" />
              </div>
            </div>
          </div>

          {/* 2. RIGHT: Enemy Spirit (凤凰巢 / 烈焰凰) */}
          <div className="flex flex-col items-end space-y-3">
            {/* Enemy Status Plaque (Image 1 Style) */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-l from-[#2a0e0e]/95 via-[#1f0a0a]/90 to-transparent border-2 border-rose-500/50 shadow-2xl backdrop-blur-md min-w-[260px] max-w-xs">
              <div className="flex-1 space-y-1 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    Lv.{enemy.level}
                  </span>
                  <span className="font-black text-sm text-white tracking-wide">
                    {enemySpecies.name || '凤凰巢'}
                  </span>
                </div>

                {/* HP Gauge */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono justify-end">
                  <span className="text-[9px] text-slate-300 shrink-0">
                    {enemy.currentHp}/{enemy.stats.hp}
                  </span>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-amber-500/50 p-0.2 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, (enemy.currentHp / enemy.stats.hp) * 100)}%` }}
                    />
                  </div>
                  <span className="text-rose-400 font-bold shrink-0">HP</span>
                </div>

                {/* MP Gauge */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono justify-end">
                  <span className="text-[8px] text-slate-400 shrink-0">100/100</span>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-amber-500/50 p-0.2 shadow-inner">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full" />
                  </div>
                  <span className="text-cyan-400 font-bold shrink-0">MP</span>
                </div>
              </div>

              {/* Right Fire Element Badge (FIRE 🔥 in Image 1) */}
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-gradient-to-br from-rose-600 to-amber-600 flex flex-col items-center justify-center text-white shadow-md shrink-0">
                <Flame className="w-4 h-4 text-amber-200" />
                <span className="text-[7px] font-black uppercase tracking-wider -mt-0.5">FIRE</span>
              </div>
            </div>

            {/* Enemy Spirit Sprite Perched on Craggy Volcanic Rock (Image 1 Right) */}
            <div className="relative flex flex-col items-center mr-2 sm:mr-6 mt-1">
              <PetAvatar
                speciesId={enemy.speciesId}
                size={175}
                isAttacking={enemyAttacking}
                isHit={enemyHit}
                className="transition-transform duration-200 drop-shadow-[0_12px_32px_rgba(244,63,94,0.55)]"
              />
              {/* Fiery Molten Volcanic Rock Dais with Pulsing Magma Glow */}
              <div className="relative w-56 h-12 -mt-5 flex items-center justify-center pointer-events-none">
                <div className="absolute inset-0 rounded-[50%] bg-gradient-to-r from-red-600/35 via-orange-500/40 to-amber-500/35 border-2 border-amber-400/60 shadow-[0_0_36px_rgba(245,158,11,0.7)] animate-pulse" />
                <div className="absolute w-40 h-6 rounded-[50%] border border-orange-400/80 blur-2xs" />
                <div className="absolute w-24 h-3 rounded-[50%] bg-amber-200/40 blur-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM COMMAND CONSOLE: Battle Directory, Turn Pill & Circular Skills (Image 1)
          ========================================================================= */}
      <div className="relative bg-gradient-to-t from-[#020813] via-[#051120] to-[#081a2e]/90 border-t-2 border-[#b48a52]/40 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shadow-2xl backdrop-blur-xl">
        {/* Left: 战斗目录 (Battle Directory & Logs from Image 1) */}
        <div className="w-full md:w-72 rounded-2xl p-3 bg-gradient-to-b from-[#0f243a]/90 to-[#071322]/95 border border-cyan-500/30 text-xs shadow-xl flex flex-col justify-between h-28">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1 mb-1">
            <span className="font-black text-amber-300 flex items-center gap-1.5 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>✦ 战斗目录</span>
            </span>
            <span className="text-[9px] font-mono text-cyan-300">魔法对决</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 text-[11px] pr-1 leading-relaxed text-slate-300">
            {battleLog.slice(0, 3).map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-amber-200 font-bold' : 'text-slate-400'}>
                {idx === 0 ? '▶ ' : '  '}
                {log}
              </p>
            ))}
            {battleLog.length === 0 && (
              <p className="text-slate-400 italic">双方幻灵蓄势待发，五行道韵与乾坤灵气在战台上流转！</p>
            )}
          </div>
        </div>

        {/* Center: 当前回合: 玩家 (Current Turn Indicator from Image 1) */}
        <div className="flex flex-col items-center">
          <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border-2 border-amber-400 text-amber-200 text-xs font-black shadow-[0_0_16px_rgba(245,158,11,0.4)] animate-pulse">
            当前回合: {isProcessingTurn ? '仙术对决中...' : '仙师出招'}
          </div>

          {/* Quick Utility Switchers below Turn Indicator */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                sound.playClick();
                setBattleMenu('BALLS');
              }}
              className="text-[10px] text-cyan-300 hover:text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 cursor-pointer transition-colors"
            >
              灵契晶石
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setBattleMenu('SWITCH');
              }}
              className="text-[10px] text-slate-300 hover:text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer transition-colors"
            >
              唤回轮换
            </button>
          </div>
        </div>

        {/* Right: Circular Golden Skill Buttons (Image 1 Exact Layout) */}
        <div className="flex items-center gap-3">
          {/* Sub-menu overlays (BALLS, POTIONS, SWITCH) */}
          {battleMenu !== 'ACTIONS' && battleMenu !== 'MOVES' ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBattleMenu('ACTIONS')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold border border-amber-500/40 cursor-pointer"
              >
                返回灵术
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Skill 1 (Secondary): 治愈之光 */}
              {activePet.moves[1] && (
                <button
                  disabled={isProcessingTurn || activePet.moves[1].pp <= 0}
                  onClick={() => handleSelectMove(activePet.moves[1].id)}
                  className="flex flex-col items-center group cursor-pointer disabled:opacity-40"
                  title={`${MOVES_DATA[activePet.moves[1].id]?.name || '治愈之光'} (PP: ${activePet.moves[1].pp})`}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-b from-emerald-600 to-teal-900 flex items-center justify-center text-emerald-200 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform ring-2 ring-emerald-500/40">
                    <Sparkles className="w-6 h-6 text-emerald-200 filter drop-shadow-[0_0_6px_#34d399]" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-200 mt-1">
                    {MOVES_DATA[activePet.moves[1].id]?.name || '治愈之光'}
                  </span>
                </button>
              )}

              {/* Skill 2 (Secondary): 烈焰之息 */}
              {activePet.moves[2] && (
                <button
                  disabled={isProcessingTurn || activePet.moves[2].pp <= 0}
                  onClick={() => handleSelectMove(activePet.moves[2].id)}
                  className="flex flex-col items-center group cursor-pointer disabled:opacity-40"
                  title={`${MOVES_DATA[activePet.moves[2].id]?.name || '烈焰之息'} (PP: ${activePet.moves[2].pp})`}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-b from-rose-600 to-amber-900 flex items-center justify-center text-amber-200 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform ring-2 ring-orange-500/40">
                    <Flame className="w-6 h-6 text-amber-300 filter drop-shadow-[0_0_6px_#f59e0b]" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-200 mt-1">
                    {MOVES_DATA[activePet.moves[2].id]?.name || '烈焰之息'}
                  </span>
                </button>
              )}

              {/* Skill 3 (Secondary): 凤凰涅槃 */}
              {activePet.moves[3] && (
                <button
                  disabled={isProcessingTurn || activePet.moves[3].pp <= 0}
                  onClick={() => handleSelectMove(activePet.moves[3].id)}
                  className="flex flex-col items-center group cursor-pointer disabled:opacity-40"
                  title={`${MOVES_DATA[activePet.moves[3].id]?.name || '凤凰涅槃'} (PP: ${activePet.moves[3].pp})`}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-600 to-red-950 flex items-center justify-center text-yellow-200 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform ring-2 ring-yellow-500/40">
                    <Zap className="w-6 h-6 text-amber-200 filter drop-shadow-[0_0_6px_#fde047]" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-200 mt-1">
                    {MOVES_DATA[activePet.moves[3].id]?.name || '凤凰涅槃'}
                  </span>
                </button>
              )}

              {/* PRIMARY HIGHLIGHTED SKILL BUTTON (Large Double-Rimmed Button from Image 1: 藤蔓缠绕) */}
              {activePet.moves[0] && (
                <button
                  disabled={isProcessingTurn || activePet.moves[0].pp <= 0}
                  onClick={() => handleSelectMove(activePet.moves[0].id)}
                  className="flex flex-col items-center group cursor-pointer disabled:opacity-40 ml-1"
                  title={`释放主技能【${MOVES_DATA[activePet.moves[0].id]?.name || '藤蔓缠绕'}】`}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-[#ca8a04] bg-gradient-to-b from-[#065f46] via-[#047857] to-[#022c22] flex items-center justify-center text-white shadow-[0_0_24px_rgba(74,222,128,0.6)] group-hover:scale-108 group-active:scale-95 transition-all ring-2 ring-[#fde047]">
                    <Trees className="w-8 h-8 text-emerald-300 filter drop-shadow-[0_0_8px_#4ade80]" />
                  </div>
                  <span className="text-xs font-black text-amber-300 mt-1 tracking-wider drop-shadow-sm">
                    {MOVES_DATA[activePet.moves[0].id]?.name || '藤蔓缠绕'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay for BALLS, POTIONS, SWITCH, or MOVES */}
      {battleMenu !== 'ACTIONS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0f243a] to-[#071322] rounded-3xl border-2 border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <span className="text-base font-black text-amber-300 game-title-font flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>
                  {battleMenu === 'MOVES'
                    ? '灵术秘典 · 选择施展神通'
                    : battleMenu === 'BALLS'
                    ? '灵契法器 · 祭出封神晶石'
                    : battleMenu === 'POTIONS'
                    ? '储物宝囊 · 服用回春丹药'
                    : '本命随行 · 唤回轮换幻灵'}
                </span>
              </span>

              <button
                onClick={() => setBattleMenu('ACTIONS')}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
              >
                返回对决
              </button>
            </div>

            {/* BALLS PANEL */}
            {battleMenu === 'BALLS' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {inventory
                    .filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL')
                    .map((slot) => {
                      const item = ITEMS_DATA[slot.itemId];
                      return (
                        <button
                          key={slot.itemId}
                          disabled={isProcessingTurn || slot.count <= 0}
                          onClick={() => {
                            setBattleMenu('ACTIONS');
                            handleThrowBall(slot.itemId);
                          }}
                          className="text-left p-3.5 rounded-2xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between shadow-md"
                        >
                          <div>
                            <div className="font-bold text-sm text-amber-200 game-title-font">{item.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/70 text-amber-300 border border-amber-400/50">
                            x{slot.count}
                          </span>
                        </button>
                      );
                    })}
                </div>
                {inventory.filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL').length === 0 && (
                  <div className="text-xs text-slate-400 text-center py-6">
                    储物袋中已无灵契晶石，请前往万宝商阁购买！
                  </div>
                )}
              </div>
            )}

            {/* POTIONS PANEL */}
            {battleMenu === 'POTIONS' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {inventory
                    .filter((i) => ['POTION', 'PP', 'REVIVE'].includes(ITEMS_DATA[i.itemId]?.category))
                    .map((slot) => {
                      const item = ITEMS_DATA[slot.itemId];
                      return (
                        <button
                          key={slot.itemId}
                          disabled={isProcessingTurn || slot.count <= 0}
                          onClick={() => {
                            setBattleMenu('ACTIONS');
                            handleUsePotion(slot.itemId);
                          }}
                          className="text-left p-3.5 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between shadow-md"
                        >
                          <div>
                            <div className="font-bold text-sm text-emerald-200 game-title-font">{item.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/70 text-emerald-300 border border-emerald-400/50">
                            x{slot.count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* SWITCH PET PANEL */}
            {battleMenu === 'SWITCH' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {party.map((p, idx) => {
                  const isDead = p.currentHp <= 0;
                  const isCurrent = idx === activePetIndex;
                  return (
                    <button
                      key={p.uid}
                      disabled={isDead || isCurrent}
                      onClick={() => {
                        handleSwitchPet(idx);
                      }}
                      className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg'
                          : isDead
                          ? 'bg-slate-900/40 border-slate-800 opacity-40 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-700 hover:border-cyan-400 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PetAvatar speciesId={p.speciesId} size={42} />
                        <div className="truncate">
                          <div className="font-bold text-xs text-white truncate game-title-font">{p.nickname}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Lv.{p.level}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
                        HP: {p.currentHp}/{p.stats.hp}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Victory / Rewards Modal (Classic Flash Fanfare Pop-up) */}
      {victoryData?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="flash-frame rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl space-y-6">
            <div className="flex justify-center">
              <div className="w-18 h-18 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-4 border-yellow-200 flex items-center justify-center text-slate-950 shadow-2xl animate-bounce">
                <Award className="w-10 h-10 text-slate-950" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-amber-300 game-title-font">对决大获全胜！</h2>
              <p className="text-slate-300 text-xs mt-1">
                恭喜灵契师！你与本命幻灵的心念默契更上一层楼！
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
              <div className="text-left">
                <span className="text-xs text-slate-400">获得修为经验</span>
                <p className="text-xl font-bold text-cyan-300 font-mono">+{victoryData.expEarned} EXP</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">获得天地灵石</span>
                <p className="text-xl font-bold text-amber-300 font-mono">+{victoryData.coinsEarned} 灵石</p>
              </div>
            </div>

            {/* Level Ups */}
            {victoryData.levelUps.map((lvl, i) => (
              <div key={i} className="bg-emerald-950/80 border-2 border-emerald-500/60 p-3 rounded-2xl text-emerald-200 text-sm font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>【{lvl.petName}】 等级提升至 Lv.{lvl.newLevel}！全属性大幅突破！</span>
              </div>
            ))}

            {/* Evolutions */}
            {victoryData.evolutions.map((evo, i) => (
              <div key={i} className="bg-purple-950/80 border-2 border-purple-400 p-4 rounded-2xl text-purple-200 text-sm">
                <p className="text-amber-300 font-black text-base mb-1 game-title-font">✨ 远古血脉觉醒 · 化形蜕变！</p>
                【{evo.petName}】 领悟了天地本源灵脉，成功化形为 【{evo.newSpeciesName}】！
                <div className="flex justify-center mt-3">
                  <PetAvatar speciesId={evo.newSpeciesId} size={76} />
                </div>
              </div>
            ))}

            {/* Captured pet */}
            {victoryData.captured && (
              <div className="bg-amber-950/70 border-2 border-amber-400/60 p-3 rounded-2xl text-amber-200 text-sm flex items-center justify-center gap-3">
                <PetAvatar speciesId={victoryData.captured.speciesId} size={50} />
                <span className="font-bold">成功缔约新伙伴 【{PET_SPECIES[victoryData.captured.speciesId].name}】！已加入战队！</span>
              </div>
            )}

            <button
              onClick={handleFinishVictoryModal}
              className="flash-gold-btn w-full py-3.5 rounded-2xl text-base cursor-pointer shadow-xl"
            >
              继续探索秘境
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
