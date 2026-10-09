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
import { QuestTracker } from './components/QuestTracker';
import { PetBagModal } from './components/PetBagModal';
import { ShopModal } from './components/ShopModal';
import { PrologueIntroModal } from './components/PrologueIntroModal';

import { Sparkles, Compass, BookOpen, Backpack, ShoppingBag, ScrollText, Volume2, VolumeX } from 'lucide-react';

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

  const currentScene = SCENES_DATA[currentSceneId] || SCENES_DATA.ACADEMY;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Universal Top Bar (Strict Top Bar Contract: 3 Zones separated by gap-8) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            setCurrentSceneId('ACADEMY');
          }}
          className="text-lg font-black tracking-tight text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>幻灵秘境</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              sound.playClick();
              setActiveBattle({ inBattle: false, enemyPet: null, isWild: true });
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            探索圣境
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsPokedexOpen(true);
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>幻灵图鉴 ({unlockedSpeciesIds.length})</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsPetBagOpen(true);
            }}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Backpack className="w-4 h-4 text-cyan-400" />
            <span>随行战队 ({party.length}/6)</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsShopOpen(true);
            }}
            className="hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>万象宝阁</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <QuestTracker
            quests={quests}
            onClaimReward={handleClaimQuestReward}
            onNavigateToLocation={(sceneId) => {
              setCurrentSceneId(sceneId);
              setActiveBattle({ inBattle: false, enemyPet: null, isWild: true });
            }}
          />
        </div>
      </header>

      {/* Main Game Stage Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center justify-center">
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
            onOpenChest={handleOpenChest}
            onEnterBattle={handleStartBattle}
            onTeleportToScene={(scId) => setCurrentSceneId(scId)}
            onOpenPetBag={() => setIsPetBagOpen(true)}
            onOpenPokedex={() => setIsPokedexOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onHealParty={handleHealParty}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </main>

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
    </div>
  );
}
