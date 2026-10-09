import React, { useState } from 'react';
import { ElementType, PetSpecies } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { sound } from '../utils/audio';
import {
  X,
  Sparkles,
  Flame,
  Droplets,
  Trees,
  Shield,
  Zap,
  Sword,
  Heart,
  Eye,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';

interface ArtGalleryModalProps {
  initialSpeciesId?: string;
  onClose: () => void;
}

// 3 Starter Lineage definitions
const STARTER_LINEAGES = [
  {
    id: 'FIRE_LINE',
    name: '炽焱玄羽脉',
    element: 'FIRE' as ElementType,
    speciesIds: ['chiyanque', 'zhuoyuying', 'fentianhuang'],
    sealName: '朱雀神火印',
    themeColor: 'from-orange-500/20 via-red-500/10 to-transparent',
    borderColor: 'border-orange-500/40',
    accentText: 'text-orange-400',
    icon: Flame,
    quote: '浴火九重涅槃生，双翼遮天万界明。',
  },
  {
    id: 'WATER_LINE',
    name: '星辰瀚海脉',
    element: 'WATER' as ElementType,
    speciesIds: ['bishuiling', 'yuanchaoshou', 'huanhailingzun'],
    sealName: '沧海龙尊印',
    themeColor: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderColor: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    icon: Droplets,
    quote: '浩瀚澄波凝水魄，神龙覆海镇乾坤。',
  },
  {
    id: 'GRASS_LINE',
    name: '苍木万灵脉',
    element: 'GRASS' as ElementType,
    speciesIds: ['qingmulu', 'feicuijiaolu', 'canglinshenzun'],
    sealName: '太古森皇印',
    themeColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    icon: Trees,
    quote: '太古建木生灵角，白羽踏云天地春。',
  },
];

export const ArtGalleryModal: React.FC<ArtGalleryModalProps> = ({
  initialSpeciesId = 'chiyanque',
  onClose,
}) => {
  // Find which lineage contains initialSpeciesId
  const initialLineIndex = Math.max(
    0,
    STARTER_LINEAGES.findIndex((l) => l.speciesIds.includes(initialSpeciesId))
  );

  const [activeLineIndex, setActiveLineIndex] = useState<number>(initialLineIndex);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(initialSpeciesId);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const activeLine = STARTER_LINEAGES[activeLineIndex];
  const species = PET_SPECIES[selectedSpeciesId] || PET_SPECIES['chiyanque'];
  const rarityBadge = RARITY_BADGES[species.rarity];
  const elColor = ELEMENT_COLORS[species.type];

  const handleSelectLine = (index: number) => {
    sound.playClick();
    setActiveLineIndex(index);
    setSelectedSpeciesId(STARTER_LINEAGES[index].speciesIds[0]);
  };

  const handleSelectSpecies = (spId: string) => {
    sound.playClick();
    setSelectedSpeciesId(spId);
  };

  const triggerStanceAnim = () => {
    sound.playClick();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 via-[#070b18] to-slate-950 border border-amber-500/40 flex flex-col">
        {/* Eastern Corner Ornaments */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between px-5 py-3.5 border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-wider game-title-font flex items-center gap-2">
                <span>御三家 · 东方奇幻高精立绘鉴赏</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/30 font-normal">
                  神灵画卷
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                幻灵秘境古法秘录 · 气贯长虹之太古法相
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lineage Selector Tabs */}
        <div className="relative z-10 px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto">
          {STARTER_LINEAGES.map((line, idx) => {
            const Icon = line.icon;
            const isSelected = idx === activeLineIndex;
            return (
              <button
                key={line.id}
                onClick={() => handleSelectLine(idx)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  isSelected
                    ? `${line.borderColor} bg-slate-800/90 ${line.accentText} shadow-lg shadow-black/40 scale-105`
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? line.accentText : 'text-slate-500'}`} />
                <span>{line.name}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">[{line.sealName}]</span>
              </button>
            );
          })}
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left/Center: Massive Visual Showcase Canvas (lg:col-span-7) */}
          <div className="lg:col-span-7 relative p-6 flex flex-col justify-between items-center bg-radial from-slate-850/30 via-slate-950/80 to-slate-950 overflow-hidden">
            {/* Background Atmosphere Layers */}
            <div className={`absolute inset-0 bg-gradient-to-t ${activeLine.themeColor} pointer-events-none`} />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-amber-500/15 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-400/20 border-dotted animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

            {/* Top Seal Stamp & Verse */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="px-3 py-1 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>法相编号 #{species.pokedexNum}</span>
              </div>

              {/* Red Eastern Calligraphy Seal Box */}
              <div className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-600/70 text-rose-300 text-xs font-serif font-black tracking-widest shadow-[0_0_12px_rgba(225,29,72,0.4)]">
                {activeLine.sealName}
              </div>
            </div>

            {/* Central High-Definition Vector Masterpiece */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center">
              {/* Grand Pedestal Ring */}
              <div className="absolute bottom-2 w-72 h-20 rounded-full border-2 border-amber-400/30 bg-amber-500/5 rotate-x-60 animate-pulse pointer-events-none blur-2xs" />
              <div className="absolute bottom-0 w-84 h-24 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

              {/* The Masterpiece Sprite */}
              <div
                className={`relative transition-all duration-300 ${
                  isAnimating ? 'scale-115 animate-bounce' : 'hover:scale-105'
                }`}
              >
                <PetAvatar speciesId={species.id} size={230} />
              </div>

              {/* Interactive Stance Trigger */}
              <button
                onClick={triggerStanceAnim}
                className="mt-4 px-4 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-amber-500/30 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>法相战姿激荡</span>
              </button>
            </div>

            {/* Bottom Quote Banner */}
            <div className="w-full text-center z-10 py-2 px-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <p className="text-xs text-amber-200/90 font-serif italic tracking-wider">
                "{activeLine.quote}"
              </p>
            </div>
          </div>

          {/* Right: Evolution Chain & Lore Card (lg:col-span-5) */}
          <div className="lg:col-span-5 p-5 sm:p-6 overflow-y-auto scrollbar-thin bg-gradient-to-b from-slate-900/90 to-slate-950 border-t lg:border-t-0 lg:border-l border-amber-500/20 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Species Name & Badges */}
              <div className="border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold border ${elColor.bg} ${elColor.text} ${elColor.border}`}
                  >
                    {elColor.label}系灵兽
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold border ${rarityBadge.bg} ${rarityBadge.text} ${rarityBadge.border}`}
                  >
                    {rarityBadge.label} · {rarityBadge.stars}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-amber-300 game-title-font flex items-center justify-between">
                  <span>{species.name}</span>
                  <span className="text-xs text-slate-400 font-normal">[{species.title}]</span>
                </h3>
              </div>

              {/* 3 Evolution Stage Switcher Buttons */}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-2 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>蜕变进化脉络 (点击切换形态)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {activeLine.speciesIds.map((spId, sIdx) => {
                    const sp = PET_SPECIES[spId];
                    const isCurrent = spId === selectedSpeciesId;
                    const stageNames = ['一阶 · 初生雏灵', '二阶 · 飞腾化形', '三阶 · 至尊法相'];

                    return (
                      <button
                        key={spId}
                        onClick={() => handleSelectSpecies(spId)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/20 scale-102'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          <PetAvatar speciesId={spId} size={44} />
                        </div>
                        <div className="text-xs font-bold truncate w-full">{sp.name}</div>
                        <div className="text-[10px] text-slate-400">{stageNames[sIdx]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mythological Lore Description */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 block flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>万灵图志本纪</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {species.description}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                  <span>契约途径：</span>
                  <span className="text-amber-300/90 font-medium">{species.acquisitionMethod}</span>
                </div>
              </div>

              {/* Base Stats Radar Overview */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                  <span>天道资质种族值</span>
                  <span className="font-mono text-amber-300 font-bold">
                    总和{' '}
                    {species.baseStats.hp +
                      species.baseStats.atk +
                      species.baseStats.def +
                      species.baseStats.spAtk +
                      species.baseStats.spDef +
                      species.baseStats.speed}
                  </span>
                </span>

                <div className="space-y-1.5 text-xs font-mono">
                  {[
                    { label: '生命 (HP)', val: species.baseStats.hp, max: 120, col: 'bg-emerald-500' },
                    { label: '物攻 (ATK)', val: species.baseStats.atk, max: 120, col: 'bg-rose-500' },
                    { label: '特攻 (SP.A)', val: species.baseStats.spAtk, max: 120, col: 'bg-indigo-400' },
                    { label: '双抗 (DEF)', val: Math.round((species.baseStats.def + species.baseStats.spDef) / 2), max: 120, col: 'bg-amber-500' },
                    { label: '速度 (SPD)', val: species.baseStats.speed, max: 120, col: 'bg-sky-400' },
                  ].map((st) => (
                    <div key={st.label} className="flex items-center gap-2">
                      <span className="w-20 text-[11px] text-slate-400">{st.label}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${st.col} transition-all duration-500 rounded-full`}
                          style={{ width: `${Math.min(100, (st.val / st.max) * 100)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-bold text-slate-300 text-[11px]">{st.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all cursor-pointer text-center"
              >
                收纳画卷 · 返回秘境
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
