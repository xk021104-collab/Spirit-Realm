export type ElementType = 'FIRE' | 'WATER' | 'GRASS' | 'ELECTRIC' | 'NORMAL' | 'ICE' | 'ROCK';

export type BattleWeather = 'CLEAR' | 'SUNNY' | 'RAIN' | 'SANDSTORM' | 'THUNDER';

export interface WeatherState {
  weather: BattleWeather;
  turnsLeft: number;
}

export type PetRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Move {
  id: string;
  name: string;
  type: ElementType;
  category: 'PHYSICAL' | 'SPECIAL' | 'STATUS';
  power: number;
  accuracy: number;
  maxPp: number;
  description: string;
  effect?: {
    type: 'HEAL' | 'BUFF' | 'DEBUFF' | 'BURN' | 'SLEEP' | 'PARALYZE';
    target: 'SELF' | 'OPPONENT';
    stat?: 'atk' | 'def' | 'spAtk' | 'spDef' | 'speed';
    amount?: number;
    chance?: number;
  };
}

export interface PetSpecies {
  id: string;
  pokedexNum: string;
  name: string;
  title: string;
  type: ElementType;
  rarity: PetRarity;
  description: string;
  acquisitionMethod: string;
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
  learnableMoves: { level: number; moveId: string }[];
  evolutionLevel?: number;
  evolvesTo?: string;
  evolvesFrom?: string;
  starter?: boolean;
  habitat: SceneId[];
  evolutionChain?: { stage: number; speciesId: string; name: string; reqLevel?: number }[];
}

export interface ActivePetMove {
  id: string;
  pp: number;
  maxPp: number;
}

export interface PetInstance {
  uid: string;
  speciesId: string;
  nickname: string;
  level: number;
  exp: number;
  maxExp: number;
  currentHp: number;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
  moves: ActivePetMove[];
  statusEffect: null | 'BURN' | 'SLEEP' | 'PARALYZE';
  statusTurns: number;
  nature: string;
  statStages: {
    atk: number;
    def: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
  talentScore?: number;
  isShiny?: boolean;
  learnedMoveIds?: string[];
}

export interface Item {
  id: string;
  name: string;
  category: 'BALL' | 'POTION' | 'PP' | 'REVIVE' | 'CULTIVATION';
  price: number;
  sellPrice?: number;
  description: string;
  catchMultiplier?: number;
  healHp?: number;
  healPp?: number;
  isRevive?: boolean;
  isGuaranteed?: boolean;
}

export interface InventorySlot {
  itemId: string;
  count: number;
}

export type SceneId = 'ACADEMY' | 'PRAIRIE' | 'VOLCANO' | 'BAY' | 'HOSPITAL' | 'SHOP' | 'ARENA';

export interface SceneConfig {
  id: SceneId;
  name: string;
  region: string;
  description: string;
  themeColor: string;
  wildPets: { speciesId: string; minLevel: number; maxLevel: number; chance: number }[];
  npcs: {
    id: string;
    name: string;
    role: string;
    x: number;
    y: number;
    avatarSvg: string;
    dialogue: string[];
    actionType?: 'HEAL' | 'SHOP' | 'ARENA_CHALLENGE' | 'STARTER_GIFT';
  }[];
  chests: {
    id: string;
    x: number;
    y: number;
    coins: number;
    itemId?: string;
    itemCount?: number;
  }[];
}

export interface WildPetSpawn {
  uid: string;
  speciesId: string;
  level: number;
  x: number;
  y: number;
  direction: 1 | -1;
}

export interface PlayerProfile {
  name: string;
  title: string;
  coins: number;
  badges: string[];
  dexCaughtIds: string[];
  dexSeenIds: string[];
}

export type QuestStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED' | 'CLAIMED';

export type QuestTargetType =
  | 'CHOOSE_STARTER'
  | 'WIN_WILD_BATTLE'
  | 'CATCH_PET'
  | 'HEAL_PET'
  | 'BUY_SHOP_ITEM'
  | 'EVOLVE_PET'
  | 'WIN_ARENA_CHALLENGE';

export interface Quest {
  id: string;
  order: number;
  title: string;
  chapter: string;
  description: string;
  targetType: QuestTargetType;
  targetCount: number;
  currentCount: number;
  status: QuestStatus;
  targetLocationName: string;
  targetLocationId: SceneId;
  hint: string;
  rewards: {
    coins: number;
    items?: { itemId: string; count: number }[];
    badge?: string;
  };
}

export interface FriendPetInfo {
  speciesId: string;
  nickname: string;
  level: number;
}

export type FriendAvatarStyle = 'fairy' | 'swordsman' | 'scholar' | 'taoist' | 'wizard' | 'knight';

export interface Friend {
  id: string;
  name: string;
  title: string;
  level: number;
  avatarStyle: FriendAvatarStyle;
  locationId: SceneId;
  locationName: string;
  signature: string;
  greeting: string;
  companionPet: FriendPetInfo;
  hasGiftedToday: boolean;       // Have we sent shards to this friend today?
  canClaimFromFriend: boolean;   // Has this friend sent shards to us today to claim?
  isFollowingInScene: boolean;   // Whether this friend and pet are currently accompanying the player in the realm scene
  x?: number;                    // Optional coordinate percentage in scene (20-80)
  y?: number;
}

export interface GameMail {
  id: string;
  title: string;
  sender?: string;
  content: string;
  sentAt: string;
  isRead?: boolean;
  isClaimed: boolean;
  rewards: {
    coins?: number;
    gems?: number;
    items?: { itemId: string; count: number }[];
    petSpeciesId?: string;
    pet?: PetInstance;
  };
}

export interface GuildSkill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  cost: number;
  effectStat?: 'hp' | 'atk' | 'def' | 'spAtk' | 'spDef' | 'speed';
  bonusPerLevel: number;
  bonusType?: string;
  bonusValue?: number;
}

export interface GuildInfo {
  id: string;
  name: string;
  level: number;
  leaderName: string;
  notice: string;
  memberCount: number;
  maxMembers: number;
  totalFunds: number;
  exp?: number;
  maxExp?: number;
  playerRole?: 'LEADER' | 'ELDER' | 'MEMBER';
  playerDevotion: number; // 玩家个人贡献点
  hasClaimedSalaryToday: boolean;
  skills: GuildSkill[];
}

export interface ChatMessage {
  id: string;
  senderId?: string;
  senderName: string;
  senderTitle?: string;
  content: string;
  timestamp: string | number;
  channel: 'WORLD' | 'SYSTEM' | 'SCENE';
  isMarquee?: boolean;
  isSystem?: boolean;
}

export interface LeaderboardItem {
  rank: number;
  playerId: string;
  playerName: string;
  playerTitle: string;
  score: number;
  level: number;
  avatarPetSpeciesId: string;
  vipLevel?: number;
}

export interface CloudAccount {
  username: string;
  token?: string | null;
  isLoggedIn?: boolean;
  isCloudLoggedIn?: boolean;
  lastSyncTime?: string | null;
  lastSyncedAt?: string;
}

export type OutfitSlot = 'HAT' | 'HAIR' | 'ROBE' | 'HANDHELD' | 'WINGS' | 'AURA';

export interface OutfitItem {
  id: string;
  name: string;
  slot: OutfitSlot;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  priceCoins?: number;
  priceDiamonds?: number;
  bonusText?: string;
  unlockedByDefault?: boolean;
  colors?: {
    primary: string;
    secondary: string;
    accent?: string;
  };
}

export interface CharacterOutfit {
  hatId: string;
  hairId: string;
  robeId: string;
  handheldId: string;
  wingsId: string;
  auraId: string;
}

export interface OutfitPreset {
  id: string;
  name: string;
  description: string;
  outfit: CharacterOutfit;
  themeColor: string;
}


