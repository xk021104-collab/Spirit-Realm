import React, { useState, useMemo } from 'react';
import { ElementType, PetRarity, PetSpecies } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { ArtGalleryModal } from './ArtGalleryModal';
import { PokedexBackground, CelestialAtmosphereMode } from './PokedexBackground';
import { sound } from '../utils/audio';
import {
  BookOpen,
  Search,
  Lock,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  Zap,
  Sword,
  Heart,
  Compass,
  X,
  Gift,
  Flame,
  Droplets,
  Trees,
  Mountain,
  Snowflake,
  Wind,
  CheckCircle2,
  Filter,
  Cloud,
} from 'lucide-react';

interface PokedexModalProps {
  unlockedSpeciesIds: string[];
  onClose: () => void;
  onClaimMilestoneReward?: (coins: number, ballId?: string) => void;
  claimedMilestones?: number[];
}

// 5 Core Elements + Extras for comprehensive taxonomy
type ElementFilterKey = 'ALL' | 'FIRE' | 'WATER' | 'GRASS' | 'ELECTRIC' | 'ROCK' | 'ICE' | 'NORMAL';

interface ElementTabConfig {
  key: ElementFilterKey;
  label: string;
  subLabel: string;
  icon: React.FC<{ className?: string }>;
  colorClass: {
    active: string;
    inactive: string;
    badge: string;
    glow: string;
  };
}

const ELEMENT_TABS: ElementTabConfig[] = [
  {
    key: 'ALL',
    label: '全部',
    subLabel: '诸天全灵',
    icon: Sparkles,
    colorClass: {
      active: 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    },
  },
  {
    key: 'FIRE',
    label: '火系',
    subLabel: '炽焱焚天',
    icon: Flame,
    colorClass: {
      active: 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-orange-300 shadow-orange-500/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-red-500/20 text-red-400 border-red-500/40',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    },
  },
  {
    key: 'WATER',
    label: '水系',
    subLabel: '瀚海惊涛',
    icon: Droplets,
    colorClass: {
      active: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-cyan-500/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    },
  },
  {
    key: 'GRASS',
    label: '木系',
    subLabel: '苍木生息',
    icon: Trees,
    colorClass: {
      active: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-300 shadow-emerald-500/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    },
  },
  {
    key: 'ELECTRIC',
    label: '雷系',
    subLabel: '万劫神雷',
    icon: Zap,
    colorClass: {
      active: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow-yellow-500/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    },
  },
  {
    key: 'ROCK',
    label: '土系',
    subLabel: '厚土磐石',
    icon: Mountain,
    colorClass: {
      active: 'bg-gradient-to-r from-amber-700 to-stone-600 text-white border-stone-300 shadow-amber-800/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
      glow: 'shadow-[0_0_15px_rgba(120,113,108,0.5)]',
    },
  },
  {
    key: 'ICE',
    label: '冰系',
    subLabel: '极寒玄冰',
    icon: Snowflake,
    colorClass: {
      active: 'bg-gradient-to-r from-sky-400 to-cyan-500 text-slate-950 border-sky-200 shadow-sky-400/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      glow: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
    },
  },
  {
    key: 'NORMAL',
    label: '风/凡系',
    subLabel: '随风而动',
    icon: Wind,
    colorClass: {
      active: 'bg-gradient-to-r from-slate-500 to-slate-700 text-white border-slate-300 shadow-slate-500/40',
      inactive: 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750',
      badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      glow: 'shadow-[0_0_15px_rgba(100,116,139,0.5)]',
    },
  },
];

export const PokedexModal: React.FC<PokedexModalProps> = ({
  unlockedSpeciesIds,
  onClose,
  onClaimMilestoneReward,
  claimedMilestones = [],
}) => {
  const allSpeciesList = useMemo(() => Object.values(PET_SPECIES), []);

  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(() => {
    const firstUnlocked = unlockedSpeciesIds[0];
    return firstUnlocked || (allSpeciesList[0] ? allSpeciesList[0].id : 'chiyanque');
  });

  const [activeElementTab, setActiveElementTab] = useState<ElementFilterKey>('ALL');
  const [collectionFilter, setCollectionFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGallerySpeciesId, setShowGallerySpeciesId] = useState<string | null>(null);
  const [atmosphereMode, setAtmosphereMode] = useState<CelestialAtmosphereMode>('PURPLE_MIST');

  const totalCount = allSpeciesList.length;
  const unlockedCount = unlockedSpeciesIds.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Element species count map for badges
  const elementCounts = useMemo(() => {
    const counts: Record<string, { total: number; unlocked: number }> = {
      ALL: { total: totalCount, unlocked: unlockedCount },
    };
    ELEMENT_TABS.forEach((t) => {
      if (t.key !== 'ALL') {
        const forType = allSpeciesList.filter((sp) => sp.type === t.key);
        const unlockedForType = forType.filter((sp) => unlockedSpeciesIds.includes(sp.id));
        counts[t.key] = {
          total: forType.length,
          unlocked: unlockedForType.length,
        };
      }
    });
    return counts;
  }, [allSpeciesList, unlockedSpeciesIds, totalCount, unlockedCount]);

  // Milestones: 3 pets, 6 pets, 10 pets
  const milestones = [
    { target: 3, label: '3只伙伴', coins: 1000, ball: 'gulu_mid' },
    { target: 6, label: '6只伙伴', coins: 2500, ball: 'gulu_high' },
    { target: 10, label: '10只伙伴', coins: 5000, ball: 'gulu_king' },
  ];

  // Filtering list
  const filteredList = useMemo(() => {
    return allSpeciesList.filter((sp) => {
      // 1. Element Tab Filter (火、水、木、雷、土)
      if (activeElementTab !== 'ALL' && sp.type !== activeElementTab) {
        return false;
      }

      // 2. Collection status filter
      const isUnlocked = unlockedSpeciesIds.includes(sp.id);
      if (collectionFilter === 'UNLOCKED' && !isUnlocked) return false;
      if (collectionFilter === 'LOCKED' && isUnlocked) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (isUnlocked) {
          return sp.name.toLowerCase().includes(q) || sp.pokedexNum.includes(q) || sp.title.includes(q);
        } else {
          return sp.pokedexNum.includes(q);
        }
      }

      return true;
    });
  }, [allSpeciesList, activeElementTab, collectionFilter, searchQuery, unlockedSpeciesIds]);

  const selectedSpecies = PET_SPECIES[selectedSpeciesId] || allSpeciesList[0];
  const isSelectedUnlocked = unlockedSpeciesIds.includes(selectedSpecies.id);

  // Stat calculation
  const statTotal =
    selectedSpecies.baseStats.hp +
    selectedSpecies.baseStats.atk +
    selectedSpecies.baseStats.def +
    selectedSpecies.baseStats.spAtk +
    selectedSpecies.baseStats.spDef +
    selectedSpecies.baseStats.speed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in duration-200">
      {/* Outer Celestial Grimoire Modal Box */}
      <div className="bg-[#070b18]/95 border-2 border-indigo-500/40 rounded-3xl w-full max-w-6xl h-[94vh] max-h-[820px] flex flex-col shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden text-slate-100 relative">
        {/* Dynamic Eastern Xianxia Blue-Violet Misty Clouds Background */}
        <PokedexBackground activeElementType={activeElementTab} atmosphereMode={atmosphereMode} />

        {/* 1. Header Bar: Title, Collection Progress, Atmosphere Mode Switcher, Milestones & Close */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950/75 backdrop-blur-md border-b border-indigo-500/30 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 border border-indigo-300/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-amber-200 tracking-wide game-title-font">
                  诸天幻灵图鉴 · 乾坤灵物志
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded font-mono font-medium">
                  Celestial Codex
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                <span>契约诸天万物灵兽，勘破太古演变真形</span>
                <span className="text-indigo-400">·</span>
                <span className="text-cyan-300 font-mono font-medium">
                  已收录 {unlockedCount} / {totalCount} 尊 ({completionPercentage}%)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Xianxia Atmosphere Mood Switcher (古风仙境天象切换) */}
            <div className="hidden md:flex items-center gap-1 bg-[#060a1e]/80 border border-indigo-500/30 rounded-xl p-1 shadow-inner">
              <span className="text-[10px] text-indigo-300 font-bold px-1.5 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-cyan-300" />
                <span>天象:</span>
              </span>
              {[
                { key: 'PURPLE_MIST' as const, label: '紫霄云海' },
                { key: 'STARRY_NIGHT' as const, label: '幽夜星河' },
                { key: 'CYAN_AURORA' as const, label: '青冥仙光' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    sound.playClick();
                    setAtmosphereMode(m.key);
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    atmosphereMode === m.key
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] border border-indigo-300/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Progress & Milestone Claim Bar */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="flex flex-col gap-1 w-36">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>总收集度</span>
                  <span className="text-cyan-300 font-medium">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="flex items-center gap-1.5">
                {milestones.map((m) => {
                  const isClaimed = claimedMilestones.includes(m.target);
                  const canClaim = unlockedCount >= m.target && !isClaimed;
                  return (
                    <button
                      key={m.target}
                      disabled={!canClaim}
                      onClick={() => {
                        sound.playCatchSuccess();
                        onClaimMilestoneReward?.(m.coins, m.ball);
                      }}
                      className={`text-[10px] px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                        isClaimed
                          ? 'bg-slate-800/40 border-slate-700 text-slate-500 cursor-default'
                          : canClaim
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-amber-300 animate-pulse cursor-pointer shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
                      }`}
                      title={canClaim ? `领取奖励: ${m.coins} 灵石 + 灵晶` : `需收服 ${m.target} 尊幻灵`}
                    >
                      <Gift className="w-3 h-3" />
                      <span>{m.label}</span>
                      {canClaim && <span className="text-[9px] font-black">(领)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 transition-colors cursor-pointer border border-slate-700 hover:border-rose-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Primary Elemental Category Tabs Bar (火、水、木、雷、土 分类标签系统) */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#080d24]/75 backdrop-blur-md border-b border-indigo-500/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 z-10">
          {/* Scrollable Element Buttons with Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            <span className="text-indigo-300 text-xs font-medium mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>属性灵脉:</span>
            </span>

            {ELEMENT_TABS.map((tab) => {
              const isActive = activeElementTab === tab.key;
              const IconComp = tab.icon;
              const countInfo = elementCounts[tab.key] || { total: 0, unlocked: 0 };

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    sound.playClick();
                    setActiveElementTab(tab.key);
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? `${tab.colorClass.active} ${tab.colorClass.glow} scale-105 z-10`
                      : `${tab.colorClass.inactive} hover:scale-102`
                  }`}
                  title={`${tab.label} · ${tab.subLabel} (已收服 ${countInfo.unlocked}/${countInfo.total})`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? '' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1 py-0.2 rounded-full border ${
                      isActive ? 'bg-black/30 border-white/20 text-white' : 'bg-black/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    {countInfo.unlocked}/{countInfo.total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter: Collection Status & Search Bar */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            {/* Unlocked status toggle */}
            <div className="flex items-center bg-[#070b1e]/85 border border-indigo-500/30 rounded-xl p-0.5 text-xs">
              {(
                [
                  { key: 'ALL', label: '全部' },
                  { key: 'UNLOCKED', label: '已收服' },
                  { key: 'LOCKED', label: '未解锁' },
                ] as const
              ).map((st) => (
                <button
                  key={st.key}
                  onClick={() => {
                    sound.playClick();
                    setCollectionFilter(st.key);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                    collectionFilter === st.key
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-indigo-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索名称 / 编号..."
                className="pl-8 pr-2.5 py-1 bg-[#060a1e]/80 border border-indigo-500/40 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-32 sm:w-40"
              />
            </div>
          </div>
        </div>

        {/* 3. Main Workspace: Split View (Left: Spirit Cards Grid, Right: Spirit Inspector) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-transparent z-10">
          {/* Left Column: Collectible Spirits Grid (md:col-span-5 lg:col-span-6) */}
          <div className="md:col-span-6 lg:col-span-6 border-r border-indigo-500/25 p-3 sm:p-4 overflow-y-auto scrollbar-thin bg-[#060a1e]/60 backdrop-blur-sm">
            {filteredList.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-2">
                <BookOpen className="w-10 h-10 text-indigo-400" />
                <p className="text-sm text-indigo-200">该属性灵脉下暂无匹配的幻灵伙伴</p>
                <button
                  onClick={() => {
                    setActiveElementTab('ALL');
                    setCollectionFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredList.map((sp) => {
                  const isUnlocked = unlockedSpeciesIds.includes(sp.id);
                  const isSelected = selectedSpeciesId === sp.id;
                  const elColor = ELEMENT_COLORS[sp.type] || ELEMENT_COLORS.NORMAL;
                  const rarityBadge = RARITY_BADGES[sp.rarity];

                  return (
                    <button
                      key={sp.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedSpeciesId(sp.id);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-between min-h-[145px] transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-950/80 to-purple-950/80 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/60'
                          : isUnlocked
                          ? 'bg-[#0b1333]/70 backdrop-blur-md border-indigo-900/60 hover:border-amber-400/60 hover:bg-[#121b44]/80'
                          : 'bg-[#060918]/60 border-slate-900/80 opacity-55 hover:opacity-85'
                      }`}
                    >
                      {/* Top Row: Dex No. & Type Badge */}
                      <div className="w-full flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 font-bold">#{sp.pokedexNum}</span>
                        {isUnlocked ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${elColor.bg} ${elColor.text} ${elColor.border}`}
                          >
                            {elColor.label}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Lock className="w-3 h-3" />
                            <span>未解锁</span>
                          </div>
                        )}
                      </div>

                      {/* Pet Avatar Sprite / Silhouette */}
                      <div className="my-2 relative flex items-center justify-center">
                        {isUnlocked ? (
                          <div className="relative group-hover:scale-105 transition-transform">
                            <PetAvatar speciesId={sp.id} size={58} />
                            {/* Subtle Element Glow under sprite */}
                            <div className="w-12 h-3 rounded-full bg-amber-400/20 blur-xs mx-auto -mt-1" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                            <span className="text-2xl font-black font-mono select-none">?</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: Name & Rarity */}
                      <div className="w-full text-center">
                        <div
                          className={`text-xs font-black truncate game-title-font ${
                            isSelected ? 'text-amber-300' : isUnlocked ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          {isUnlocked ? sp.name : '神秘灵兽'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                          {isUnlocked ? (
                            <span className={rarityBadge.text}>{rarityBadge.stars} {rarityBadge.label}</span>
                          ) : (
                            <span>探索秘境收服</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Detailed Spirit Inspector Sheet (md:col-span-6) */}
          <div className="md:col-span-6 lg:col-span-6 p-4 sm:p-6 overflow-y-auto scrollbar-thin bg-gradient-to-b from-slate-900/60 to-slate-950/80 flex flex-col justify-between">
            {selectedSpecies && (
              <div className="space-y-4">
                {/* Header: Title, Dex Num, Rarity & Element */}
                <div className="flex items-start justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-bold">
                        NO. {selectedSpecies.pokedexNum}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          ELEMENT_COLORS[selectedSpecies.type].bg
                        } ${ELEMENT_COLORS[selectedSpecies.type].text} ${
                          ELEMENT_COLORS[selectedSpecies.type].border
                        }`}
                      >
                        {ELEMENT_COLORS[selectedSpecies.type].label}系幻灵
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          RARITY_BADGES[selectedSpecies.rarity].bg
                        } ${RARITY_BADGES[selectedSpecies.rarity].text} ${
                          RARITY_BADGES[selectedSpecies.rarity].border
                        }`}
                      >
                        {RARITY_BADGES[selectedSpecies.rarity].label}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-amber-300 mt-1 game-title-font flex items-center gap-2">
                      <span>{isSelectedUnlocked ? selectedSpecies.name : '？？？ (未解封)'}</span>
                      <span className="text-xs text-slate-400 font-normal">[{selectedSpecies.title}]</span>
                    </h3>
                  </div>

                  {isSelectedUnlocked && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>已收录</span>
                    </div>
                  )}
                </div>

                {/* Central Pet Showcase Pedestal */}
                <div className="relative py-6 flex flex-col items-center justify-center bg-radial from-slate-800/40 via-transparent to-transparent rounded-2xl border border-slate-800/80 overflow-hidden">
                  {/* Decorative rotating pedestal ring */}
                  <div className="absolute w-48 h-16 border-2 border-amber-400/40 rounded-full bottom-4 rotate-x-60 animate-pulse" />
                  <div className="absolute w-36 h-12 bg-amber-500/10 rounded-full bottom-6 blur-xs" />

                  {isSelectedUnlocked ? (
                    <div
                      onClick={() => setShowGallerySpeciesId(selectedSpecies.id)}
                      className="relative z-10 transition-transform duration-300 hover:scale-110 cursor-pointer group flex flex-col items-center"
                      title="点击展开全景高精立绘鉴赏"
                    >
                      <PetAvatar speciesId={selectedSpecies.id} size={110} />
                      <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-[11px] text-amber-300 font-bold group-hover:border-amber-400 group-hover:bg-amber-500/20 transition-all shadow-md">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        <span>全景高精立绘鉴赏</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center py-4">
                      <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 mb-2">
                        <Lock className="w-8 h-8" />
                      </div>
                      <span className="text-xs text-slate-400">灵晶封印中 · 前往场景探索捕捉</span>
                    </div>
                  )}

                  {/* Lore Quote */}
                  <p className="mt-4 px-6 text-center text-xs text-slate-300 leading-relaxed italic">
                    "{selectedSpecies.description}"
                  </p>
                </div>

                {/* Base Stats Radar / Gauge */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>天地种族值资质</span>
                    </span>
                    <span className="font-mono text-amber-300">
                      种族总和: <strong className="text-sm font-black">{statTotal}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {[
                      { label: '生命 HP', val: selectedSpecies.baseStats.hp, max: 130, color: 'from-rose-500 to-rose-400' },
                      { label: '物攻 ATK', val: selectedSpecies.baseStats.atk, max: 140, color: 'from-amber-500 to-orange-400' },
                      { label: '物防 DEF', val: selectedSpecies.baseStats.def, max: 130, color: 'from-blue-500 to-cyan-400' },
                      { label: '特攻 SP.ATK', val: selectedSpecies.baseStats.spAtk, max: 150, color: 'from-purple-500 to-indigo-400' },
                      { label: '特防 SP.DEF', val: selectedSpecies.baseStats.spDef, max: 130, color: 'from-teal-500 to-emerald-400' },
                      { label: '速度 SPEED', val: selectedSpecies.baseStats.speed, max: 130, color: 'from-yellow-400 to-amber-300' },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>{stat.label}</span>
                          <span className="font-bold text-white">{stat.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(100, (stat.val / stat.max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Natural Signature Moves */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Sword className="w-3.5 h-3.5" />
                    <span>本命传承招式</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedSpecies.learnableMoves.slice(0, 4).map((lm) => {
                      const mv = MOVES_DATA[lm.moveId];
                      if (!mv) return null;
                      const mvColor = ELEMENT_COLORS[mv.type] || ELEMENT_COLORS.NORMAL;

                      return (
                        <div key={lm.moveId} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{mv.name}</span>
                            <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${mvColor.bg} ${mvColor.text}`}>
                              {mvColor.label}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>威力: {mv.power > 0 ? mv.power : '-'}</span>
                            <span>PP: {mv.maxPp}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{mv.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Acquisition Guide */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                  <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-0.5">契约机缘与栖息地：</strong>
                    <span>{selectedSpecies.acquisitionMethod}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full HD Eastern Fantasy Illustration Gallery Popup */}
      {showGallerySpeciesId && (
        <ArtGalleryModal
          initialSpeciesId={showGallerySpeciesId}
          onClose={() => setShowGallerySpeciesId(null)}
        />
      )}
    </div>
  );
};
