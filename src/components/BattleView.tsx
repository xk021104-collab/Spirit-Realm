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

      {/* Top Arena Header Bar */}
      <div className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 flash-top-console z-30 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs game-title-font">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>{isWild ? '野外奇遇' : '天骄对决'}</span>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline">回合制灵术对决</span>
        </div>

        {/* Center: Current Battle Weather Badge & Interactive Dropdown */}
        {(() => {
          const cfg = WEATHER_CONFIGS[weatherState.weather];
          return (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWeatherTooltip(!showWeatherTooltip)}
                className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-all cursor-pointer shadow-lg active:scale-95 ${cfg.color.badgeBg} ${cfg.color.badgeBorder} ${cfg.color.glow}`}
                title="天象系统：点击查看当前天气属性增益与法则，或切换天象测试"
              >
                {/* Weather Icon with Animation */}
                <div className="flex items-center justify-center">
                  {weatherState.weather === 'SUNNY' && (
                    <Sun className="w-4 h-4 text-amber-400 animate-[spin_8s_linear_infinite]" />
                  )}
                  {weatherState.weather === 'RAIN' && (
                    <CloudRain className="w-4 h-4 text-cyan-400 animate-bounce" />
                  )}
                  {weatherState.weather === 'SANDSTORM' && (
                    <Wind className="w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                  {weatherState.weather === 'THUNDER' && (
                    <Zap className="w-4 h-4 text-purple-400 animate-pulse fill-purple-400/40" />
                  )}
                  {weatherState.weather === 'CLEAR' && (
                    <SunDim className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black game-title-font">
                  <span className={cfg.color.textColor}>{cfg.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/70 text-slate-300 border border-white/20">
                    {weatherState.weather === 'CLEAR' ? '常态' : `余${weatherState.turnsLeft}回合`}
                  </span>
                </div>

                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
              </button>

              {/* Weather Details Tooltip Modal Popover */}
              {showWeatherTooltip && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-11 left-1/2 -translate-x-1/2 z-50 w-80 celestial-glass rounded-2xl p-4 shadow-2xl border border-cyan-500/30 text-xs animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-cyan-200 text-sm">
                        天象法则 · {cfg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      [{cfg.subName}]
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
                    {cfg.description}
                  </p>

                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800 space-y-1.5 mb-3">
                    <span className="text-[10px] font-bold text-cyan-400 block mb-1">
                      ✦ 当前天气属性修正：
                    </span>
                    {cfg.buffs.map((buff, idx) => (
                      <div key={idx} className="text-[11px] text-slate-200 flex items-start gap-1">
                        <span>•</span>
                        <span>{buff}</span>
                      </div>
                    ))}
                  </div>

                  {/* Manual Weather Summon Testing Panel */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">
                      引动天象测试：
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['SUNNY', 'RAIN', 'SANDSTORM', 'THUNDER', 'CLEAR'] as BattleWeather[]).map((wKey) => {
                        const isCurrent = weatherState.weather === wKey;
                        const wInfo = WEATHER_CONFIGS[wKey];
                        return (
                          <button
                            key={wKey}
                            type="button"
                            onClick={() => handleSetWeather(wKey)}
                            className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold'
                                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                            title={`切换为【${wInfo.name}】`}
                          >
                            <span className="text-[11px] block">{wInfo.name.slice(0, 2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
          <span className="text-amber-300 font-bold hidden sm:inline">
            {activePet.nickname} (Lv.{activePet.level})
          </span>
          <span className="text-slate-600 hidden sm:inline">VS</span>
          <span className="text-cyan-300 font-bold">
            {enemySpecies.name} (Lv.{enemy.level})
          </span>
        </div>
      </div>

      {/* Main Battle Stage Arena (Authentic Dual Elemental Platforms) */}
      <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Weather Particle & Light Rays Overlay */}
        <WeatherOverlay weather={weatherState.weather} />

        {/* Subtle Arcane Arena Floor Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
          <div className="w-[520px] h-[520px] rounded-full border-4 border-amber-400 border-dashed animate-[spin_50s_linear_infinite]" />
        </div>

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

        {/* 1. Enemy Pet Zone (Top-Right Platform) */}
        <div className="flex items-center justify-end gap-6 relative z-10">
          {/* Enemy HUD Card */}
          <div className="celestial-battle-card rounded-2xl p-4 shadow-2xl min-w-[260px] border border-cyan-500/30">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-bold text-white text-base tracking-wide">{enemySpecies.name}</span>
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-500/30 shadow-inner">
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

            {/* Enemy HP Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>气血 (HP)</span>
                <span className="font-medium">
                  {enemy.currentHp} / {enemy.stats.hp}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    enemy.currentHp / enemy.stats.hp > 0.5
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : enemy.currentHp / enemy.stats.hp > 0.2
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${Math.max(0, (enemy.currentHp / enemy.stats.hp) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Enemy Pet Avatar on Floating Arcane Pod */}
          <div className="relative flex flex-col items-center">
            {catchingState?.active ? (
              <div className="w-28 h-28 flex flex-col items-center justify-center animate-pulse">
                {/* 3D-styled Catching Crystal */}
                <div
                  className={`w-14 h-14 rounded-2xl rotate-45 border-2 border-white shadow-[0_0_25px_rgba(250,204,21,0.8)] flex items-center justify-center transition-transform ${
                    catchingState.shakeCount % 2 === 1 ? 'rotate-12 scale-110' : '-rotate-12 scale-95'
                  } ${
                    catchingState.ballId === 'gulu_king'
                      ? 'bg-gradient-to-br from-amber-300 via-purple-600 to-amber-500'
                      : catchingState.ballId === 'gulu_high'
                      ? 'bg-gradient-to-br from-purple-400 to-indigo-700'
                      : catchingState.ballId === 'gulu_mid'
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-700'
                      : 'bg-gradient-to-br from-rose-400 to-red-600'
                  }`}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-amber-300 font-bold mt-3 whitespace-nowrap bg-black/80 px-2.5 py-0.5 rounded-full border border-amber-400">
                  {catchingState.message}
                </span>
              </div>
            ) : (
              <>
                <PetAvatar
                  speciesId={enemy.speciesId}
                  size={125}
                  isAttacking={enemyAttacking}
                  isHit={enemyHit}
                  className="transition-transform duration-200"
                />
                {/* Glowing Elemental Battle Dais (敌方对战法阵底盘) */}
                <div className="relative w-36 h-9 -mt-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400 bg-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse" />
                  <div className="absolute w-24 h-5 rounded-full border border-yellow-300 opacity-60" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2. Player Pet Zone (Bottom-Left Platform) */}
        <div className="flex items-center justify-start gap-6 relative z-10 mt-6">
          {/* Player Pet Avatar on Stage Pod */}
          <div className="relative flex flex-col items-center">
            <PetAvatar
              speciesId={activePet.speciesId}
              size={140}
              isFlipped={true}
              isAttacking={playerAttacking}
              isHit={playerHit}
              className="transition-transform duration-200"
            />
            {/* Glowing Elemental Battle Dais (我方对战召唤法阵底盘) */}
            <div className="relative w-44 h-11 -mt-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 bg-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.7)] animate-pulse" />
              <div className="absolute w-28 h-6 rounded-full border border-sky-300 opacity-70" />
            </div>
          </div>

          {/* Player HUD Card */}
          <div className="celestial-battle-card rounded-2xl p-4 shadow-2xl min-w-[280px] border border-cyan-500/30">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-bold text-white text-base tracking-wide">{activePet.nickname}</span>
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-500/30 shadow-inner">
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

            {/* Player HP Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>气血 (HP)</span>
                <span className="font-medium text-white">
                  {activePet.currentHp} / {activePet.stats.hp}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activePet.currentHp / activePet.stats.hp > 0.5
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : activePet.currentHp / activePet.stats.hp > 0.2
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${Math.max(0, (activePet.currentHp / activePet.stats.hp) * 100)}%` }}
                />
              </div>
            </div>

            {/* EXP Bar */}
            <div className="mt-2 space-y-0.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>修为经验 (EXP)</span>
                <span>
                  {activePet.exp} / {activePet.maxExp}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (activePet.exp / activePet.maxExp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Command Console */}
      <div className="bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/25 p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 z-20 shadow-2xl">
        {/* Left: Battle Announcer Text Log */}
        <div className="md:col-span-5 celestial-glass rounded-2xl p-3 flex flex-col justify-between h-[132px] border border-cyan-500/20">
          <div className="text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>战场即时法则播报</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Attack */}
              <button
                disabled={isProcessingTurn || activePet.currentHp <= 0}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('MOVES');
                }}
                className="p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold transition-all disabled:opacity-40"
              >
                <Swords className="w-5 h-5 mb-1" />
                <span className="text-xs sm:text-sm font-bold">灵术决斗</span>
              </button>

              {/* 2. Catch */}
              <button
                disabled={isProcessingTurn || !isWild}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('BALLS');
                }}
                className="p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold transition-all disabled:opacity-40"
              >
                <CircleDot className="w-5 h-5 mb-1" />
                <span className="text-xs sm:text-sm font-bold">灵契收服</span>
              </button>

              {/* 3. Potions */}
              <button
                disabled={isProcessingTurn}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('POTIONS');
                }}
                className="p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition-all disabled:opacity-40"
              >
                <Backpack className="w-5 h-5 mb-1" />
                <span className="text-xs sm:text-sm font-bold">储物灵药</span>
              </button>

              {/* 4. Switch */}
              <button
                disabled={isProcessingTurn}
                onClick={() => {
                  sound.playClick();
                  setBattleMenu('SWITCH');
                }}
                className="p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold transition-all disabled:opacity-40"
              >
                <ArrowRightLeft className="w-5 h-5 mb-1" />
                <span className="text-xs sm:text-sm font-bold">唤回轮换</span>
              </button>

              {isWild && (
                <div className="col-span-2 sm:col-span-4 flex justify-end pt-1">
                  <button
                    disabled={isProcessingTurn}
                    onClick={handleFlee}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer transition-colors"
                  >
                    避战撤退 (逃离本场对决)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Moves Selection (4 Colorful Move Tiles) */}
          {battleMenu === 'MOVES' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-amber-300 game-title-font">选择释放的灵术神技:</span>
                <button
                  onClick={() => setBattleMenu('ACTIONS')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
                >
                  返回指令菜单
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {activePet.moves.map((m) => {
                  const moveData = MOVES_DATA[m.id];
                  if (!moveData) return null;
                  const elColor = ELEMENT_COLORS[moveData.type];
                  return (
                    <button
                      key={m.id}
                      disabled={isProcessingTurn || m.pp <= 0}
                      onClick={() => handleSelectMove(m.id)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer disabled:opacity-40 bg-slate-900/90 hover:bg-slate-800 shadow-md ${elColor.border}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-black text-sm text-white game-title-font truncate">{moveData.name}</span>
                          {/* Weather Synergy Badge */}
                          {(() => {
                            if (weatherState.weather === 'SUNNY') {
                              if (moveData.type === 'FIRE') return <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-400 font-bold">☀️+50%</span>;
                              if (moveData.type === 'WATER') return <span className="text-[9px] px-1 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-600/40 font-bold">☀️-30%</span>;
                            } else if (weatherState.weather === 'RAIN') {
                              if (moveData.type === 'WATER') return <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-400 font-bold">🌧️+50%</span>;
                              if (moveData.type === 'FIRE') return <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-600/40 font-bold">🌧️-30%</span>;
                              if (moveData.type === 'ELECTRIC') return <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-300 border border-purple-400 font-bold">⚡必暴</span>;
                            } else if (weatherState.weather === 'SANDSTORM') {
                              if (moveData.type === 'ROCK') return <span className="text-[9px] px-1 py-0.2 rounded bg-yellow-500/30 text-yellow-300 border border-yellow-400 font-bold">🌪️+30%</span>;
                            } else if (weatherState.weather === 'THUNDER') {
                              if (moveData.type === 'ELECTRIC') return <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-300 border border-purple-400 font-bold">⚡+40%</span>;
                            }
                            return null;
                          })()}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${elColor.bg} ${elColor.text}`}>
                          {elColor.label}系
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>威力 {moveData.power || '-'}</span>
                        <span className={m.pp <= 3 ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
                          PP: {m.pp}/{m.maxPp}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spirit Crystal Selection */}
          {battleMenu === 'BALLS' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-amber-300 game-title-font">选择祭出的灵契晶石:</span>
                <button
                  onClick={() => setBattleMenu('ACTIONS')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
                >
                  返回指令菜单
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {inventory
                  .filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL')
                  .map((slot) => {
                    const item = ITEMS_DATA[slot.itemId];
                    return (
                      <button
                        key={slot.itemId}
                        disabled={isProcessingTurn || slot.count <= 0}
                        onClick={() => handleThrowBall(slot.itemId)}
                        className="text-left p-3 rounded-2xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between shadow-md"
                      >
                        <div>
                          <div className="font-bold text-sm text-amber-200 game-title-font">{item.name}</div>
                          <div className="text-[11px] text-slate-400">{item.description}</div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/60 text-amber-300 border border-amber-400/40">
                          x{slot.count}
                        </span>
                      </button>
                    );
                  })}
              </div>
              {inventory.filter((i) => ITEMS_DATA[i.itemId]?.category === 'BALL').length === 0 && (
                <div className="text-xs text-slate-400 text-center py-4">储物袋中已无灵契晶石，请前往万象宝阁购买！</div>
              )}
            </div>
          )}

          {/* Potions Selection */}
          {battleMenu === 'POTIONS' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-emerald-300 game-title-font">选择服用的回春丹药:</span>
                <button
                  onClick={() => setBattleMenu('ACTIONS')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
                >
                  返回指令菜单
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {inventory
                  .filter((i) => ['POTION', 'PP', 'REVIVE'].includes(ITEMS_DATA[i.itemId]?.category))
                  .map((slot) => {
                    const item = ITEMS_DATA[slot.itemId];
                    return (
                      <button
                        key={slot.itemId}
                        disabled={isProcessingTurn || slot.count <= 0}
                        onClick={() => handleUsePotion(slot.itemId)}
                        className="text-left p-3 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between shadow-md"
                      >
                        <div>
                          <div className="font-bold text-sm text-emerald-200 game-title-font">{item.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{item.description}</div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/60 text-emerald-300 border border-emerald-400/40">
                          x{slot.count}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Switch Pet Selection */}
          {battleMenu === 'SWITCH' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-cyan-300 game-title-font">选择换上场的随行幻灵:</span>
                {activePet.currentHp > 0 && (
                  <button
                    onClick={() => setBattleMenu('ACTIONS')}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
                  >
                    取消更换
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {party.map((p, idx) => {
                  const isDead = p.currentHp <= 0;
                  const isCurrent = idx === activePetIndex;
                  return (
                    <button
                      key={p.uid}
                      disabled={isDead || isCurrent}
                      onClick={() => handleSwitchPet(idx)}
                      className={`p-2.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg'
                          : isDead
                          ? 'bg-slate-900/40 border-slate-800 opacity-40 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-700 hover:border-cyan-400 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PetAvatar speciesId={p.speciesId} size={38} />
                        <div className="truncate">
                          <div className="font-bold text-xs text-white truncate game-title-font">{p.nickname}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Lv.{p.level}</div>
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
