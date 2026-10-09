import React, { useState } from 'react';
import { ElementType, PetRarity, PetSpecies } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
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
} from 'lucide-react';

interface PokedexModalProps {
  unlockedSpeciesIds: string[];
  onClose: () => void;
  onClaimMilestoneReward?: (coins: number, ballId?: string) => void;
  claimedMilestones?: number[];
}

export const PokedexModal: React.FC<PokedexModalProps> = ({
  unlockedSpeciesIds,
  onClose,
  onClaimMilestoneReward,
  claimedMilestones = [],
}) => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(() => {
    // Select first unlocked species if available, or first in list
    const firstUnlocked = unlockedSpeciesIds[0];
    return firstUnlocked || Object.keys(PET_SPECIES)[0];
  });

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allSpeciesList = Object.values(PET_SPECIES);
  const totalCount = allSpeciesList.length;
  const unlockedCount = unlockedSpeciesIds.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Milestones: 3 pets, 6 pets, 10 pets, 16 pets
  const milestones = [
    { target: 3, label: '3只伙伴', coins: 1000, ball: 'gulu_mid' },
    { target: 6, label: '6只伙伴', coins: 2500, ball: 'gulu_high' },
    { target: 10, label: '10只伙伴', coins: 5000, ball: 'gulu_king' },
  ];

  // Filtering
  const filteredList = allSpeciesList.filter((sp) => {
    if (filterType !== 'ALL' && sp.type !== filterType) return false;
    if (filterRarity !== 'ALL' && sp.rarity !== filterRarity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const isUnlocked = unlockedSpeciesIds.includes(sp.id);
      if (isUnlocked && (sp.name.toLowerCase().includes(q) || sp.pokedexNum.includes(q))) {
        return true;
      }
      return false;
    }
    return true;
  });

  const selectedSpecies = PET_SPECIES[selectedSpeciesId] || allSpeciesList[0];
  const isSelectedUnlocked = unlockedSpeciesIds.includes(selectedSpecies.id);

  // Stat calculation for radar/bars
  const statTotal =
    selectedSpecies.baseStats.hp +
    selectedSpecies.baseStats.atk +
    selectedSpecies.baseStats.def +
    selectedSpecies.baseStats.spAtk +
    selectedSpecies.baseStats.spDef +
    selectedSpecies.baseStats.speed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[92vh] max-h-[820px] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 tracking-wide flex items-center gap-2">
                幻灵天地图鉴 <span className="text-xs text-slate-400 font-normal">Spirit Codex</span>
              </h2>
              <p className="text-xs text-slate-400">
                记录幻灵秘境全部天地幻灵 · 当前已解锁 {unlockedCount} / {totalCount} 尊 ({completionPercentage}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Progress Bar & Milestones */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex flex-col gap-1 w-44">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>图鉴收集度</span>
                  <span className="text-amber-300 font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones buttons */}
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
                      className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                        isClaimed
                          ? 'bg-slate-800/60 border-slate-700 text-slate-500 cursor-default'
                          : canClaim
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-amber-300 animate-pulse cursor-pointer shadow-md'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400 opacity-60'
                      }`}
                      title={canClaim ? `点击领取: ${m.coins} 灵石 + 灵契宝晶` : `需契约收服 ${m.target} 尊幻灵`}
                    >
                      <Gift className="w-3 h-3" />
                      <span>{m.label}</span>
                      {canClaim && <span>(可领)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Element Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <span className="text-slate-400 mr-1 shrink-0">属性:</span>
            {['ALL', 'FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE', 'ROCK'].map((el) => {
              const label =
                el === 'ALL'
                  ? '全部'
                  : el === 'FIRE'
                  ? '火'
                  : el === 'WATER'
                  ? '水'
                  : el === 'GRASS'
                  ? '木'
                  : el === 'ELECTRIC'
                  ? '雷'
                  : el === 'ICE'
                  ? '冰'
                  : '岩';
              const isActive = filterType === el;
              return (
                <button
                  key={el}
                  onClick={() => {
                    sound.playClick();
                    setFilterType(el);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Rarity & Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1">品阶:</span>
              {['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'].map((r) => {
                const label =
                  r === 'ALL'
                    ? '全部'
                    : r === 'COMMON'
                    ? '凡品'
                    : r === 'RARE'
                    ? '灵珍'
                    : r === 'EPIC'
                    ? '地煞'
                    : '传世';
                return (
                  <button
                    key={r}
                    onClick={() => {
                      sound.playClick();
                      setFilterRarity(r);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      filterRarity === r
                        ? 'bg-slate-200 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索已收服幻灵..."
                className="pl-8 pr-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-36 md:w-44"
              />
            </div>
          </div>
        </div>

        {/* Content Body: Split Screen (Left Grid / Right Inspect Sheet) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Pet Thumbnails Grid (5 cols on md) */}
          <div className="md:col-span-5 border-r border-slate-800 p-4 overflow-y-auto bg-slate-950/20">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredList.map((sp) => {
                const isUnlocked = unlockedSpeciesIds.includes(sp.id);
                const isSelected = selectedSpeciesId === sp.id;
                const elColor = ELEMENT_COLORS[sp.type];
                const rarityBadge = RARITY_BADGES[sp.rarity];

                return (
                  <button
                    key={sp.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSpeciesId(sp.id);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center justify-between min-h-[140px] transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                        : isUnlocked
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-600 hover:bg-slate-850'
                        : 'bg-slate-950/60 border-slate-900 opacity-60 hover:opacity-80'
                    }`}
                  >
                    {/* Top Row: Dex No. & Type / Lock */}
                    <div className="w-full flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 font-semibold">#{sp.pokedexNum}</span>
                      {isUnlocked ? (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${elColor.bg} ${elColor.text}`}>
                          {elColor.label}
                        </span>
                      ) : (
                        <Lock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>

                    {/* Pet Avatar or Silhouette */}
                    <div className="my-2 relative flex items-center justify-center">
                      {isUnlocked ? (
                        <PetAvatar speciesId={sp.id} size={58} />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-600">
                          <span className="text-2xl font-black font-mono select-none">?</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Name & Rarity */}
                    <div className="w-full text-center">
                      <div className="font-bold text-xs truncate text-white">
                        {isUnlocked ? sp.name : '未知宠物'}
                      </div>
                      {isUnlocked ? (
                        <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
                          {rarityBadge.stars} {rarityBadge.label}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-600 mt-0.5">未收服</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredList.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">没有找到符合条件的宠物档案</div>
            )}
          </div>

          {/* Right: Detailed Dossier (7 cols on md) */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-slate-900/60 flex flex-col justify-between">
            {isSelectedUnlocked ? (
              <div className="space-y-6">
                {/* Pet Hero Banner */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800">
                  <div className="relative p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center">
                    <PetAvatar speciesId={selectedSpecies.id} size={110} />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                        #{selectedSpecies.pokedexNum}
                      </span>
                      <h3 className="text-2xl font-black text-white">{selectedSpecies.name}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          ELEMENT_COLORS[selectedSpecies.type].bg
                        } ${ELEMENT_COLORS[selectedSpecies.type].text} ${
                          ELEMENT_COLORS[selectedSpecies.type].border
                        } border`}
                      >
                        {ELEMENT_COLORS[selectedSpecies.type].label}系宠物
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          RARITY_BADGES[selectedSpecies.rarity].bg
                        } ${RARITY_BADGES[selectedSpecies.rarity].text} ${
                          RARITY_BADGES[selectedSpecies.rarity].border
                        } border`}
                      >
                        {RARITY_BADGES[selectedSpecies.rarity].stars} {RARITY_BADGES[selectedSpecies.rarity].label}
                      </span>
                    </div>

                    <p className="text-xs text-amber-200/90 font-medium">{selectedSpecies.title}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedSpecies.description}</p>
                  </div>
                </div>

                {/* Acquisition / Where to Catch */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Compass className="w-4 h-4" />
                    <span>获取方式与出没栖息地</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-6">{selectedSpecies.acquisitionMethod}</p>
                </div>

                {/* Evolution Chain */}
                {selectedSpecies.evolutionChain && selectedSpecies.evolutionChain.length > 1 && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                      <Sparkles className="w-4 h-4" />
                      <span>形态演化与进化路线</span>
                    </div>
                    <div className="flex items-center justify-around gap-2 pt-1">
                      {selectedSpecies.evolutionChain.map((node, idx) => {
                        const isNodeUnlocked = unlockedSpeciesIds.includes(node.speciesId);
                        const isCurrent = node.speciesId === selectedSpecies.id;
                        return (
                          <React.Fragment key={node.speciesId}>
                            {idx > 0 && (
                              <div className="flex flex-col items-center text-slate-500">
                                <ChevronRight className="w-5 h-5 text-amber-400/80" />
                                <span className="text-[10px] font-mono text-amber-300/80">Lv.{node.reqLevel}</span>
                              </div>
                            )}
                            <button
                              onClick={() => {
                                sound.playClick();
                                setSelectedSpeciesId(node.speciesId);
                              }}
                              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-purple-950/70 border-purple-400 text-purple-200 shadow-md ring-1 ring-purple-400'
                                  : isNodeUnlocked
                                  ? 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                  : 'bg-slate-950 border-slate-900 opacity-50'
                              }`}
                            >
                              {isNodeUnlocked ? (
                                <PetAvatar speciesId={node.speciesId} size={44} />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 font-bold">
                                  ?
                                </div>
                              )}
                              <span className="text-xs font-semibold">{isNodeUnlocked ? node.name : '???'}</span>
                              <span className="text-[10px] text-slate-400 font-mono">第{node.stage}形态</span>
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Base Stats Radar / Bars */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>种族天赋属性面板 (Base Stats)</span>
                    </div>
                    <span className="font-mono text-amber-300">综合种族值: {statTotal}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
                    {[
                      { label: '生命 (HP)', val: selectedSpecies.baseStats.hp, max: 120, color: 'bg-emerald-400' },
                      { label: '物攻 (ATK)', val: selectedSpecies.baseStats.atk, max: 120, color: 'bg-rose-400' },
                      { label: '物防 (DEF)', val: selectedSpecies.baseStats.def, max: 120, color: 'bg-amber-400' },
                      { label: '魔攻 (SP.ATK)', val: selectedSpecies.baseStats.spAtk, max: 120, color: 'bg-purple-400' },
                      { label: '魔防 (SP.DEF)', val: selectedSpecies.baseStats.spDef, max: 120, color: 'bg-blue-400' },
                      { label: '速度 (SPD)', val: selectedSpecies.baseStats.speed, max: 120, color: 'bg-cyan-400' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-slate-300 text-[11px]">
                          <span>{stat.label}</span>
                          <span className="font-bold text-white">{stat.val}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${stat.color} rounded-full`}
                            style={{ width: `${Math.min(100, (stat.val / stat.max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Pool / Learnable Moves */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Sword className="w-4 h-4" />
                    <span>招式技能池 (Learnable Moves)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {selectedSpecies.learnableMoves.map((lm) => {
                      const move = MOVES_DATA[lm.moveId];
                      if (!move) return null;
                      const elColor = ELEMENT_COLORS[move.type];
                      return (
                        <div
                          key={lm.moveId}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white flex items-center gap-1.5">
                              <span className="text-[10px] text-amber-400 font-mono">Lv.{lm.level}</span>
                              {move.name}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${elColor.bg} ${elColor.text}`}
                            >
                              {elColor.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                            <span>威力 {move.power || '-'}</span>
                            <span>PP {move.maxPp}</span>
                            <span className="text-[10px] text-slate-500">
                              {move.category === 'PHYSICAL' ? '物攻' : move.category === 'SPECIAL' ? '魔攻' : '变化'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{move.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Locked State Silhouette Message
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-24 h-24 rounded-full bg-slate-800/80 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
                  <Lock className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-400">尚未收服该幻灵</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    该幻灵的详细档案与神技信息处于封印状态。探索云梦古原、苍炎熔渊或星辰碧海，使用灵契晶石缔约捕获即可解锁永久档案！
                  </p>
                </div>
                <div className="text-xs font-mono text-amber-400/80 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                  图鉴编号: #{selectedSpecies.pokedexNum} · 属性: {ELEMENT_COLORS[selectedSpecies.type].label}系
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
