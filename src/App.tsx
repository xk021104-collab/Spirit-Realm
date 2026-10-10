import React, { useState, useEffect } from 'react';
import { PetInstance, InventorySlot, SceneId, Quest, Friend, GameMail, GuildInfo, ChatMessage, CloudAccount, CharacterOutfit } from './types/game';
import { SCENES_DATA } from './data/scenes';
import { INITIAL_QUESTS } from './data/quests';
import { PET_SPECIES } from './data/species';
import { ITEMS_DATA } from './data/items';
import { MOVES_DATA } from './data/moves';
import { DEFAULT_CHARACTER_OUTFIT } from './data/outfits';
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
import { PetStorageModal } from './components/PetStorageModal';
import { MoveManagerModal } from './components/MoveManagerModal';
import { EvolutionAnimationModal } from './components/EvolutionAnimationModal';
import { MailboxModal } from './components/MailboxModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GuildModal } from './components/GuildModal';
import { AuthModal } from './components/AuthModal';
import { WorldChatPanel } from './components/WorldChatPanel';
import { WardrobeModal } from './components/WardrobeModal';
import { INITIAL_FRIENDS } from './data/friends';

import { PlayerAvatar } from './components/PlayerAvatar';

import {
  Sparkles,
  Compass,
  BookOpen,
  Backpack,
  ShoppingBag,
  ScrollText,
  Volume2,
  VolumeX,
  Gift,
  Zap,
  Users,
  Wrench,
  Shield,
  Archive,
  Trophy,
  Mail,
  Cloud,
  Music,
  Coins,
  Gem,
  Crown,
  Plus,
  Heart,
} from 'lucide-react';

const STORAGE_KEY = 'huanling_mijing_save_v1';

const INITIAL_MAILS: GameMail[] = [
  {
    id: 'mail_001',
    title: '【奥术学院开学礼】新晋小魔法师启航礼包',
    sender: '阿尔弗雷德院长',
    content: '亲爱的小魔法师，欢迎来到美丽的星灵王国奥术学院！为了助你在翡翠平原与各大王国场景中结识更多心仪的宠物伙伴，学院特为你准备了高级星灵球、精力魔药与天赋洗礼魔药！',
    sentAt: '2026-10-10 08:00',
    isClaimed: false,
    rewards: {
      coins: 2000,
      items: [
        { itemId: 'gulu_high', count: 5 },
        { itemId: 'potion_mid', count: 3 },
        { itemId: 'xi_sui_dan', count: 2 },
      ],
    },
  },
  {
    id: 'mail_002',
    title: '【皇家魔导物资】星辉集市巴纳比特别回馈',
    sender: '商人巴纳比',
    content: '来自星辉集市的特供魔法补给！包含智慧圣果与大袋星露果，能帮助你的宠物迅速提升经验，并在群星竞技场大显身手。',
    sentAt: '2026-10-10 10:30',
    isClaimed: false,
    rewards: {
      coins: 1000,
      items: [
        { itemId: 'ding_hun_dan', count: 1 },
        { itemId: 'exp_pill_large', count: 3 },
      ],
    },
  },
];

const DEFAULT_GUILD: GuildInfo = {
  id: 'guild_001',
  name: '皇家晨星魔法师公会',
  leaderName: '大法师·奥古斯丁',
  level: 4,
  totalFunds: 98000,
  exp: 3400,
  maxExp: 5000,
  memberCount: 28,
  maxMembers: 30,
  notice: '守护星灵王国，探索古老魔导奥秘！每日魔法打卡领取金库津贴，共同研习皇家公会魔导研究！',
  playerRole: 'ELDER',
  playerDevotion: 180,
  hasClaimedSalaryToday: false,
  skills: [
    {
      id: 'guild_atk',
      name: '魔导锋芒阵',
      level: 2,
      maxLevel: 10,
      effectStat: 'atk',
      bonusPerLevel: 3,
      bonusType: 'ATK',
      bonusValue: 6,
      cost: 50,
      description: '引动元素魔导共鸣，提高全体上阵随行宠物 6 点物攻与魔攻。',
    },
    {
      id: 'guild_hp',
      name: '生命圣泉契约',
      level: 3,
      maxLevel: 10,
      effectStat: 'hp',
      bonusPerLevel: 15,
      bonusType: 'HP',
      bonusValue: 45,
      cost: 60,
      description: '引导精灵圣泉滋润，提高全体上阵随行宠物 45 点精力上限。',
    },
    {
      id: 'guild_def',
      name: '奥术护盾壁垒',
      level: 1,
      maxLevel: 10,
      effectStat: 'def',
      bonusPerLevel: 3,
      bonusType: 'DEF',
      bonusValue: 5,
      cost: 40,
      description: '凝聚奥术偏转护盾，提高全体上阵随行宠物 5 点物防与魔抗。',
    },
    {
      id: 'guild_spd',
      name: '风灵疾速光环',
      level: 1,
      maxLevel: 10,
      effectStat: 'speed',
      bonusPerLevel: 2,
      bonusType: 'SPD',
      bonusValue: 3,
      cost: 50,
      description: '加持轻灵之风祝福，提高全体上阵随行宠物 3 点先手速度。',
    },
  ],
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_001',
    senderId: 'sys',
    senderName: '星灵王国广播',
    senderTitle: '阿尔弗雷德院长',
    content: '欢迎来到《星灵王国》！奥术学院钟声敲响，万千神奇宠物等待与你结伴冒险，祝各位小魔法师早日成为皇家大魔导师！',
    channel: 'WORLD',
    timestamp: Date.now() - 3600000,
    isSystem: true,
  },
  {
    id: 'msg_002',
    senderId: 'npc_001',
    senderName: '艾丽西亚小公主',
    senderTitle: '皇家小公主',
    content: '哼，本公主刚刚在宠物训练室给火羽小公主吃了两颗星露果，实力大增！谁来竞技场挑战本公主？',
    channel: 'WORLD',
    timestamp: Date.now() - 1800000,
  },
  {
    id: 'msg_003',
    senderId: 'npc_002',
    senderName: '诺亚',
    senderTitle: '学院同桌',
    content: '翡翠平原的水灵儿好可爱啊，我用了两颗初级星灵球才捕捉到呢！',
    channel: 'WORLD',
    timestamp: Date.now() - 600000,
  },
];

export default function App() {
  // Game Loaded state
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Core Player State
  const [playerName, setPlayerName] = useState<string>('见习小魔法师');
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

  // 11 Core Extended Systems State
  const [petStorage, setPetStorage] = useState<PetInstance[]>([]);
  const [mails, setMails] = useState<GameMail[]>(INITIAL_MAILS);
  const [guild, setGuild] = useState<GuildInfo>(DEFAULT_GUILD);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [cloudAccount, setCloudAccount] = useState<CloudAccount>({
    username: '见习小魔法师',
    token: null,
    isLoggedIn: false,
    lastSyncTime: null,
  });
  const [marqueeAnnouncement, setMarqueeAnnouncement] = useState<string | null>(
    '欢迎各位小魔法师来到星灵王国！奥术学院已开学，快去信箱领取开学好礼吧！'
  );
  const [hasPraisedToday, setHasPraisedToday] = useState<boolean>(false);

  // Sub-modal states
  const [isPetStorageOpen, setIsPetStorageOpen] = useState<boolean>(false);
  const [isMailboxOpen, setIsMailboxOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isGuildOpen, setIsGuildOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [moveManagerPet, setMoveManagerPet] = useState<PetInstance | null>(null);
  const [evolutionData, setEvolutionData] = useState<{
    pet: PetInstance;
    fromSpeciesId: string;
    toSpeciesId: string;
  } | null>(null);

  // 12. Character Outfit & Magic Wardrobe Salon State
  const [playerOutfit, setPlayerOutfit] = useState<CharacterOutfit>(() => {
    try {
      const saved = localStorage.getItem('roco_character_outfit');
      return saved ? JSON.parse(saved) : DEFAULT_CHARACTER_OUTFIT;
    } catch {
      return DEFAULT_CHARACTER_OUTFIT;
    }
  });
  const [unlockedOutfitIds, setUnlockedOutfitIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('roco_unlocked_outfits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [playerDiamonds, setPlayerDiamonds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('roco_player_diamonds');
      return saved ? parseInt(saved, 10) : 680;
    } catch {
      return 680;
    }
  });
  const [isWardrobeOpen, setIsWardrobeOpen] = useState<boolean>(false);

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

  // Audio Toggle & BGM State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);

  // 1. Initial Load & Persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlayerName(parsed.playerName || '见习小魔法师');
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

      // Load Pet Storage
      const savedStorage = localStorage.getItem('huanling_pet_storage');
      if (savedStorage) {
        setPetStorage(JSON.parse(savedStorage));
      }

      // Load Mails
      const savedMails = localStorage.getItem('huanling_mails_data');
      if (savedMails) {
        setMails(JSON.parse(savedMails));
      }

      // Load Guild
      const savedGuild = localStorage.getItem('huanling_guild_data');
      if (savedGuild) {
        setGuild(JSON.parse(savedGuild));
      }

      // Load Cloud Account
      const savedAccount = localStorage.getItem('huanling_cloud_account');
      if (savedAccount) {
        setCloudAccount(JSON.parse(savedAccount));
      }

      // Load Praise Status
      const savedPraiseDate = localStorage.getItem('huanling_praise_date');
      const todayDate = new Date().toISOString().split('T')[0];
      if (savedPraiseDate === todayDate) {
        setHasPraisedToday(true);
      }

      // Load Social Friends & Shards
      const savedFriends = localStorage.getItem('huanling_friends_data');
      const savedShards = localStorage.getItem('huanling_spirit_shards');
      const lastGiftDate = localStorage.getItem('huanling_last_gift_date');

      if (savedShards) {
        setSpiritShards(parseInt(savedShards, 10));
      }

      if (savedFriends) {
        let parsedFriends = JSON.parse(savedFriends) as Friend[];
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

  // BGM toggle
  const handleToggleBgm = () => {
    const isPlaying = sound.toggleBgm();
    setBgmPlaying(isPlaying);
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
    localStorage.removeItem('huanling_pet_storage');
    localStorage.removeItem('huanling_mails_data');
    localStorage.removeItem('huanling_guild_data');
    localStorage.removeItem('huanling_cloud_account');
    localStorage.removeItem('huanling_friends_data');
    localStorage.removeItem('huanling_spirit_shards');
    localStorage.removeItem('huanling_last_gift_date');
    localStorage.removeItem('roco_character_outfit');
    localStorage.removeItem('roco_unlocked_outfits');
    localStorage.removeItem('roco_player_diamonds');
    window.location.reload();
  };

  // Magic Wardrobe Outfit Customization Handlers
  const handleSaveOutfit = (newOutfit: CharacterOutfit) => {
    setPlayerOutfit(newOutfit);
    try {
      localStorage.setItem('roco_character_outfit', JSON.stringify(newOutfit));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnlockOutfitItem = (itemId: string, costCoins?: number, costDiamonds?: number) => {
    if (costCoins && playerCoins < costCoins) return;
    if (costDiamonds && playerDiamonds < costDiamonds) return;

    if (costCoins) {
      setPlayerCoins((prev) => Math.max(0, prev - costCoins));
    }
    if (costDiamonds) {
      setPlayerDiamonds((prev) => {
        const next = Math.max(0, prev - costDiamonds);
        try {
          localStorage.setItem('roco_player_diamonds', next.toString());
        } catch (e) {
          console.error(e);
        }
        return next;
      });
    }

    setUnlockedOutfitIds((prev) => {
      if (prev.includes(itemId)) return prev;
      const next = [...prev, itemId];
      try {
        localStorage.setItem('roco_unlocked_outfits', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
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

    setPlayerCoins((prev) => prev + targetQuest.rewards.coins);

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

    if (targetQuest.rewards.badge && !playerBadges.includes(targetQuest.rewards.badge)) {
      setPlayerBadges((prev) => [...prev, targetQuest.rewards.badge!]);
    }

    setQuests((prev) => {
      const nextQuests = [...prev];
      nextQuests[qIndex] = { ...targetQuest, status: 'CLAIMED' };
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
    setUnlockedSpeciesIds([starterPet.speciesId]);
    setIsPrologueOpen(false);
    updateQuestProgress('CHOOSE_STARTER', 1);
  };

  // 4. Battle Events
  const handleStartBattle = (enemyPet: PetInstance, isWild: boolean) => {
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
      if (result.updatedParty.length < 6) {
        setParty([...result.updatedParty, result.capturedPet]);
      } else {
        // Auto deposit into storage box!
        setPetStorage((prev) => {
          const nextStorage = [...prev, result.capturedPet!];
          try {
            localStorage.setItem('huanling_pet_storage', JSON.stringify(nextStorage));
          } catch (e) {
            console.error(e);
          }
          return nextStorage;
        });
        const petName = PET_SPECIES[result.capturedPet.speciesId]?.name || '宠物';
        setMarqueeAnnouncement(`随行宠物背包已满，捕获的【${petName}】已自动存入王国宠物仓库！`);
      }

      if (!unlockedSpeciesIds.includes(result.capturedPet.speciesId)) {
        setUnlockedSpeciesIds((prev) => [...prev, result.capturedPet!.speciesId]);
      }
      updateQuestProgress('CATCH_PET', 1);
    }

    // Check if won battle
    if (result.won && !result.fled) {
      if (activeBattle.isWild) {
        updateQuestProgress('WIN_WILD_BATTLE', 1);
      } else {
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

  // 7. Shop Purchase & Sell
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

  const handleSellItem = (itemId: string, count: number, totalEarned: number) => {
    handleDeductItem(itemId, count);
    setPlayerCoins((prev) => prev + totalEarned);
    sound.playCatchSuccess();
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
    setPlayerCoins((prev) => prev + 50);
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

  // 11. Pet Storage Handlers
  const handleDepositToStorage = (partyIndex: number) => {
    if (party.length <= 1) {
      alert('上阵出战位至少保留 1 只宠物！');
      return;
    }
    const petToDeposit = party[partyIndex];
    if (!petToDeposit) return;
    const newParty = party.filter((_, idx) => idx !== partyIndex);
    const newStorage = [...petStorage, petToDeposit];
    setParty(newParty);
    setPetStorage(newStorage);
    if (activeLeaderIndex >= newParty.length) {
      setActiveLeaderIndex(0);
    }
    sound.playCatchSuccess();
    try {
      localStorage.setItem('huanling_pet_storage', JSON.stringify(newStorage));
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdrawFromStorage = (storageIndex: number) => {
    if (party.length >= 6) {
      alert('随行宠物已满（至多 6 只），请先将宠物存入仓库！');
      return;
    }
    const petToWithdraw = petStorage[storageIndex];
    if (!petToWithdraw) return;
    const newStorage = petStorage.filter((_, idx) => idx !== storageIndex);
    const newParty = [...party, petToWithdraw];
    setParty(newParty);
    setPetStorage(newStorage);
    sound.playCatchSuccess();
    try {
      localStorage.setItem('huanling_pet_storage', JSON.stringify(newStorage));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwapPartyAndStorage = (partyIndex: number, storageIndex: number) => {
    const partyPet = party[partyIndex];
    const storagePet = petStorage[storageIndex];
    if (!partyPet || !storagePet) return;
    const newParty = [...party];
    const newStorage = [...petStorage];
    newParty[partyIndex] = storagePet;
    newStorage[storageIndex] = partyPet;
    setParty(newParty);
    setPetStorage(newStorage);
    sound.playCatchSuccess();
    try {
      localStorage.setItem('huanling_pet_storage', JSON.stringify(newStorage));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReleasePet = (from: 'party' | 'storage', index: number) => {
    if (from === 'party') {
      if (party.length <= 1) {
        alert('随行宠物至少保留 1 只，不可全部放生！');
        return;
      }
      const pet = party[index];
      if (!pet) return;
      const refundCoins = pet.level * 60;
      setParty((prev) => prev.filter((_, idx) => idx !== index));
      setPlayerCoins((prev) => prev + refundCoins);
      setSpiritShards((prev) => prev + 1);
      sound.playCatchSuccess();
    } else {
      const pet = petStorage[index];
      if (!pet) return;
      const refundCoins = pet.level * 60;
      const newStorage = petStorage.filter((_, idx) => idx !== index);
      setPetStorage(newStorage);
      setPlayerCoins((prev) => prev + refundCoins);
      setSpiritShards((prev) => prev + 1);
      sound.playCatchSuccess();
      try {
        localStorage.setItem('huanling_pet_storage', JSON.stringify(newStorage));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 12. Move Manager Handler
  const handleSaveMoves = (petUid: string, selectedMoveIds: string[]) => {
    const newMoves = selectedMoveIds
      .map((id) => MOVES_DATA[id])
      .filter(Boolean)
      .map((m) => ({
        ...m,
        pp: m.maxPp,
      }));

    setParty((prev) =>
      prev.map((pet) => {
        if (pet.uid === petUid) {
          const learned = Array.from(new Set([...(pet.learnedMoveIds || []), ...selectedMoveIds]));
          return {
            ...pet,
            moves: newMoves,
            learnedMoveIds: learned,
          };
        }
        return pet;
      })
    );

    setPetStorage((prev) =>
      prev.map((pet) => {
        if (pet.uid === petUid) {
          const learned = Array.from(new Set([...(pet.learnedMoveIds || []), ...selectedMoveIds]));
          return {
            ...pet,
            moves: newMoves,
            learnedMoveIds: learned,
          };
        }
        return pet;
      })
    );

    setMoveManagerPet(null);
    sound.playCatchSuccess();
  };

  // 13. Mailbox Handlers
  const handleClaimMail = (mailId: string) => {
    const mail = mails.find((m) => m.id === mailId);
    if (!mail || mail.isClaimed) return;

    sound.playCatchSuccess();
    if (mail.rewards) {
      if (mail.rewards.coins) {
        setPlayerCoins((prev) => prev + mail.rewards!.coins!);
      }
      if (mail.rewards.items) {
        mail.rewards.items.forEach((slot) => {
          handleAddItem(slot.itemId, slot.count);
        });
      }
      if (mail.rewards.pet) {
        if (party.length < 6) {
          setParty((prev) => [...prev, mail.rewards!.pet!]);
        } else {
          setPetStorage((prev) => [...prev, mail.rewards!.pet!]);
        }
      }
    }

    const updatedMails = mails.map((m) =>
      m.id === mailId ? { ...m, isClaimed: true } : m
    );
    setMails(updatedMails);
    try {
      localStorage.setItem('huanling_mails_data', JSON.stringify(updatedMails));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaimAllMails = () => {
    sound.playCatchSuccess();
    let totalCoins = 0;
    const addedItems: { [id: string]: number } = {};
    const addedPets: PetInstance[] = [];

    const updatedMails = mails.map((m) => {
      if (!m.isClaimed && m.rewards) {
        if (m.rewards.coins) totalCoins += m.rewards.coins;
        if (m.rewards.items) {
          m.rewards.items.forEach((slot) => {
            addedItems[slot.itemId] = (addedItems[slot.itemId] || 0) + slot.count;
          });
        }
        if (m.rewards.pet) {
          addedPets.push(m.rewards.pet);
        }
        return { ...m, isClaimed: true };
      }
      return m;
    });

    if (totalCoins > 0) setPlayerCoins((prev) => prev + totalCoins);
    Object.entries(addedItems).forEach(([id, count]) => {
      handleAddItem(id, count);
    });
    if (addedPets.length > 0) {
      addedPets.forEach((p) => {
        setParty((curr) => {
          if (curr.length < 6) return [...curr, p];
          setPetStorage((st) => [...st, p]);
          return curr;
        });
      });
    }

    setMails(updatedMails);
    try {
      localStorage.setItem('huanling_mails_data', JSON.stringify(updatedMails));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReadMails = () => {
    const remaining = mails.filter((m) => !m.isClaimed);
    setMails(remaining);
    try {
      localStorage.setItem('huanling_mails_data', JSON.stringify(remaining));
    } catch (e) {
      console.error(e);
    }
  };

  // 14. Guild Handlers
  const handleClaimGuildSalary = () => {
    setPlayerCoins((prev) => prev + 1000);
    const updatedGuild: GuildInfo = {
      ...guild,
      playerDevotion: guild.playerDevotion + 50,
      hasClaimedSalaryToday: true,
    };
    setGuild(updatedGuild);
    try {
      localStorage.setItem('huanling_guild_data', JSON.stringify(updatedGuild));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpgradeGuildSkill = (skillId: string) => {
    const updatedSkills = guild.skills.map((sk) => {
      if (sk.id === skillId) {
        return {
          ...sk,
          level: sk.level + 1,
          bonusValue: (sk.bonusValue ?? 10) + Math.ceil((sk.bonusValue ?? 10) / Math.max(sk.level, 1)),
          cost: sk.cost + 50,
        };
      }
      return sk;
    });
    const currentCost = guild.skills.find((s) => s.id === skillId)?.cost || 50;
    const updatedGuild: GuildInfo = {
      ...guild,
      playerDevotion: Math.max(0, guild.playerDevotion - currentCost),
      skills: updatedSkills,
    };
    setGuild(updatedGuild);
    try {
      localStorage.setItem('huanling_guild_data', JSON.stringify(updatedGuild));
    } catch (e) {
      console.error(e);
    }
  };

  // 15. Leaderboard Praise Handler
  const handlePraiseLeader = () => {
    if (hasPraisedToday) return;
    setPlayerCoins((prev) => prev + 200);
    setSpiritShards((prev) => prev + 1);
    setHasPraisedToday(true);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('huanling_has_praised_today', 'true');
    localStorage.setItem('huanling_praise_date', today);
    sound.playCatchSuccess();
  };

  // 16. World Chat Handler
  const handleSendMessage = (content: string, channel: 'WORLD' | 'SCENE') => {
    const newMsg: ChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: 'player',
      senderName: playerName,
      senderTitle: party[0]?.level && party[0].level >= 30 ? '灵宗大师' : '引气修者',
      content,
      channel,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev.slice(-49), newMsg]);
    return true;
  };

  // 17. Cloud Account Auth & Sync
  const handleLogin = (username: string) => {
    const acc: CloudAccount = {
      username,
      token: `token_${Date.now()}`,
      isLoggedIn: true,
      lastSyncTime: new Date().toLocaleTimeString(),
    };
    setPlayerName(username);
    setCloudAccount(acc);
    try {
      localStorage.setItem('huanling_cloud_account', JSON.stringify(acc));
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  const handleLogout = () => {
    const acc: CloudAccount = {
      username: '见习小魔法师',
      token: null,
      isLoggedIn: false,
      lastSyncTime: null,
    };
    setCloudAccount(acc);
    try {
      localStorage.setItem('huanling_cloud_account', JSON.stringify(acc));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncUpload = async (): Promise<boolean> => {
    try {
      const payload = {
        name: playerName,
        coins: playerCoins,
        level: Math.max(...party.map((p) => p.level), 1),
        pets: party,
        storagePets: petStorage,
        badges: playerBadges,
        dexCount: unlockedSpeciesIds.length,
        currentScene: currentSceneId,
      };
      const res = await fetch('/api/admin/sync-local-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const timeStr = new Date().toLocaleTimeString();
        setCloudAccount((prev) => ({ ...prev, lastSyncTime: timeStr }));
        return true;
      }
    } catch {
      // offline fallback
    }
    const timeStr = new Date().toLocaleTimeString();
    setCloudAccount((prev) => ({ ...prev, lastSyncTime: timeStr }));
    return true;
  };

  const handleSyncDownload = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/players');
      if (res.ok) {
        const data = await res.json();
        const found = data.find((p: any) => p.name === playerName);
        if (found) {
          if (found.coins) setPlayerCoins(found.coins);
          if (found.pets && Array.isArray(found.pets) && found.pets.length > 0) {
            setParty(found.pets);
          }
          return true;
        }
      }
    } catch {
      // offline fallback
    }
    return true;
  };

  // Metrics for Leaderboard
  const myCombatPower = party.reduce((sum, pet) => {
    const s = pet.stats;
    const talentBonus = Math.floor((pet.talentScore || 70) * 1.5);
    return sum + (s.hp + s.atk * 2 + s.def * 2 + s.spAtk * 2 + s.spDef * 2 + s.speed * 2 + talentBonus);
  }, 0);
  const myTopLevel = party.length > 0 ? Math.max(...party.map((p) => p.level)) : 1;
  const myLeaderSpeciesId = party[0]?.speciesId || 'huoyanhou';
  const unreadMailsCount = mails.filter((m) => !m.isClaimed).length;

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
      {/* 1. Roco Kingdom Classic Fantasy Game Top Navigation Bar */}
      <header className="w-full max-w-5xl roco-top-bar rounded-t-2xl px-3 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        {/* Left: Player Profile & Level Crest (洛克小魔法师头像与等级铭牌) */}
        <div className="flex items-center gap-2.5">
          <div className="relative group cursor-pointer" onClick={() => setIsPetTrainOpen(true)} title="点击查看宠物锻炼与详细资料">
            <div className="w-10 h-10 rounded-full border-2 border-[#fde047] bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] flex items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(250,204,21,0.5)]">
              <PlayerAvatar size={36} outfit={playerOutfit} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-1 rounded-full border border-yellow-200 shadow font-mono">
              Lv.{myTopLevel}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="roco-title-font font-bold text-sm text-slate-100 tracking-wide">
                {playerName}
              </span>
              <span className="roco-seal text-[9px] px-1.5 py-0.2 font-bold tracking-wider">
                小魔法师
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-200/90 font-mono mt-0.5">
              <span className="text-amber-400 font-bold">总战力:</span>
              <span className="text-white font-bold">{myCombatPower}</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300">图鉴: {unlockedSpeciesIds.length}/16</span>
            </div>
          </div>
        </div>

        {/* Center: Astra Kingdom Iconic Currencies & Vitality Gauges (星辉金币/璀璨星钻/活力值) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* 1. 星辉金币 */}
          <div
            onClick={() => setIsShopOpen(true)}
            className="roco-currency-badge cursor-pointer group"
            title="查看星辉金币储备 · 点击前往星辉集市"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xs">
              <Coins className="w-2.5 h-2.5 text-slate-950" />
            </div>
            <span className="font-mono text-[11px] font-bold text-amber-300">
              {playerCoins.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">金</span>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/30 group-hover:bg-amber-400 text-amber-200 group-hover:text-slate-950 flex items-center justify-center text-[10px] font-bold ml-0.5 transition-colors">
              +
            </div>
          </div>

          {/* 2. 璀璨星钻 */}
          <div
            onClick={() => setIsShopOpen(true)}
            className="roco-currency-badge cursor-pointer group"
            title="璀璨星钻 · 用于兑换珍贵魔法道具与稀有星灵球"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xs">
              <Gem className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-mono text-[11px] font-bold text-cyan-300">
              {playerDiamonds.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">钻</span>
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/30 group-hover:bg-cyan-400 text-cyan-200 group-hover:text-slate-950 flex items-center justify-center text-[10px] font-bold ml-0.5 transition-colors">
              +
            </div>
          </div>

          {/* 3. 活力值 */}
          <div className="roco-currency-badge" title="小魔法师每日探索活力值">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-xs">
              <Zap className="w-2.5 h-2.5 text-slate-950" />
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-300">
              100/100
            </span>
          </div>
        </div>

        {/* Right: Quick Action Candy Buttons & Utilities (活动/装扮/信箱/公会/天梯/GM) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
          {/* Daily Events Activity Center */}
          <button
            onClick={() => setIsDailyEventsOpen(true)}
            className="roco-action-pill bg-gradient-to-b from-amber-600/40 to-amber-950/60"
            title="活动中心 · 每日签到与学院试炼"
          >
            <Gift className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span className="hidden md:inline">活动</span>
          </button>

          {/* Magic Wardrobe Salon Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsWardrobeOpen(true);
            }}
            className="roco-action-pill bg-gradient-to-b from-purple-600/40 to-pink-950/60 border-purple-400/50"
            title="皮卡魔力衣橱 · 魔法服饰换装与沙龙"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden md:inline font-bold text-pink-200">装扮</span>
          </button>

          {/* Mailbox Button */}
          <button
            onClick={() => setIsMailboxOpen(true)}
            className="roco-action-pill relative"
            title="皇家猫头鹰信箱 · 领取礼包信件"
          >
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">信箱</span>
            {unreadMailsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 text-[9px] bg-rose-500 text-white rounded-full font-bold animate-pulse shadow">
                {unreadMailsCount}
              </span>
            )}
          </button>

          {/* Guild / Alliance Button */}
          <button
            onClick={() => setIsGuildOpen(true)}
            className="roco-action-pill"
            title="皇家魔法公会与学者勋章"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">公会</span>
            {!guild.hasClaimedSalaryToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="roco-action-pill"
            title="查看王国战力天梯榜"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">天梯</span>
          </button>

          {/* Social Friends Button */}
          <button
            onClick={() => setIsFriendsOpen(true)}
            className="roco-action-pill"
            title="查看魔法好友录与星光碎片互赠"
          >
            <Users className="w-3.5 h-3.5 text-teal-300" />
            <span className="hidden md:inline">好友</span>
            {friends.some((f) => f.canClaimFromFriend) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            )}
          </button>

          {/* Pet Storage / Sanctuary */}
          <button
            onClick={() => setIsPetStorageOpen(true)}
            className="roco-action-pill"
            title="皇家宠物仓库 · 存放暂不上阵的魔灵伙伴"
          >
            <Archive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">仓库</span>
            {petStorage.length > 0 && (
              <span className="px-1 text-[9px] bg-emerald-600 text-white rounded-full font-mono">
                {petStorage.length}
              </span>
            )}
          </button>

          {/* Cloud Account Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="roco-action-pill"
            title="王国云端档案与进度同步"
          >
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">云端</span>
          </button>

          {/* GM Tools Button */}
          <button
            onClick={() => setIsGmOpen(true)}
            className="px-2 py-1 rounded-full text-xs text-purple-200 hover:text-white bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 transition-all cursor-pointer font-bold flex items-center gap-1 roco-title-font shadow"
            title="呼出魔法学院 GM 调试控制台 (快捷键 ~)"
          >
            <Wrench className="w-3.5 h-3.5 text-purple-400" />
            <span>GM</span>
          </button>

          {/* Admin Operations Portal Button */}
          <button
            onClick={() => setIsAdminDashboardOpen(true)}
            className="px-2 py-1 rounded-full text-xs text-cyan-200 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 transition-all cursor-pointer font-bold flex items-center gap-1 roco-title-font shadow"
            title="进入服务端运营后台管理系统"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">后台</span>
          </button>

          {/* Magic Academy BGM Toggle Button */}
          <button
            onClick={handleToggleBgm}
            className={`p-1.5 rounded-full border transition-all cursor-pointer ${
              bgmPlaying
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/60 text-slate-400'
            }`}
            title={bgmPlaying ? '王国魔法乐章播放中 (点击停止)' : '播放轻快魔法旋律'}
          >
            <Music className={`w-3.5 h-3.5 ${bgmPlaying ? 'animate-spin' : ''}`} />
          </button>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
            title={soundEnabled ? '音效开启' : '音效静音'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Game Viewport Stage with Gilded Bezel (洛克王国经典舞台外框与四角鎏金卷草纹) */}
      <main className="w-full max-w-5xl flex flex-col items-center justify-center my-0 shadow-2xl relative roco-web-stage">
        {/* 4 Corner Ornaments */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />
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
            playerOutfit={playerOutfit}
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
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

        {/* Global World Chat Bar */}
        <WorldChatPanel
          playerName={playerName}
          playerTitle={party[0]?.level && party[0].level >= 30 ? '皇家大法师' : '见习魔法师'}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          marqueeAnnouncement={marqueeAnnouncement}
        />
      </main>

      {/* 3. Subtle RPG Footer */}
      <footer className="w-full max-w-5xl bg-[#040e1b]/90 border-x-2 border-b-2 border-[#b8860b]/40 rounded-b-2xl px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold roco-title-font">◇ 星灵王国</span>
          <span className="text-slate-600">·</span>
          <span>经典西幻魔法回合制宠物页游 · 奥术学院与奇迹进化</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-amber-200/80 font-mono text-[10px]">
          <span>全图鉴收录 16 种经典魔灵宠物</span>
          <span className="text-amber-600">|</span>
          <span>魔法系别克制法则</span>
          <span className="text-amber-600">|</span>
          <span>按 ~ 键呼出管理控制台</span>
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

      {/* Treasure Shop Modal with Batch Buy & Item Pawn/Sell */}
      {isShopOpen && (
        <ShopModal
          playerCoins={playerCoins}
          inventory={inventory}
          onBuyItem={handleBuyItem}
          onSellItem={handleSellItem}
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

      {/* Pet Cultivation, Feed EXP, Wash Talent & Evolution Modal */}
      {isPetTrainOpen && (
        <PetTrainModal
          party={party}
          inventory={inventory}
          onUpdatePartyPet={handleUpdatePartyPet}
          onDeductItem={handleDeductItem}
          onOpenMoveManager={(pet) => setMoveManagerPet(pet)}
          onTriggerEvolution={(pet, oldId, newId) =>
            setEvolutionData({ pet, fromSpeciesId: oldId, toSpeciesId: newId })
          }
          onClose={() => setIsPetTrainOpen(false)}
        />
      )}

      {/* Pet Storage / Sanctuary PC Box Modal */}
      {isPetStorageOpen && (
        <PetStorageModal
          party={party}
          storage={petStorage}
          activeLeaderIndex={activeLeaderIndex}
          onSetLeaderIndex={(idx) => setActiveLeaderIndex(idx)}
          onDepositToStorage={handleDepositToStorage}
          onWithdrawFromStorage={handleWithdrawFromStorage}
          onSwapPartyAndStorage={handleSwapPartyAndStorage}
          onReleasePet={handleReleasePet}
          onClose={() => setIsPetStorageOpen(false)}
        />
      )}

      {/* Moves / Skills Manager Modal */}
      {moveManagerPet && (
        <MoveManagerModal
          pet={moveManagerPet}
          onSaveMoves={handleSaveMoves}
          onClose={() => setMoveManagerPet(null)}
        />
      )}

      {/* Evolution Animation Awakening Modal */}
      {evolutionData && (
        <EvolutionAnimationModal
          pet={evolutionData.pet}
          fromSpeciesId={evolutionData.fromSpeciesId}
          toSpeciesId={evolutionData.toSpeciesId}
          onClose={() => setEvolutionData(null)}
        />
      )}

      {/* Mailbox Modal */}
      {isMailboxOpen && (
        <MailboxModal
          mails={mails}
          onClaimMail={handleClaimMail}
          onClaimAllMails={handleClaimAllMails}
          onDeleteReadMails={handleDeleteReadMails}
          onClose={() => setIsMailboxOpen(false)}
        />
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal
          myPlayerName={playerName}
          myCombatPower={myCombatPower}
          myDexCount={unlockedSpeciesIds.length}
          myLevel={myTopLevel}
          myLeaderSpeciesId={myLeaderSpeciesId}
          onPraiseLeader={handlePraiseLeader}
          hasPraisedToday={hasPraisedToday}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}

      {/* Guild / Alliance Modal */}
      {isGuildOpen && (
        <GuildModal
          guild={guild}
          onClaimSalary={handleClaimGuildSalary}
          onUpgradeGuildSkill={handleUpgradeGuildSkill}
          onClose={() => setIsGuildOpen(false)}
        />
      )}

      {/* Account & Cloud Sync Modal */}
      {isAuthOpen && (
        <AuthModal
          cloudAccount={cloudAccount}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onSyncUpload={handleSyncUpload}
          onSyncDownload={handleSyncDownload}
          onClose={() => setIsAuthOpen(false)}
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

      {/* Magic Wardrobe Salon & Character Dressing Modal */}
      {isWardrobeOpen && (
        <WardrobeModal
          currentOutfit={playerOutfit}
          unlockedOutfitIds={unlockedOutfitIds}
          playerCoins={playerCoins}
          playerDiamonds={playerDiamonds}
          onSaveOutfit={handleSaveOutfit}
          onUnlockOutfitItem={handleUnlockOutfitItem}
          onClose={() => setIsWardrobeOpen(false)}
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
