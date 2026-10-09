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

import { Sparkles, Compass, BookOpen, Backpack, ShoppingBag, ScrollText, Volume2, VolumeX, Gift, Zap } from 'lucide-react';

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

  const currentScene = SCENES_DATA[currentSceneId] || SCENES_DATA.ACADEMY;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-between p-1 sm:p-3 select-none">
      {/* 1. Classic Web Game Portal Top Bar (4399 / 淘米 / 腾讯页游风格官方顶栏) */}
      <header className="w-full max-w-5xl bg-slate-900/90 border border-amber-500/40 rounded-t-xl px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300 shadow-md backdrop-blur-sm gap-2">
        {/* Left: Game Title & Server Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-inner">
              秘
            </div>
            <h1 className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 game-title-font tracking-wide">
              幻灵秘境
            </h1>
          </div>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>电信一区 · 仙灵秘境 (12ms)</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-300/80 font-mono">
            <span>🔥 158,240 灵契使在线</span>
          </div>
        </div>

        {/* Right: Quick Portal Navigation & Sound / Fullscreen */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsPrologueOpen(true)}
            className="text-[11px] text-amber-300/90 hover:text-amber-200 underline cursor-pointer"
            title="查看游戏序章与天地浩劫背景故事"
          >
            【天命剧情】
          </button>
          <button
            onClick={() => setIsQuestLogOpen(true)}
            className="text-[11px] text-slate-300 hover:text-amber-300 cursor-pointer"
            title="查看主线任务进度"
          >
            历练指南
          </button>
          <button
            onClick={handleToggleSound}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title={soundEnabled ? '音效开启' : '音效静音'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Game Flash Viewport Stage (100% Focused on the Web Game) */}
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

      {/* 3. Classic Flash Portal Bottom Anti-Addiction Compliance Footer */}
      <footer className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-b-xl px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">🛡️ 适龄提示：8+</span>
          <span>抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。适度游戏益脑，沉迷游戏伤身。</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-[10px]">
          <span>⚡ WebGL/Flash 双模渲染</span>
          <span>© 2026 《幻灵秘境》运营团队</span>
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
    </div>
  );
}
