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

    let moveSlot = activePet.moves.find((m) => m.id === moveId);
    let petMoves = [...activePet.moves];
    if (!moveSlot) {
      moveSlot = { id: moveId, pp: move.maxPp, maxPp: move.maxPp };
      petMoves.push(moveSlot);
    }
    if (moveSlot.pp <= 0) {
      logMessage('此招式灵力 (PP) 已耗尽，请使用其他灵术！');
      return;
    }

    setIsProcessingTurn(true);
    setBattleMenu('ACTIONS');

    // Deduct 1 PP
    const updatedMoves = petMoves.map((m) => (m.id === moveId ? { ...m, pp: m.pp - 1 } : m));
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
      if (move.effect?.type === 'HEAL') {
        const healAmt = move.effect.amount || 50;
        const newHp = Math.min(attacker.stats.hp, attacker.currentHp + healAmt);
        attacker.currentHp = newHp;
        setParty((prev) => prev.map((p, idx) => (idx === activePetIndex ? { ...p, currentHp: newHp } : p)));
        sound.playHeal();
        logMessage(`【治愈之光】灵气充盈，${attacker.nickname} 回复了 ${healAmt} 点生命！`);
        return false;
      }
      logMessage(`状态灵术【${move.name}】生效了！`);
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

  // Ensure 4 iconic Roco Kingdom skill slots are populated:
  // Slot 0: 藤蔓缠绕 (Primary Large Orb)
  // Slot 1: 治愈之光 (Secondary Bottom-Left)
  // Slot 2: 烈焰之息 (Secondary Top-Left)
  // Slot 3: 凤凰涅槃 (Secondary Top-Right)
  const defaultMoveSlots = [
    { id: 'vine_entangle', pp: 25, maxPp: 25 },
    { id: 'healing_light', pp: 15, maxPp: 15 },
    { id: 'blazing_breath', pp: 20, maxPp: 20 },
    { id: 'phoenix_nirvana', pp: 5, maxPp: 5 },
  ];

  const movesToDisplay = [
    activePet.moves[0] || defaultMoveSlots[0],
    activePet.moves[1] || defaultMoveSlots[1],
    activePet.moves[2] || defaultMoveSlots[2],
    activePet.moves[3] || defaultMoveSlots[3],
  ];

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-2 border-[#b8860b]/40 bg-[#06111f] text-slate-100 flex flex-col min-h-[640px] ${
        screenShaking ? 'animate-screen-shake' : ''
      }`}
    >
      {/* Decorative Gilded Corner Brackets */}
      <div className="corner-ornament-tl" />
      <div className="corner-ornament-tr" />
      <div className="corner-ornament-bl" />
      <div className="corner-ornament-br" />

      {/* Top Arena Header Bar (Roco Kingdom Image 1 Layout) */}
      <div className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 bg-gradient-to-b from-[#040e1b]/95 via-[#061426]/85 to-transparent z-30 select-none border-b border-[#b8860b]/20">
        {/* Left: 幻灵秘境 SPIRIT REALM Logo with Vermilion Seal */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="roco-title-font text-2xl sm:text-3xl roco-gold-text tracking-wide drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
                幻灵秘境
              </span>
              <span className="roco-seal text-[10px] px-1.5 py-0.5 font-bold tracking-wider">
                幻境
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-amber-300/85 font-mono font-bold -mt-0.5">
              — SPIRIT REALM —
            </span>
          </div>
        </div>

        {/* Center: 动作顺序 (Action Order Track) */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300/90 roco-title-font tracking-widest">
            <span className="text-amber-400 text-xs">◇</span>
            <span>动作顺序</span>
            <span className="text-amber-400 text-xs">◇</span>
          </div>
          <div className="roco-action-track flex items-center gap-1.5 mt-0.5 px-3 py-1 shadow-inner">
            <span className="text-amber-400/80 font-bold text-xs">‹</span>
            {/* Player Spirit Icons */}
            <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-emerald-950/80 flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-emerald-300/60" title="我方动作">
              <PetAvatar speciesId={activePet.speciesId} size={28} />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-emerald-950/80 flex items-center justify-center overflow-hidden opacity-90 shadow-sm" title="我方动作">
              <PetAvatar speciesId={activePet.speciesId} size={28} />
            </div>
            {/* Enemy Spirit Icons */}
            <div className="w-7 h-7 rounded-full border-2 border-amber-400 bg-rose-950/80 flex items-center justify-center overflow-hidden opacity-90 shadow-sm ring-1 ring-amber-300/60" title="敌方动作">
              <PetAvatar speciesId={enemy.speciesId} size={28} />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-amber-400 bg-rose-950/80 flex items-center justify-center overflow-hidden opacity-75 shadow-sm" title="敌方动作">
              <PetAvatar speciesId={enemy.speciesId} size={28} />
            </div>
            <span className="text-amber-400/80 font-bold text-xs">›</span>
          </div>
        </div>

        {/* Right: Weather & Antique Medallion Action Buttons (拥存 / 逃跑) */}
        <div className="flex items-center gap-3">
          {/* Weather Pill */}
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

          {/* 拥存 (Inventory / Bag Medallion Button) */}
          <button
            onClick={() => {
              sound.playClick();
              setBattleMenu(battleMenu === 'POTIONS' ? 'ACTIONS' : 'POTIONS');
            }}
            className="flex flex-col items-center group cursor-pointer"
            title="查看储物袋与灵药"
          >
            <div className="roco-medallion-btn text-amber-200">
              <Backpack className="w-4 h-4 text-amber-200 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] font-bold text-amber-200/90 mt-1 tracking-wider roco-title-font">拥存</span>
          </button>

          {/* 逃跑 (Flee Medallion Button) */}
          <button
            onClick={handleFlee}
            disabled={isProcessingTurn}
            className="flex flex-col items-center group cursor-pointer disabled:opacity-40"
            title="脱离本次对决"
          >
            <div className="roco-medallion-btn text-amber-200">
              <ArrowRightLeft className="w-4 h-4 text-amber-200 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] font-bold text-amber-200/90 mt-1 tracking-wider roco-title-font">逃跑</span>
          </button>
        </div>
      </div>

      {/* Main Battle Stage Arena: Roco Kingdom Enchanted Secret Realm Forest at Night (Image 1 Style) */}
      <div className="relative flex-1 p-3 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden bg-[#05111e]">
        {/* =========================================================================
            Roco Kingdom Illustrated Enchanted Night Forest & Waterfall Secret Realm
            ========================================================================= */}
        {/* =========================================================================
            Roco Kingdom Genuine High-Resolution Illustrated Battle Arena Background
            ========================================================================= */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
          <img
            src="/assets/scenes/battle_forest.jpg"
            alt="Battle Arena"
            className="w-full h-full object-cover object-center brightness-90 contrast-105"
          />
          {/* Subtle Ambient Night Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />

          {/* Floating Twinkling Golden & Cyan Fireflies */}
          <div className="absolute w-2 h-2 rounded-full bg-yellow-200 blur-2xs top-1/3 left-1/4 animate-ping" style={{ animationDuration: '3.2s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-200 blur-2xs top-1/4 right-1/3 animate-pulse" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 blur-2xs top-2/3 left-1/3 animate-ping" style={{ animationDuration: '4.2s' }} />
          <div className="absolute w-2 h-2 rounded-full bg-emerald-200 blur-2xs bottom-1/3 right-1/4 animate-pulse" />
        </div>

        {/* Dynamic Weather Particle & Light Rays Overlay */}
        <WeatherOverlay weather={weatherState.weather} />

        {/* Floating Damage Text Popup */}
        {damagePopup && (
          <div
            className={`absolute z-40 font-black text-3xl sm:text-4xl tracking-wider select-none animate-bounce roco-title-font ${
              damagePopup.target === 'enemy' ? 'top-20 right-32' : 'bottom-36 left-32'
            } ${
              damagePopup.isCrit
                ? 'text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,0.9)] scale-125'
                : damagePopup.isEffective
                ? 'text-rose-400 drop-shadow-[0_0_14px_rgba(244,63,94,0.9)]'
                : 'text-amber-200 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'
            }`}
          >
            {damagePopup.isCrit && '★ 暴击! '}
            {damagePopup.text}
            {damagePopup.isEffective && ' 拔群!'}
          </div>
        )}

        {/* =========================================================================
            DUELISTS ARENA STAGE (Image 1: Left Fawn & Right Phoenix with Floating Badges)
            ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center flex-1 my-auto">
          {/* 1. LEFT: Player Spirit (主灵唯鹿 / qingmulu) */}
          <div className="flex flex-col items-start space-y-2">
            {/* Player Status Plaque (Frosted Glass with Antique Gold Borders) */}
            <div className="roco-panel p-2.5 sm:p-3 min-w-[270px] max-w-[320px] select-none flex items-center gap-2.5 shadow-2xl">
              {/* Left Leaf Badge */}
              <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shrink-0">
                <Trees className="w-5 h-5 text-emerald-200" />
              </div>

              {/* Center Name & Gauges */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="roco-title-font font-bold text-sm text-slate-100 tracking-wide truncate">
                    {activePet.nickname || '主灵唯鹿'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                    Lv.{activePet.level}
                  </span>
                </div>

                {/* HP Gauge */}
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-rose-400 font-black tracking-wider shrink-0">HP</span>
                  <div className="roco-gauge-track flex-1 h-3.5">
                    <div
                      className="roco-gauge-hp"
                      style={{ width: `${Math.max(0, Math.min(100, (activePet.currentHp / activePet.stats.hp) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-300 shrink-0 font-bold">
                    {activePet.currentHp}/{activePet.stats.hp}
                  </span>
                </div>

                {/* MP Gauge */}
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-cyan-400 font-black tracking-wider shrink-0">MP</span>
                  <div className="roco-gauge-track flex-1 h-3">
                    <div className="roco-gauge-mp" style={{ width: '100%' }} />
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0 font-bold">
                    100/100
                  </span>
                </div>
              </div>

              {/* Right Leaf Badge */}
              <div className="w-9 h-9 rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shrink-0">
                <Trees className="w-4 h-4 text-emerald-200" />
              </div>
            </div>

            {/* Player Spirit Sprite on Meadow Grass + Floating WOOD Badge (Image 1 Layout) */}
            <div className="relative flex items-end ml-2 sm:ml-4 mt-2">
              <div className="relative flex flex-col items-center">
                <PetAvatar
                  speciesId={activePet.speciesId}
                  size={185}
                  isFlipped={true}
                  isAttacking={playerAttacking}
                  isHit={playerHit}
                  className="transition-transform duration-200 drop-shadow-[0_12px_32px_rgba(56,189,248,0.65)]"
                />
                {/* Bioluminescent Starlight Ground Ring */}
                <div className="relative w-56 h-10 -mt-4 flex items-center justify-center pointer-events-none">
                  <div className="absolute inset-0 rounded-[50%] bg-gradient-to-r from-emerald-500/30 via-cyan-400/40 to-teal-500/30 border border-cyan-400/60 shadow-[0_0_32px_rgba(56,189,248,0.7)] animate-pulse" />
                  <div className="absolute w-36 h-4 rounded-[50%] bg-white/40 blur-xs" />
                </div>
              </div>

              {/* Floating WOOD Elemental Badge Beside Fawn (Image 1 Exact Element Badge) */}
              <div className="flex flex-col items-center mb-6 ml-3 pointer-events-none">
                <div className="roco-element-badge bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-[0_0_16px_rgba(16,185,129,0.7)]">
                  <Trees className="w-5 h-5 text-emerald-200 filter drop-shadow-[0_0_4px_#34d399]" />
                </div>
                <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest mt-1 roco-title-font drop-shadow-md">
                  WOOD
                </span>
              </div>
            </div>
          </div>

          {/* 2. RIGHT: Enemy Spirit (凤凰雏 / fentianhuang / chiyanque) */}
          <div className="flex flex-col items-end space-y-2">
            {/* Enemy Status Plaque (Frosted Glass with Antique Gold Borders) */}
            <div className="roco-panel p-2.5 sm:p-3 min-w-[270px] max-w-[320px] select-none flex items-center gap-2.5 shadow-2xl">
              {/* Left/Center Name & Gauges */}
              <div className="flex-1 min-w-0 space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 font-bold shrink-0">
                    Lv.{enemy.level}
                  </span>
                  <span className="roco-title-font font-bold text-sm text-slate-100 tracking-wide truncate">
                    {enemy.nickname || (enemy.speciesId === 'chiyanque' ? '凤凰雏' : enemySpecies.name)}
                  </span>
                </div>

                {/* HP Gauge */}
                <div className="flex items-center gap-2 text-[10px] font-mono justify-end">
                  <span className="text-[9px] text-slate-300 shrink-0 font-bold">
                    {enemy.currentHp}/{enemy.stats.hp}
                  </span>
                  <div className="roco-gauge-track flex-1 h-3.5">
                    <div
                      className="roco-gauge-hp"
                      style={{ width: `${Math.max(0, Math.min(100, (enemy.currentHp / enemy.stats.hp) * 100))}%` }}
                    />
                  </div>
                  <span className="text-rose-400 font-black tracking-wider shrink-0">HP</span>
                </div>

                {/* MP Gauge */}
                <div className="flex items-center gap-2 text-[10px] font-mono justify-end">
                  <span className="text-[9px] text-slate-400 shrink-0 font-bold">
                    100/100
                  </span>
                  <div className="roco-gauge-track flex-1 h-3">
                    <div className="roco-gauge-mp" style={{ width: '100%' }} />
                  </div>
                  <span className="text-cyan-400 font-black tracking-wider shrink-0">MP</span>
                </div>
              </div>

              {/* Right Fire Badge */}
              <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Flame className="w-5 h-5 text-amber-200" />
              </div>
            </div>

            {/* Enemy Spirit Sprite Perched on Rock + Floating FIRE Badges (Image 1 Layout) */}
            <div className="relative flex items-center mr-2 sm:mr-4 mt-2">
              {/* Floating FIRE Elemental Badge Beside Phoenix */}
              <div className="flex flex-col items-center mb-6 mr-3 pointer-events-none">
                <div className="roco-element-badge bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-[0_0_16px_rgba(249,115,22,0.7)]">
                  <Flame className="w-5 h-5 text-amber-200 filter drop-shadow-[0_0_4px_#f59e0b]" />
                </div>
                <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest mt-1 roco-title-font drop-shadow-md">
                  FIRE
                </span>
              </div>

              {/* Perched Phoenix on Rock */}
              <div className="relative flex flex-col items-center">
                {/* Secondary Upper Floating FIRE Badge (as seen in Image 1 upper right) */}
                <div className="absolute -top-6 -right-2 flex flex-col items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(249,115,22,0.6)]">
                    <Flame className="w-4 h-4 text-amber-200" />
                  </div>
                  <span className="text-[7px] font-black text-amber-200 uppercase tracking-widest mt-0.5 roco-title-font">FIRE</span>
                </div>

                <PetAvatar
                  speciesId={enemy.speciesId}
                  size={180}
                  isAttacking={enemyAttacking}
                  isHit={enemyHit}
                  className="transition-transform duration-200 drop-shadow-[0_12px_32px_rgba(249,115,22,0.65)]"
                />
                {/* Fiery Lava Ember Ground Ring */}
                <div className="relative w-56 h-10 -mt-4 flex items-center justify-center pointer-events-none">
                  <div className="absolute inset-0 rounded-[50%] bg-gradient-to-r from-red-600/35 via-orange-500/40 to-amber-500/35 border border-amber-400/60 shadow-[0_0_32px_rgba(245,158,11,0.7)] animate-pulse" />
                  <div className="absolute w-36 h-4 rounded-[50%] bg-amber-200/40 blur-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM COMMAND CONSOLE: Battle Directory, Turn Pill & Circular Skills (Image 1)
          ========================================================================= */}
      <div className="relative bg-gradient-to-t from-[#020813] via-[#051120] to-[#081a2e]/95 border-t-2 border-[#b8860b]/40 p-3 sm:p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shadow-2xl backdrop-blur-xl">
        {/* Left: 战斗目录 (Battle Directory & Logs from Image 1) */}
        <div className="roco-log-box w-full sm:w-76 p-3 text-xs flex flex-col justify-between h-32 select-none shadow-xl">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-1 mb-1">
            <span className="roco-title-font font-bold text-amber-300 flex items-center gap-1.5 tracking-wider text-xs">
              <span className="text-amber-400 text-sm">◇</span>
              <span>战斗目录</span>
            </span>
            <span className="text-[9px] text-cyan-300/80 font-mono">幻境交锋</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 text-[11px] pr-1 leading-relaxed text-slate-300">
            {battleLog.slice(0, 3).map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-amber-200 font-bold' : 'text-slate-400'}>
                {log}
              </p>
            ))}
            {battleLog.length < 2 && (
              <>
                <p className="text-slate-400">战回另火中的战，藤蔓缠绕。</p>
                <p className="text-slate-400">从家霆魑的菖愍，治愈之光效士。</p>
              </>
            )}
          </div>
        </div>

        {/* Center: 当前回合: 玩家 (Current Turn Indicator from Image 1) */}
        <div className="flex flex-col items-center">
          <div className="roco-turn-capsule px-6 py-1.5 text-amber-200 text-xs sm:text-sm font-bold roco-title-font shadow-lg animate-pulse tracking-wide">
            当前回合: {isProcessingTurn ? (playerAttacking ? '玩家施法' : '敌方攻击') : '玩家'}
          </div>

          {/* Quick Utility Switchers below Turn Indicator */}
          <div className="flex items-center gap-2.5 mt-2">
            <button
              onClick={() => {
                sound.playClick();
                setBattleMenu('BALLS');
              }}
              className="text-[10px] text-cyan-300 hover:text-white bg-[#061426]/90 px-3 py-1 rounded-full border border-cyan-500/50 cursor-pointer transition-all hover:border-cyan-400 shadow-sm"
            >
              灵契晶石 (捕捉)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setBattleMenu('SWITCH');
              }}
              className="text-[10px] text-amber-200/90 hover:text-white bg-[#061426]/90 px-3 py-1 rounded-full border border-amber-500/50 cursor-pointer transition-all hover:border-amber-400 shadow-sm"
            >
              唤回换宠
            </button>
          </div>
        </div>

        {/* Right: Circular Golden Skill Buttons (Image 1 Exact Layout) */}
        <div className="flex items-center">
          {/* Sub-menu overlay active fallback button */}
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
            <div className="relative w-64 h-32 flex items-end justify-end select-none pr-1">
              {/* 1. Skill 2 (Top Left): 烈焰之息 */}
              {movesToDisplay[2] && (
                <div className="absolute right-[82px] bottom-[68px] flex flex-col items-center">
                  <button
                    disabled={isProcessingTurn || movesToDisplay[2].pp <= 0}
                    onClick={() => handleSelectMove(movesToDisplay[2].id)}
                    className="roco-skill-secondary bg-gradient-to-br from-rose-600 via-orange-600 to-amber-700 text-amber-200 group disabled:opacity-40"
                    title={`${MOVES_DATA[movesToDisplay[2].id]?.name || '烈焰之息'} (PP: ${movesToDisplay[2].pp}/${movesToDisplay[2].maxPp})`}
                  >
                    <Flame className="w-6 h-6 text-amber-300 filter drop-shadow-[0_0_8px_#f97316]" />
                  </button>
                  <span className="roco-title-font text-[10px] font-bold text-amber-200 mt-0.5 tracking-wider drop-shadow-md">
                    {MOVES_DATA[movesToDisplay[2].id]?.name || '烈焰之息'}
                  </span>
                </div>
              )}

              {/* 2. Skill 3 (Top Right): 凤凰涅槃 */}
              {movesToDisplay[3] && (
                <div className="absolute right-[6px] bottom-[88px] flex flex-col items-center">
                  <button
                    disabled={isProcessingTurn || movesToDisplay[3].pp <= 0}
                    onClick={() => handleSelectMove(movesToDisplay[3].id)}
                    className="roco-skill-secondary bg-gradient-to-br from-amber-500 via-orange-600 to-red-900 text-yellow-200 group disabled:opacity-40"
                    title={`${MOVES_DATA[movesToDisplay[3].id]?.name || '凤凰涅槃'} (PP: ${movesToDisplay[3].pp}/${movesToDisplay[3].maxPp})`}
                  >
                    <Zap className="w-6 h-6 text-amber-200 filter drop-shadow-[0_0_8px_#fde047]" />
                  </button>
                  <span className="roco-title-font text-[10px] font-bold text-amber-200 mt-0.5 tracking-wider drop-shadow-md">
                    {MOVES_DATA[movesToDisplay[3].id]?.name || '凤凰涅槃'}
                  </span>
                </div>
              )}

              {/* 3. Skill 1 (Bottom Left): 治愈之光 */}
              {movesToDisplay[1] && (
                <div className="absolute right-[96px] bottom-[4px] flex flex-col items-center">
                  <button
                    disabled={isProcessingTurn || movesToDisplay[1].pp <= 0}
                    onClick={() => handleSelectMove(movesToDisplay[1].id)}
                    className="roco-skill-secondary bg-gradient-to-br from-emerald-600 via-teal-700 to-green-950 text-emerald-200 group disabled:opacity-40"
                    title={`${MOVES_DATA[movesToDisplay[1].id]?.name || '治愈之光'} (PP: ${movesToDisplay[1].pp}/${movesToDisplay[1].maxPp})`}
                  >
                    <Sparkles className="w-6 h-6 text-emerald-300 filter drop-shadow-[0_0_8px_#34d399]" />
                  </button>
                  <span className="roco-title-font text-[10px] font-bold text-amber-200 mt-0.5 tracking-wider drop-shadow-md">
                    {MOVES_DATA[movesToDisplay[1].id]?.name || '治愈之光'}
                  </span>
                </div>
              )}

              {/* 4. Skill 0 (Bottom Right): 藤蔓缠绕 (Large Primary Double-Rimmed Orb!) */}
              {movesToDisplay[0] && (
                <div className="absolute right-0 bottom-0 flex flex-col items-center">
                  <button
                    disabled={isProcessingTurn || movesToDisplay[0].pp <= 0}
                    onClick={() => handleSelectMove(movesToDisplay[0].id)}
                    className="roco-skill-primary group disabled:opacity-40"
                    title={`释放主技能【${MOVES_DATA[movesToDisplay[0].id]?.name || '藤蔓缠绕'}】(PP: ${movesToDisplay[0].pp}/${movesToDisplay[0].maxPp})`}
                  >
                    <div className="flex flex-col items-center justify-center leading-none select-none">
                      <span className="roco-title-font text-[13px] font-black text-emerald-100 tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        藤蔓
                      </span>
                      <span className="roco-title-font text-[13px] font-black text-emerald-100 tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-0.5">
                        缠绕
                      </span>
                    </div>
                  </button>
                  <span className="roco-title-font text-[11px] font-bold text-amber-200 mt-1 tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {MOVES_DATA[movesToDisplay[0].id]?.name || '藤蔓缠绕'}
                  </span>
                </div>
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
