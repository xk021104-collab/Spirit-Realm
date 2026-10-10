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
  X,
} from 'lucide-react';
import { IconGuluBall, IconRocoCoin, IconMagicPotion } from './GameIcons';

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

  const [battleLog, setBattleLog] = useState<string[]>(['★ 战斗开始！双方宠物已就位！']);
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
    logMessage(`【天象变幻】小魔法师引动天象异变，战场转为【${cfg.name}】！`);
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
          logMessage(`${currentP.nickname} 精力耗尽倒下了！`);
          const hasAlive = updatedParty.some((p) => p.currentHp > 0);
          if (!hasAlive) {
            logMessage('所有随行宠物均已脱力！本次战斗失败。');
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
          logMessage(`对方 ${enemySpecies.name} 精力耗尽倒下了！`);
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
      logMessage('此招式魔力 (PP) 已耗尽，请施展其他技能！');
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
    logMessage(`【我方】${attacker.nickname} 汇聚魔力施展【${move.name}】！`);
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
        logMessage(`【治愈之光】圣光充盈，${attacker.nickname} 回复了 ${healAmt} 点精力！`);
        return false;
      }
      logMessage(`辅助技能【${move.name}】生效了！`);
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
      logMessage(`对方 ${enemySpecies.name} 精力耗尽倒下了！`);
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
      logMessage(`${currentActivePet.nickname} 精力耗尽倒下了！`);
      const hasAlivePet = updatedPartyHp.some((p) => p.currentHp > 0);
      if (!hasAlivePet) {
        logMessage('所有随行宠物均已脱力！本次对决失败...');
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
      logMessage('咕噜球数量不足！');
      return;
    }

    const updatedInv = inventory
      .map((i) => (i.itemId === ballId ? { ...i, count: i.count - 1 } : i))
      .filter((i) => i.count > 0);
    setInventory(updatedInv);

    setIsProcessingTurn(true);
    setBattleMenu('ACTIONS');

    sound.playBallThrow();
    logMessage(`投掷出【${item.name}】，划破长空飞向目标！`);

    setCatchingState({
      active: true,
      ballId,
      shakeCount: 0,
      message: '咕噜球抛出，魔法光芒笼罩目标...',
    });

    const { success, shakes } = calculateCatchRate(enemy, item.catchMultiplier || 1, item.isGuaranteed);

    for (let s = 1; s <= shakes; s++) {
      await new Promise((r) => setTimeout(r, 700));
      sound.playBallShake();
      setCatchingState((prev) => (prev ? { ...prev, shakeCount: s, message: `咕噜球晃动中... (${s}/3)` } : null));
    }

    await new Promise((r) => setTimeout(r, 600));

    if (success) {
      sound.playCatchSuccess();
      setCatchingState((prev) => (prev ? { ...prev, message: `★ 捕捉成功！成功收服【${enemySpecies.name}】！` } : null));
      logMessage(`太棒了！成功使用咕噜球捕获了野生 ${enemySpecies.name}！`);

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
      setCatchingState((prev) => (prev ? { ...prev, message: `哎呀！野生 ${enemySpecies.name} 挣脱了咕噜球！` } : null));
      logMessage(`捕捉失败！野生 ${enemySpecies.name} 挣脱了束缚！`);

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
      logMessage('该宠物尚未脱力，无需使用复活药剂！');
      return;
    }
    if (!potion.isRevive && activePet.currentHp <= 0) {
      logMessage('脱力宠物需使用复活药剂！');
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
      logMessage(`${activePet.nickname} 服用魔药，恢复了精力！`);
    } else if (potion.healPp) {
      updatedPet.moves = activePet.moves.map((m) => ({
        ...m,
        pp: Math.min(m.maxPp, m.pp + (potion.healPp || 10)),
      }));
      sound.playHeal();
      logMessage(`${activePet.nickname} 技能 (PP) 恢复了！`);
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
    logMessage(`召回 ${activePet.nickname}，换上出战宠物 ${party[index].nickname}！`);
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
        {/* Left: 洛克王国 ROCO KINGDOM Logo with Vermilion Seal */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="roco-title-font text-2xl sm:text-3xl roco-gold-text tracking-wide drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
                星灵王国
              </span>
              <span className="roco-seal text-[10px] px-1.5 py-0.5 font-bold tracking-wider">
                王国
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-amber-300/85 font-mono font-bold -mt-0.5">
              — ROCO KINGDOM —
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
            title="打开魔法背包与药剂"
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
            DUELISTS ARENA STAGE (Roco Kingdom Classic Duel Layout)
            ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center flex-1 my-auto">
          {/* 1. LEFT: Player Spirit Status & Avatar */}
          <div className="flex flex-col items-start space-y-2">
            {/* Player Status Plaque (Frosted Glass with Antique Gold Borders & 6 Party Dots) */}
            <div className="roco-panel p-2.5 sm:p-3 min-w-[280px] max-w-[340px] select-none flex items-center gap-2.5 shadow-2xl">
              {/* Left Elemental Badge */}
              <div className={`w-10 h-10 rounded-full border-2 border-[#d4af37] bg-gradient-to-br ${
                activeSpecies.type === 'FIRE' ? 'from-rose-600 to-amber-600' :
                activeSpecies.type === 'WATER' ? 'from-blue-600 to-cyan-600' :
                activeSpecies.type === 'GRASS' ? 'from-emerald-600 to-teal-800' :
                activeSpecies.type === 'ELECTRIC' ? 'from-amber-500 to-yellow-600' :
                activeSpecies.type === 'ICE' ? 'from-sky-500 to-cyan-700' :
                activeSpecies.type === 'ROCK' ? 'from-stone-600 to-amber-800' : 'from-slate-600 to-slate-800'
              } flex items-center justify-center text-white shadow-md shrink-0`}>
                <span className="roco-title-font font-black text-sm text-yellow-100 drop-shadow">
                  {ELEMENT_COLORS[activeSpecies.type]?.label || '凡'}
                </span>
              </div>

              {/* Center Name, Gauges & 6 Party Indicators */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="roco-title-font font-bold text-sm text-slate-100 tracking-wide truncate">
                    {activePet.nickname || activeSpecies.name}
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
                      style={{
                        width: `${Math.max(0, Math.min(100, (activePet.currentHp / activePet.stats.hp) * 100))}%`,
                        background:
                          activePet.currentHp / activePet.stats.hp > 0.5
                            ? 'linear-gradient(180deg, #4ade80 0%, #22c55e 45%, #16a34a 75%, #14532d 100%)'
                            : activePet.currentHp / activePet.stats.hp > 0.2
                            ? 'linear-gradient(180deg, #fde047 0%, #f59e0b 45%, #d97706 75%, #78350f 100%)'
                            : 'linear-gradient(180deg, #f87171 0%, #ef4444 45%, #dc2626 75%, #991b1b 100%)',
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-300 shrink-0 font-bold">
                    {activePet.currentHp}/{activePet.stats.hp}
                  </span>
                </div>

                {/* MP Gauge */}
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-cyan-400 font-black tracking-wider shrink-0">MP</span>
                  <div className="roco-gauge-track flex-1 h-2.5">
                    <div className="roco-gauge-mp" style={{ width: '100%' }} />
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0 font-bold">
                    100/100
                  </span>
                </div>

                {/* 6 Party Companion Orbs (洛克王国标志性6宠指示灯) */}
                <div className="flex items-center gap-1 pt-0.5 pointer-events-none">
                  {party.map((p, idx) => (
                    <div
                      key={p.uid}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        idx === activePetIndex
                          ? 'bg-yellow-300 border-amber-400 shadow-[0_0_6px_#facc15] scale-110'
                          : p.currentHp > 0
                          ? 'bg-emerald-400 border-emerald-600 shadow-[0_0_3px_#34d399]'
                          : 'bg-rose-900 border-slate-700 opacity-50'
                      }`}
                      title={`${p.nickname} (Lv.${p.level})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Player Spirit Sprite & Magic Ground Ring */}
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

              {/* Floating Elemental Badge Beside Player Pet */}
              <div className="flex flex-col items-center mb-6 ml-3 pointer-events-none">
                <div className={`roco-element-badge bg-gradient-to-br ${
                  activeSpecies.type === 'FIRE' ? 'from-rose-600 to-amber-600' :
                  activeSpecies.type === 'WATER' ? 'from-blue-600 to-cyan-600' :
                  activeSpecies.type === 'GRASS' ? 'from-emerald-600 to-teal-800' :
                  activeSpecies.type === 'ELECTRIC' ? 'from-amber-500 to-yellow-600' : 'from-slate-600 to-slate-800'
                } text-white shadow-[0_0_16px_rgba(56,189,248,0.7)]`}>
                  <span className="roco-title-font font-black text-sm text-yellow-100">
                    {ELEMENT_COLORS[activeSpecies.type]?.label || '凡'}
                  </span>
                </div>
                <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest mt-1 roco-title-font drop-shadow-md">
                  {activeSpecies.type}
                </span>
              </div>
            </div>
          </div>

          {/* 2. RIGHT: Enemy Spirit Status & Avatar */}
          <div className="flex flex-col items-end space-y-2">
            {/* Enemy Status Plaque (Frosted Glass with Antique Gold Borders & Party Dots) */}
            <div className="roco-panel p-2.5 sm:p-3 min-w-[280px] max-w-[340px] select-none flex items-center gap-2.5 shadow-2xl">
              {/* Left/Center Name & Gauges */}
              <div className="flex-1 min-w-0 space-y-1 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 font-bold shrink-0">
                    Lv.{enemy.level}
                  </span>
                  <span className="roco-title-font font-bold text-sm text-slate-100 tracking-wide truncate">
                    {enemy.nickname || enemySpecies.name}
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
                      style={{
                        width: `${Math.max(0, Math.min(100, (enemy.currentHp / enemy.stats.hp) * 100))}%`,
                        background:
                          enemy.currentHp / enemy.stats.hp > 0.5
                            ? 'linear-gradient(180deg, #4ade80 0%, #22c55e 45%, #16a34a 75%, #14532d 100%)'
                            : enemy.currentHp / enemy.stats.hp > 0.2
                            ? 'linear-gradient(180deg, #fde047 0%, #f59e0b 45%, #d97706 75%, #78350f 100%)'
                            : 'linear-gradient(180deg, #f87171 0%, #ef4444 45%, #dc2626 75%, #991b1b 100%)',
                      }}
                    />
                  </div>
                  <span className="text-rose-400 font-black tracking-wider shrink-0">HP</span>
                </div>

                {/* MP Gauge */}
                <div className="flex items-center gap-2 text-[10px] font-mono justify-end">
                  <span className="text-[9px] text-slate-400 shrink-0 font-bold">
                    100/100
                  </span>
                  <div className="roco-gauge-track flex-1 h-2.5">
                    <div className="roco-gauge-mp" style={{ width: '100%' }} />
                  </div>
                  <span className="text-cyan-400 font-black tracking-wider shrink-0">MP</span>
                </div>

                {/* Enemy Party Indicators */}
                <div className="flex items-center justify-end gap-1 pt-0.5 pointer-events-none">
                  <div
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      enemy.currentHp > 0
                        ? 'bg-rose-500 border-amber-400 shadow-[0_0_6px_#f43f5e]'
                        : 'bg-slate-800 border-slate-700 opacity-50'
                    }`}
                  />
                  {!isWild && (
                    <>
                      <div className="w-2.5 h-2.5 rounded-full border bg-emerald-400 border-emerald-600" />
                      <div className="w-2.5 h-2.5 rounded-full border bg-emerald-400 border-emerald-600" />
                    </>
                  )}
                </div>
              </div>

              {/* Right Elemental Badge */}
              <div className={`w-10 h-10 rounded-full border-2 border-[#d4af37] bg-gradient-to-br ${
                enemySpecies.type === 'FIRE' ? 'from-rose-600 to-amber-600' :
                enemySpecies.type === 'WATER' ? 'from-blue-600 to-cyan-600' :
                enemySpecies.type === 'GRASS' ? 'from-emerald-600 to-teal-800' :
                enemySpecies.type === 'ELECTRIC' ? 'from-amber-500 to-yellow-600' : 'from-slate-600 to-slate-800'
              } flex items-center justify-center text-white shadow-md shrink-0`}>
                <span className="roco-title-font font-black text-sm text-yellow-100 drop-shadow">
                  {ELEMENT_COLORS[enemySpecies.type]?.label || '凡'}
                </span>
              </div>
            </div>

            {/* Enemy Spirit Sprite & Fiery Ring */}
            <div className="relative flex items-center mr-2 sm:mr-4 mt-2">
              {/* Floating FIRE Elemental Badge Beside Enemy */}
              <div className="flex flex-col items-center mb-6 mr-3 pointer-events-none">
                <div className={`roco-element-badge bg-gradient-to-br ${
                  enemySpecies.type === 'FIRE' ? 'from-rose-600 to-amber-600' :
                  enemySpecies.type === 'WATER' ? 'from-blue-600 to-cyan-600' :
                  enemySpecies.type === 'GRASS' ? 'from-emerald-600 to-teal-800' : 'from-slate-600 to-slate-800'
                } text-white shadow-[0_0_16px_rgba(249,115,22,0.7)]`}>
                  <span className="roco-title-font font-black text-sm text-yellow-100">
                    {ELEMENT_COLORS[enemySpecies.type]?.label || '凡'}
                  </span>
                </div>
                <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest mt-1 roco-title-font drop-shadow-md">
                  {enemySpecies.type}
                </span>
              </div>

              {/* Enemy Pet Sprite */}
              <div className="relative flex flex-col items-center">
                <PetAvatar
                  speciesId={enemy.speciesId}
                  size={180}
                  isAttacking={enemyAttacking}
                  isHit={enemyHit}
                  className="transition-transform duration-200 drop-shadow-[0_12px_32px_rgba(249,115,22,0.65)]"
                />
                {/* Ember Ground Ring */}
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
          BOTTOM COMMAND CONSOLE: Battle Directory, 5 Commands & 4 Skill Plates (Roco Kingdom Classic)
          ========================================================================= */}
      <div className="relative bg-gradient-to-t from-[#020813] via-[#051120] to-[#081a2e]/95 border-t-2 border-[#b8860b]/40 p-3 sm:p-4 flex flex-col lg:flex-row items-center justify-between gap-3 z-20 shadow-2xl backdrop-blur-xl">
        {/* Left: 战斗目录 (Battle Directory & Logs) */}
        <div className="roco-log-box w-full lg:w-72 p-2.5 text-xs flex flex-col justify-between h-28 select-none shadow-xl shrink-0">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-1 mb-1">
            <span className="roco-title-font font-bold text-amber-300 flex items-center gap-1.5 tracking-wider text-xs">
              <span className="text-amber-400 text-sm">◇</span>
              <span>对决战报</span>
            </span>
            <span className="text-[9px] text-cyan-300/80 font-mono">
              回合 {isProcessingTurn ? (playerAttacking ? '施法中' : '交锋中') : '待命'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 text-[11px] pr-1 leading-relaxed text-slate-300">
            {battleLog.slice(0, 3).map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-amber-200 font-bold' : 'text-slate-400'}>
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Center: 5 Classic Action Command Buttons (洛克王国对战5大指令) */}
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          {/* 1. 灵术招式 */}
          <button
            onClick={() => {
              sound.playClick();
              setBattleMenu('ACTIONS');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font shadow-md ${
              battleMenu === 'ACTIONS'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-yellow-200 scale-105'
                : 'bg-[#0a1f36]/80 hover:bg-[#0e2a4a] text-amber-200 border border-[#b8860b]/40'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>魔法技能</span>
          </button>

          {/* 2. 咕噜球 (Capture) */}
          <button
            onClick={() => {
              sound.playClick();
              setBattleMenu(battleMenu === 'BALLS' ? 'ACTIONS' : 'BALLS');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font shadow-md ${
              battleMenu === 'BALLS'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-300 scale-105'
                : 'bg-[#0a1f36]/80 hover:bg-[#0e2a4a] text-cyan-300 border border-cyan-500/40'
            }`}
          >
            <IconGuluBall size={18} />
            <span>咕噜球</span>
          </button>

          {/* 3. 恢复药剂 (Potions) */}
          <button
            onClick={() => {
              sound.playClick();
              setBattleMenu(battleMenu === 'POTIONS' ? 'ACTIONS' : 'POTIONS');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font shadow-md ${
              battleMenu === 'POTIONS'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border border-emerald-300 scale-105'
                : 'bg-[#0a1f36]/80 hover:bg-[#0e2a4a] text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <IconMagicPotion size={18} />
            <span>魔法药剂</span>
          </button>

          {/* 4. 召唤换宠 (Switch Pet) */}
          <button
            onClick={() => {
              sound.playClick();
              setBattleMenu(battleMenu === 'SWITCH' ? 'ACTIONS' : 'SWITCH');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font shadow-md ${
              battleMenu === 'SWITCH'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border border-purple-300 scale-105'
                : 'bg-[#0a1f36]/80 hover:bg-[#0e2a4a] text-purple-300 border border-purple-500/40'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>唤回换宠</span>
          </button>

          {/* 5. 遁走逃跑 (Flee) */}
          <button
            disabled={isProcessingTurn}
            onClick={handleFlee}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-all cursor-pointer flex items-center gap-1.5 roco-title-font disabled:opacity-40"
          >
            <span>逃跑</span>
          </button>
        </div>

        {/* Right: 4 Dynamic Skill Cards (4大灵术招式面板) */}
        <div className="w-full lg:w-auto grid grid-cols-2 gap-2 select-none">
          {movesToDisplay.map((move, slotIdx) => {
            const moveDef = MOVES_DATA[move.id] || {
              id: move.id,
              name: move.id,
              type: 'NORMAL' as const,
              power: 50,
              accuracy: 100,
              category: 'PHYSICAL' as const,
              maxPp: 20,
              description: '基础神通攻击',
            };
            const elColor = ELEMENT_COLORS[moveDef.type as keyof typeof ELEMENT_COLORS] || ELEMENT_COLORS.NORMAL;
            const isPpDepleted = move.pp <= 0;
            const isDisabled = isProcessingTurn || isPpDepleted;

            return (
              <button
                key={`${move.id}_${slotIdx}`}
                disabled={isDisabled}
                onClick={() => handleSelectMove(move.id)}
                title={`${moveDef.name} (${moveDef.category === 'PHYSICAL' ? '物理' : moveDef.category === 'SPECIAL' ? '魔法' : '变化'}) - 威力:${moveDef.power || '-'} | PP:${move.pp}/${move.maxPp}\n${moveDef.description || ''}`}
                className={`roco-skill-card w-full sm:w-44 p-2 text-left bg-gradient-to-br transition-all flex flex-col justify-between ${
                  moveDef.type === 'FIRE'
                    ? 'from-rose-950/90 via-orange-950/80 to-amber-950/90 border-rose-500/70 hover:border-amber-300'
                    : moveDef.type === 'WATER'
                    ? 'from-blue-950/90 via-cyan-950/80 to-teal-950/90 border-cyan-500/70 hover:border-cyan-300'
                    : moveDef.type === 'GRASS'
                    ? 'from-emerald-950/90 via-teal-950/80 to-green-950/90 border-emerald-500/70 hover:border-emerald-300'
                    : moveDef.type === 'ELECTRIC'
                    ? 'from-amber-950/90 via-yellow-950/80 to-amber-950/90 border-amber-500/70 hover:border-yellow-300'
                    : 'from-slate-900/90 via-slate-800/80 to-slate-900/90 border-slate-500/70 hover:border-slate-300'
                }`}
              >
                {/* Header: Skill Name & Element Badge */}
                <div className="flex items-center justify-between gap-1">
                  <span className="roco-title-font font-black text-xs text-white tracking-wide truncate">
                    {moveDef.name}
                  </span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-black shrink-0 ${elColor.bg} ${elColor.text} border border-amber-400/40`}>
                    {elColor.label}
                  </span>
                </div>

                {/* Footer: Power & PP Counter with Progress Bar */}
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                    <span className="text-amber-300 font-bold">
                      {moveDef.power ? `威力 ${moveDef.power}` : '变化技'}
                    </span>
                    <span className={isPpDepleted ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      PP {move.pp}/{move.maxPp}
                    </span>
                  </div>

                  {/* PP Mini Bar */}
                  <div className="w-full roco-gauge-track h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(0, Math.min(100, (move.pp / move.maxPp) * 100))}%`,
                        background:
                          move.pp / move.maxPp > 0.4
                            ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
                            : 'linear-gradient(90deg, #f87171, #ef4444)',
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drawer Overlay for BALLS, POTIONS, SWITCH, or MOVES */}
      {battleMenu !== 'ACTIONS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0f243a] via-[#091829] to-[#040e1b] rounded-3xl border-2 border-[#b8860b]/60 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-4 text-slate-100">
            {/* Corner Gilded Ornaments */}
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <div className="corner-ornament-bl" />
            <div className="corner-ornament-br" />

            <div className="flex items-center justify-between border-b border-[#b8860b]/40 pb-3">
              <span className="text-base font-black text-amber-300 roco-title-font flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  {battleMenu === 'MOVES'
                    ? '魔法技能 · 选择施展技能'
                    : battleMenu === 'BALLS'
                    ? '咕噜球 · 投掷收服野生宠物'
                    : battleMenu === 'POTIONS'
                    ? '魔法药剂 · 回复精力与招式PP'
                    : '随行战队 · 唤回轮换出战宠物'}
                </span>
              </span>

              <button
                onClick={() => setBattleMenu('ACTIONS')}
                className="roco-close-btn shrink-0"
                title="返回战斗"
              >
                <X className="w-5 h-5" />
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
                          className="text-left p-3.5 rounded-2xl roco-panel border border-[#b8860b]/40 hover:border-amber-400 hover:bg-[#061426] transition-all cursor-pointer flex items-center justify-between shadow-md group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-amber-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconGuluBall size={34} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-white roco-title-font truncate">{item.name}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/70 text-amber-300 border border-amber-400/50 shrink-0 ml-2">
                            x{slot.count}
                          </span>
                        </button>
                      );
                    })}
                </div>
                {inventory.filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL').length === 0 && (
                  <div className="text-xs text-slate-400 text-center py-6">
                    背包中已无咕噜球，请前往跳跳集市罗伦斯道具店购买！
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
                          className="text-left p-3.5 rounded-2xl roco-panel border border-emerald-500/40 hover:border-emerald-400 hover:bg-[#061426] transition-all cursor-pointer flex items-center justify-between shadow-md group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <IconMagicPotion size={34} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-white roco-title-font truncate">{item.name}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/70 text-emerald-300 border border-emerald-400/50 shrink-0 ml-2">
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
                          ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-lg'
                          : isDead
                          ? 'bg-slate-900/40 border-slate-800 opacity-40 cursor-not-allowed'
                          : 'roco-panel border-[#b8860b]/30 hover:border-amber-400 hover:bg-[#061426]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PetAvatar speciesId={p.speciesId} size={42} />
                        <div className="truncate">
                          <div className="font-bold text-xs text-white truncate roco-title-font">{p.nickname}</div>
                          <div className="text-[10px] text-amber-300 font-mono">Lv.{p.level}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1.5 font-mono">
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
              <h2 className="text-3xl font-black text-amber-300 roco-title-font">对决大获全胜！</h2>
              <p className="text-slate-300 text-xs mt-1">
                恭喜小魔法师！你与出战宠物的亲密羁绊更进一步！
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950/80 rounded-2xl p-4 border border-[#b8860b]/40">
              <div className="text-left">
                <span className="text-xs text-slate-400">获得升级经验</span>
                <p className="text-xl font-bold text-cyan-300 font-mono">+{victoryData.expEarned} EXP</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">获得洛克贝</span>
                <p className="text-xl font-bold text-amber-300 font-mono flex items-center justify-end gap-1">
                  <IconRocoCoin size={20} />
                  <span>+{victoryData.coinsEarned}</span>
                </p>
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
                <p className="text-amber-300 font-black text-base mb-1 roco-title-font">✨ 奇迹觉醒 · 宠物华丽进化！</p>
                【{evo.petName}】 觉醒了魔导源核，成功进化为 【{evo.newSpeciesName}】！
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
