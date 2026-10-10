import React, { useState, useEffect } from 'react';
import { PetInstance, InventorySlot, SceneId, Quest } from './types/game';
import { SCENES_DATA } from './data/scenes';
import { INITIAL_QUESTS } from './data/quests';
import { PET_SPECIES } from './data/species';
import { ITEMS_DATA } from './data/items';
import { calculateStats } from './utils/battleEngine';
import { sound } from './utils/audio';

import { SceneView } from './components/SceneView';
import { BattleView } from './components/BattleView';
import { PokedexModal } from './components/PokedexModal';
import { PetBagModal } from './components/PetBagModal';
import { ShopModal } from './components/ShopModal';
import { PrologueIntroModal } from './components/PrologueIntroModal';
import { DailyEventsModal } from './components/DailyEventsModal';
import { PetTrainModal } from './components/PetTrainModal';
import { QuestTracker } from './components/QuestTracker';
import { FriendsModal } from './components/FriendsModal';
import { GmToolModal } from './components/GmToolModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { INITIAL_FRIENDS } from './data/friends';
import { Friend } from './types/game';

import { Sparkles, Compass, BookOpen, Backpack, ShoppingBag, ScrollText, Volume2, VolumeX, Gift, Zap, Users, Wrench, Shield } from 'lucide-react';

const STORAGE_KEY = 'huanling_mijing_save_v1';

export default function App() {
  // Game Loaded state
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Core Player State
  const [playerName, setPlayerName] = useState<string>('云游灵契师');
  const [playerCoins, setPlayerCoins] = useState<number>(1000);
  const [playerBadges, setPlayerBadges] = useState<string[]>([]);
  const [party, setParty] = useState<PetInstance[]>([]);
  const [activeLeaderIndex, setActiveLeaderIndex] = useState<number>(0);
  const [inventory, setInventory] = useState<InventorySlot[]>([
    { itemId: 'gulu_normal', count: 5 },
    { itemId: 'potion_small', count: 3 },
  ]);
  const [currentSceneId, setCurrentSceneId] = useState<SceneId>('ACADEMY');
  const [openedChestIds, setOpenedChestIds] = useState<string[]>([]);

  // Pokedex State: Unlocked species IDs
  const [unlockedSpeciesIds, setUnlockedSpeciesIds] = useState<string[]>([]);
  const [claimedMilestones, setClaimedMilestones] = useState<number[]>([]);

  // Quests State
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  // Battle State
  const [activeBattle, setActiveBattle] = useState<{
    inBattle: boolean;
    enemyPet: PetInstance | null;
    isWild: boolean;
  }>({
    inBattle: false,
    enemyPet: null,
    isWild: true,
  });

  // Modal Visibility States
  const [isPrologueOpen, setIsPrologueOpen] = useState<boolean>(false);
  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(false);
  const [isPetBagOpen, setIsPetBagOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isDailyEventsOpen, setIsDailyEventsOpen] = useState<boolean>(false);
  const [isPetTrainOpen, setIsPetTrainOpen] = useState<boolean>(false);
  const [isQuestLogOpen, setIsQuestLogOpen] = useState<boolean>(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState<boolean>(false);
  const [isGmOpen, setIsGmOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || params.get('mode') === 'admin';
    }
    return false;
  });

  // Global Keyboard Listener for GM console (Backquote ~ or F8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Backquote' || e.key === '`' || e.key === '~' || e.key === 'F8') {
        e.preventDefault();
        setIsGmOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Social Friends & Spirit Shards State
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [spiritShards, setSpiritShards] = useState<number>(6);

  // Audio Toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 1. Initial Load & Persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlayerName(parsed.playerName || '云游灵契师');
        setPlayerCoins(parsed.playerCoins || 1000);
        setPlayerBadges(parsed.playerBadges || []);
        setParty(parsed.party || []);
        setActiveLeaderIndex(parsed.activeLeaderIndex || 0);
        setInventory(parsed.inventory || []);
        setCurrentSceneId(parsed.currentSceneId || 'ACADEMY');
        setOpenedChestIds(parsed.openedChestIds || []);
        setUnlockedSpeciesIds(parsed.unlockedSpeciesIds || []);
        setClaimedMilestones(parsed.claimedMilestones || []);
        if (parsed.quests && parsed.quests.length > 0) {
          setQuests(parsed.quests);
        }
        if (!parsed.party || parsed.party.length === 0) {
          setIsPrologueOpen(true);
        }
      } else {
        // First time launch -> trigger prologue ritual
        setIsPrologueOpen(true);
      }

      // Load Social Friends & Shards
      const savedFriends = localStorage.getItem('huanling_friends_data');
      const savedShards = localStorage.getItem('huanling_spirit_shards');
      const lastGiftDate = localStorage.getItem('huanling_last_gift_date');
      const todayDate = new Date().toISOString().split('T')[0];

      if (savedShards) {
        setSpiritShards(parseInt(savedShards, 10));
      }

      if (savedFriends) {
        let parsedFriends = JSON.parse(savedFriends) as Friend[];
        // Reset daily gifting flags on a new calendar day
        if (lastGiftDate !== todayDate) {
          parsedFriends = parsedFriends.map((f) => ({
            ...f,
            hasGiftedToday: false,
            canClaimFromFriend: true,
          }));
          localStorage.setItem('huanling_last_gift_date', todayDate);
        }
        setFriends(parsedFriends);
      } else {
        localStorage.setItem('huanling_last_gift_date', todayDate);
      }
    } catch {
      setIsPrologueOpen(true);
    }
    setIsLoaded(true);
  }, []);

  // Save on state updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const saveState = {
        playerName,
        playerCoins,
        playerBadges,
        party,
        activeLeaderIndex,
        inventory,
        currentSceneId,
        openedChestIds,
        unlockedSpeciesIds,
        claimedMilestones,
        quests,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch (e) {
      console.error('Save failed', e);
    }
  }, [
    isLoaded,
    playerName,
    playerCoins,
    playerBadges,
    party,
    activeLeaderIndex,
    inventory,
    currentSceneId,
    openedChestIds,
    unlockedSpeciesIds,
    claimedMilestones,
    quests,
  ]);

  // Audio mute toggle
  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // GM Savefile Handlers
  const handleImportSave = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.playerName) setPlayerName(parsed.playerName);
      if (typeof parsed.playerCoins === 'number') setPlayerCoins(parsed.playerCoins);
      if (Array.isArray(parsed.party)) setParty(parsed.party);
      if (Array.isArray(parsed.inventory)) setInventory(parsed.inventory);
      if (parsed.currentSceneId) setCurrentSceneId(parsed.currentSceneId);
      if (Array.isArray(parsed.unlockedSpeciesIds)) setUnlockedSpeciesIds(parsed.unlockedSpeciesIds);
      if (Array.isArray(parsed.quests)) setQuests(parsed.quests);
      localStorage.setItem(STORAGE_KEY, jsonStr);
      return true;
    } catch {
      return false;
    }
  };

  const handleResetSave = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('huanling_friends_data');
    localStorage.removeItem('huanling_spirit_shards');
    localStorage.removeItem('huanling_last_gift_date');
    window.location.reload();
  };

  // Helper to progress Quest
  const updateQuestProgress = (targetType: Quest['targetType'], increment = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.status === 'ACTIVE' && q.targetType === targetType) {
          const newCount = q.currentCount + increment;
          const isDone = newCount >= q.targetCount;
          return {
            ...q,
            currentCount: Math.min(q.targetCount, newCount),
            status: isDone ? 'COMPLETED' : 'ACTIVE',
          };
        }
        return q;
      })
    );
  };

  // 2. Handle Claim Quest Reward
  const handleClaimQuestReward = (questId: string) => {
    sound.playCatchSuccess();
    const qIndex = quests.findIndex((q) => q.id === questId);
    if (qIndex === -1) return;
    const targetQuest = quests[qIndex];

    // Award coins
    setPlayerCoins((prev) => prev + targetQuest.rewards.coins);

    // Award items
    if (targetQuest.rewards.items) {
      setInventory((prev) => {
        let updated = [...prev];
        targetQuest.rewards.items?.forEach((slot) => {
          const existing = updated.find((i) => i.itemId === slot.itemId);
          if (existing) {
            existing.count += slot.count;
          } else {
            updated.push({ itemId: slot.itemId, count: slot.count });
          }
        });
        return updated;
      });
    }

    // Award badge
    if (targetQuest.rewards.badge && !playerBadges.includes(targetQuest.rewards.badge)) {
      setPlayerBadges((prev) => [...prev, targetQuest.rewards.badge!]);
    }

    // Update quest status to CLAIMED and unlock next quest
    setQuests((prev) => {
      const nextQuests = [...prev];
      nextQuests[qIndex] = { ...targetQuest, status: 'CLAIMED' };
      // Unlock next
      if (qIndex + 1 < nextQuests.length && nextQuests[qIndex + 1].status === 'LOCKED') {
        nextQuests[qIndex + 1] = { ...nextQuests[qIndex + 1], status: 'ACTIVE' };
      }
      return nextQuests;
    });
  };

  // 3. Complete Opening Prologue (Starter Pact)
  const handleCompletePrologue = (starterPet: PetInstance, chosenName: string) => {
    setPlayerName(chosenName);
    setParty([starterPet]);
    setActiveLeaderIndex(0);
    // Unlock starter species in Pokedex!
    setUnlockedSpeciesIds([starterPet.speciesId]);
    setIsPrologueOpen(false);

    // Progress Quest 1
    updateQuestProgress('CHOOSE_STARTER', 1);
  };

  // 4. Battle Events
  const handleStartBattle = (enemyPet: PetInstance, isWild: boolean) => {
    // Recalculate stats for enemy
    const spec = PET_SPECIES[enemyPet.speciesId];
    if (spec) {
      const calculated = calculateStats(spec, enemyPet.level);
      enemyPet.stats = calculated;
      enemyPet.currentHp = calculated.hp;
    }
    setActiveBattle({
      inBattle: true,
      enemyPet,
      isWild,
    });
  };

  const handleBattleEnd = (result: {
    won: boolean;
    fled?: boolean;
    capturedPet?: PetInstance;
    updatedParty: PetInstance[];
    updatedInventory: InventorySlot[];
    coinsEarned: number;
    expEarned: number;
  }) => {
    setParty(result.updatedParty);
    setInventory(result.updatedInventory);
    setPlayerCoins((prev) => prev + result.coinsEarned);

    // If captured wild spirit:
    if (result.capturedPet) {
      sound.playCatchSuccess();
      // Add to party if < 6
      if (result.updatedParty.length < 6) {
        setParty([...result.updatedParty, result.capturedPet]);
      }
      // Unlock in Pokedex!
      if (!unlockedSpeciesIds.includes(result.capturedPet.speciesId)) {
        setUnlockedSpeciesIds((prev) => [...prev, result.capturedPet!.speciesId]);
      }
      // Progress Quest 3
      updateQuestProgress('CATCH_PET', 1);
    }

    // Check if won battle
    if (result.won && !result.fled) {
      if (activeBattle.isWild) {
        updateQuestProgress('WIN_WILD_BATTLE', 1);
      } else {
        // Beat Arena Boss
        updateQuestProgress('WIN_ARENA_CHALLENGE', 1);
      }
    }

    // Check if any pet reached evolution (species changed)
    result.updatedParty.forEach((p) => {
      if (!unlockedSpeciesIds.includes(p.speciesId)) {
        setUnlockedSpeciesIds((prev) => [...prev, p.speciesId]);
        updateQuestProgress('EVOLVE_PET', 1);
      }
    });

    setActiveBattle({ inBattle: false, enemyPet: null, isWild: true });
  };

  // 5. Open Scene Chest
  const handleOpenChest = (chestId: string, coins: number, itemId?: string, itemCount = 1) => {
    if (openedChestIds.includes(chestId)) return;
    setOpenedChestIds((prev) => [...prev, chestId]);
    setPlayerCoins((prev) => prev + coins);

    if (itemId) {
      setInventory((prev) => {
        const existing = prev.find((i) => i.itemId === itemId);
        if (existing) {
          return prev.map((i) => (i.itemId === itemId ? { ...i, count: i.count + itemCount } : i));
        } else {
          return [...prev, { itemId, count: itemCount }];
        }
      });
    }
  };

  // 6. Hospital Full Heal
  const handleHealParty = () => {
    setParty((prev) =>
      prev.map((pet) => ({
        ...pet,
        currentHp: pet.stats.hp,
        moves: pet.moves.map((m) => ({ ...m, pp: m.maxPp })),
        statusEffect: null,
      }))
    );
    updateQuestProgress('HEAL_PET', 1);
  };

  // 7. Shop Purchase
  const handleBuyItem = (itemId: string, count: number, totalCost: number) => {
    setPlayerCoins((prev) => Math.max(0, prev - totalCost));
    setInventory((prev) => {
      const existing = prev.find((i) => i.itemId === itemId);
      if (existing) {
        return prev.map((i) => (i.itemId === itemId ? { ...i, count: i.count + count } : i));
      } else {
        return [...prev, { itemId, count }];
      }
    });
    updateQuestProgress('BUY_SHOP_ITEM', 1);
  };

  // 8. Pokedex Milestone Reward Claim
  const handleClaimMilestoneReward = (coins: number, ballId?: string) => {
    setPlayerCoins((prev) => prev + coins);
    if (ballId) {
      setInventory((prev) => {
        const existing = prev.find((i) => i.itemId === ballId);
        if (existing) {
          return prev.map((i) => (i.itemId === ballId ? { ...i, count: i.count + 1 } : i));
        } else {
          return [...prev, { itemId: ballId, count: 1 }];
        }
      });
    }
    const currentUnlockedCount = unlockedSpeciesIds.length;
    let milestoneTarget = 3;
    if (currentUnlockedCount >= 10) milestoneTarget = 10;
    else if (currentUnlockedCount >= 6) milestoneTarget = 6;
    setClaimedMilestones((prev) => [...prev, milestoneTarget]);
  };

  // 9. Economy & Inventory helpers for Daily Events & Training
  const handleAddCoins = (amt: number) => {
    setPlayerCoins((prev) => prev + amt);
  };

  const handleAddItem = (itemId: string, count: number) => {
    setInventory((prev) => {
      const existing = prev.find((i) => i.itemId === itemId);
      if (existing) {
        return prev.map((i) => (i.itemId === itemId ? { ...i, count: i.count + count } : i));
      }
      return [...prev, { itemId, count }];
    });
  };

  const handleDeductItem = (itemId: string, count: number) => {
    setInventory((prev) =>
      prev
        .map((i) => (i.itemId === itemId ? { ...i, count: i.count - count } : i))
        .filter((i) => i.count > 0)
    );
  };

  const handleUpdatePartyPet = (updatedPet: PetInstance) => {
    setParty((prev) => prev.map((p) => (p.uid === updatedPet.uid ? updatedPet : p)));
    if (!unlockedSpeciesIds.includes(updatedPet.speciesId)) {
      setUnlockedSpeciesIds((prev) => [...prev, updatedPet.speciesId]);
    }
  };

  const handleStartBossBattle = (bossPet: PetInstance) => {
    setActiveBattle({
      inBattle: true,
      enemyPet: bossPet,
      isWild: false,
    });
  };

  // 10. Social Friends & Spirit Shard Handlers
  const saveFriends = (newFriends: Friend[]) => {
    setFriends(newFriends);
    try {
      localStorage.setItem('huanling_friends_data', JSON.stringify(newFriends));
    } catch (e) {
      console.error(e);
    }
  };

  const updateShards = (newAmt: number) => {
    setSpiritShards(newAmt);
    try {
      localStorage.setItem('huanling_spirit_shards', newAmt.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleGiftFriend = (friendId: string) => {
    const updated = friends.map((f) =>
      f.id === friendId ? { ...f, hasGiftedToday: true } : f
    );
    saveFriends(updated);
    setPlayerCoins((prev) => prev + 50); // reward 50 spirit coins for gifting
  };

  const handleClaimFromFriend = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    if (!friend || !friend.canClaimFromFriend) return;
    const updated = friends.map((f) =>
      f.id === friendId ? { ...f, canClaimFromFriend: false } : f
    );
    saveFriends(updated);
    updateShards(spiritShards + 1);
  };

  const handleClaimAllAndGiftAll = () => {
    let earnedShards = 0;
    let earnedCoins = 0;
    const updated = friends.map((f) => {
      let canClaim = f.canClaimFromFriend;
      let hasGifted = f.hasGiftedToday;
      if (canClaim) {
        earnedShards += 1;
        canClaim = false;
      }
      if (!hasGifted) {
        earnedCoins += 50;
        hasGifted = true;
      }
      return { ...f, canClaimFromFriend: canClaim, hasGiftedToday: hasGifted };
    });
    saveFriends(updated);
    if (earnedShards > 0) updateShards(spiritShards + earnedShards);
    if (earnedCoins > 0) setPlayerCoins((prev) => prev + earnedCoins);
  };

  const handleToggleFollowInScene = (friendId: string) => {
    const updated = friends.map((f) =>
      f.id === friendId ? { ...f, isFollowingInScene: !f.isFollowingInScene } : f
    );
    saveFriends(updated);
  };

  const handleAddFriend = (newFriend: Friend) => {
    const updated = [newFriend, ...friends];
    saveFriends(updated);
  };

  const handleRemoveFriend = (friendId: string) => {
    const updated = friends.filter((f) => f.id !== friendId);
    saveFriends(updated);
  };

  const handleExchangeReward = (rewardId: string, cost: number) => {
    if (spiritShards < cost) return;
    updateShards(spiritShards - cost);

    if (rewardId === 'coins_1500') {
      setPlayerCoins((prev) => prev + 1500);
    } else {
      const isMulti = rewardId === 'gulu_high' || rewardId === 'exp_pill_large' || rewardId === 'potion_full' || rewardId === 'revive_herb';
      handleAddItem(rewardId, isMulti ? 2 : 1);
    }
  };

  const currentScene = SCENES_DATA[currentSceneId] || SCENES_DATA.ACADEMY;

  if (isAdminDashboardOpen) {
    return (
      <AdminDashboard
        onReturnToGame={() => setIsAdminDashboardOpen(false)}
        localPlayerState={{
          playerName,
          playerCoins,
          party,
          inventory,
          currentSceneId,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-start sm:justify-center p-1 sm:p-2 select-none overflow-x-hidden">
      {/* 1. Roco Kingdom Classic Fantasy Game Header Bar */}
      <header className="w-full max-w-5xl bg-gradient-to-r from-[#061426] via-[#091b30] to-[#061426] border-2 border-[#b8860b]/40 rounded-t-2xl px-4 py-2 flex items-center justify-between text-xs text-slate-300 shadow-2xl backdrop-blur-md gap-2">
        {/* Left: Game Title with Vermilion Seal */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <h1 className="roco-title-font text-base sm:text-xl roco-gold-text font-black tracking-wide drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
              幻灵秘境
            </h1>
            <span className="roco-seal text-[9px] px-1.5 py-0.2 font-bold tracking-wider">
              幻境
            </span>
          </div>
          <span className="text-[9px] text-amber-300/80 hidden sm:inline tracking-[0.25em] font-mono font-bold -mb-0.5">
            · SPIRIT REALM
          </span>
        </div>

        {/* Center: Current Zone Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030d1a]/90 border border-[#b8860b]/40 text-[11px] text-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="roco-title-font">秘境探索中：{currentScene.name}</span>
        </div>

        {/* Right: Clean Navigation Shortcuts */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GM Tools Button */}
          <button
            onClick={() => setIsGmOpen(true)}
            className="px-2 py-1 rounded-lg text-xs text-purple-200 hover:text-white bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 transition-all cursor-pointer font-medium flex items-center gap-1 roco-title-font shadow"
            title="呼出天道 GM 调试控制台 (快捷键 ~)"
          >
            <Wrench className="w-3.5 h-3.5 text-purple-400" />
            <span>GM 秘宝</span>
          </button>

          {/* Admin Operations Portal Button */}
          <button
            onClick={() => setIsAdminDashboardOpen(true)}
            className="px-2 py-1 rounded-lg text-xs text-cyan-200 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 transition-all cursor-pointer font-medium flex items-center gap-1 roco-title-font shadow"
            title="进入服务端运营后台管理系统"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>运营后台</span>
          </button>

          <button
            onClick={() => setIsFriendsOpen(true)}
            className="px-2 py-1 rounded-lg text-xs text-amber-200 hover:text-white bg-[#0a1f36]/70 hover:bg-[#0e2a4a] border border-[#b8860b]/40 transition-all cursor-pointer font-medium flex items-center gap-1 roco-title-font"
            title="查看同修仙友录与互赠灵力碎片"
          >
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">仙友录</span>
            {friends.some((f) => f.canClaimFromFriend) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setIsPrologueOpen(true)}
            className="px-2 py-1 rounded-lg text-xs text-amber-200 hover:text-white bg-[#0a1f36]/70 hover:bg-[#0e2a4a] border border-[#b8860b]/40 transition-all cursor-pointer font-medium roco-title-font hidden sm:inline"
            title="回顾世界序章与创世神兽起源"
          >
            天命序章
          </button>
          <button
            onClick={() => setIsQuestLogOpen(true)}
            className="px-2 py-1 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-750 border border-slate-700/60 transition-all cursor-pointer font-medium hidden md:inline"
            title="查看主线修道任务"
          >
            历练日志
          </button>
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            title={soundEnabled ? '音效开启' : '音效静音'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Game Viewport Stage */}
      <main className="w-full max-w-5xl flex flex-col items-center justify-center my-0 shadow-2xl">
        {activeBattle.inBattle && activeBattle.enemyPet ? (
          <BattleView
            playerParty={party}
            enemyPet={activeBattle.enemyPet}
            isWild={activeBattle.isWild}
            sceneId={currentSceneId}
            inventory={inventory}
            onBattleEnd={handleBattleEnd}
          />
        ) : (
          <SceneView
            currentScene={currentScene}
            playerParty={party}
            activeLeaderIndex={activeLeaderIndex}
            playerCoins={playerCoins}
            playerBadges={playerBadges}
            openedChestIds={openedChestIds}
            playerName={playerName}
            friends={friends}
            onOpenFriends={() => setIsFriendsOpen(true)}
            onGiftFriend={handleGiftFriend}
            onClaimFromFriend={handleClaimFromFriend}
            onToggleFollowInScene={handleToggleFollowInScene}
            claimableShardsCount={friends.filter((f) => f.canClaimFromFriend).length}
            onOpenChest={handleOpenChest}
            onEnterBattle={handleStartBattle}
            onTeleportToScene={(scId) => setCurrentSceneId(scId)}
            onOpenPetBag={() => setIsPetBagOpen(true)}
            onOpenPokedex={() => setIsPokedexOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenDailyEvents={() => setIsDailyEventsOpen(true)}
            onOpenPetTrain={() => setIsPetTrainOpen(true)}
            onOpenQuestLog={() => setIsQuestLogOpen(true)}
            onHealParty={handleHealParty}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </main>


      {/* 3. Subtle RPG Footer */}
      <footer className="w-full max-w-5xl bg-[#040e1b]/90 border-x-2 border-b-2 border-[#b8860b]/40 rounded-b-2xl px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold roco-title-font">◇ 幻灵大陆</span>
          <span className="text-slate-600">·</span>
          <span>纯正经典回合制幻灵契约与技能对决 · 参考洛克王国网页游戏</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-amber-200/80 font-mono text-[10px]">
          <span>全图鉴收录 16 种天地神兽</span>
          <span className="text-amber-600">|</span>
          <span>五行相生相克法则</span>
        </div>
      </footer>

      {/* Main Quest Tracker Journal Modal */}
      {isQuestLogOpen && (
        <QuestTracker
          quests={quests}
          onClaimReward={handleClaimQuestReward}
          onNavigateToLocation={(sceneId) => {
            setCurrentSceneId(sceneId);
            setActiveBattle({ inBattle: false, enemyPet: null, isWild: true });
            setIsQuestLogOpen(false);
          }}
        />
      )}

      {/* Prologue Opening Story & Starter Selection Modal */}
      {isPrologueOpen && (
        <PrologueIntroModal onCompletePrologue={handleCompletePrologue} />
      )}

      {/* Full Pet Codex / Pokedex Modal */}
      {isPokedexOpen && (
        <PokedexModal
          unlockedSpeciesIds={unlockedSpeciesIds}
          onClose={() => setIsPokedexOpen(false)}
          onClaimMilestoneReward={handleClaimMilestoneReward}
          claimedMilestones={claimedMilestones}
        />
      )}

      {/* Pet Bag & Party Management Modal */}
      {isPetBagOpen && (
        <PetBagModal
          party={party}
          activeLeaderIndex={activeLeaderIndex}
          onSetLeaderIndex={(idx) => setActiveLeaderIndex(idx)}
          onClose={() => setIsPetBagOpen(false)}
        />
      )}

      {/* Treasure Shop Modal */}
      {isShopOpen && (
        <ShopModal
          playerCoins={playerCoins}
          inventory={inventory}
          onBuyItem={handleBuyItem}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Daily Events (7-Day Signin, Wheel, Boss Trial) Modal */}
      {isDailyEventsOpen && (
        <DailyEventsModal
          playerCoins={playerCoins}
          onAddCoins={handleAddCoins}
          onAddItem={handleAddItem}
          onStartBossBattle={handleStartBossBattle}
          onClose={() => setIsDailyEventsOpen(false)}
        />
      )}

      {/* Pet Cultivation, Feed EXP & Evolution Modal */}
      {isPetTrainOpen && (
        <PetTrainModal
          party={party}
          inventory={inventory}
          onUpdatePartyPet={handleUpdatePartyPet}
          onDeductItem={handleDeductItem}
          onClose={() => setIsPetTrainOpen(false)}
        />
      )}

      {/* Social Friends & Spirit Companions Modal */}
      {isFriendsOpen && (
        <FriendsModal
          friends={friends}
          spiritShards={spiritShards}
          onClose={() => setIsFriendsOpen(false)}
          onGiftFriend={handleGiftFriend}
          onClaimFromFriend={handleClaimFromFriend}
          onClaimAllAndGiftAll={handleClaimAllAndGiftAll}
          onToggleFollowInScene={handleToggleFollowInScene}
          onAddFriend={handleAddFriend}
          onRemoveFriend={handleRemoveFriend}
          onExchangeReward={handleExchangeReward}
        />
      )}

      {/* In-Game Developer & GM Tool Console Modal */}
      {isGmOpen && (
        <GmToolModal
          party={party}
          playerCoins={playerCoins}
          inventory={inventory}
          currentSceneId={currentSceneId}
          unlockedSpeciesIds={unlockedSpeciesIds}
          quests={quests}
          spiritShards={spiritShards}
          playerName={playerName}
          onSetCoins={(coins) => setPlayerCoins(coins)}
          onSetSpiritShards={(shards) => setSpiritShards(shards)}
          onAddItem={(itemId, count) => handleAddItem(itemId, count)}
          onSetParty={(newParty) => setParty(newParty)}
          onTeleport={(sceneId) => {
            setCurrentSceneId(sceneId);
            setActiveBattle({ inBattle: false, enemyPet: null, isWild: true });
          }}
          onUnlockAllSpecies={() => setUnlockedSpeciesIds(Object.keys(PET_SPECIES))}
          onCompleteAllQuests={() => {
            setQuests((prev) =>
              prev.map((q) => ({ ...q, currentCount: q.targetCount, status: 'COMPLETED' }))
            );
          }}
          onHealAll={handleHealParty}
          onOpenPrologue={() => setIsPrologueOpen(true)}
          onResetSave={handleResetSave}
          onImportSave={handleImportSave}
          onClose={() => setIsGmOpen(false)}
        />
      )}
    </div>
  );
}

