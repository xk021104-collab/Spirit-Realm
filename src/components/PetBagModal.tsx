import React, { useState } from 'react';
import { PetInstance } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { ArtGalleryModal } from './ArtGalleryModal';
import { sound } from '../utils/audio';
import { Backpack, Sparkles, Star, Heart, Zap, Sword, Shield, X, Check } from 'lucide-react';

interface PetBagModalProps {
  party: PetInstance[];
  activeLeaderIndex: number;
  onSetLeaderIndex: (index: number) => void;
  onClose: () => void;
}

export const PetBagModal: React.FC<PetBagModalProps> = ({
  party,
  activeLeaderIndex,
  onSetLeaderIndex,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(activeLeaderIndex);
  const [showGallerySpeciesId, setShowGallerySpeciesId] = useState<string | null>(null);
  const selectedPet = party[selectedIndex] || party[0];
  const species = selectedPet ? PET_SPECIES[selectedPet.speciesId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-4xl h-[86vh] max-h-[740px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#b8860b]/50 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] overflow-hidden text-slate-100">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Backpack className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  随行幻灵背包
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  灵伴
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest">— SPIRIT PARTY —</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">管理你的随行战队 · 当前随行伙伴 ({party.length} / 6)</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-medallion-btn text-amber-200 cursor-pointer"
            title="关闭背包"
          >
            <X className="w-5 h-5 text-amber-200 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </button>
        </div>

        {/* Content: Left 6-slot party list / Right Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Party 6 slots list */}
          <div className="md:col-span-5 border-r border-[#b8860b]/25 p-4 overflow-y-auto space-y-2 bg-[#040e1b]/60">
            {party.map((p, idx) => {
              const sp = PET_SPECIES[p.speciesId];
              const isSelected = selectedIndex === idx;
              const isLeader = activeLeaderIndex === idx;
              const elColor = ELEMENT_COLORS[sp.type];

              return (
                <button
                  key={p.uid}
                  onClick={() => {
                    sound.playClick();
                    setSelectedIndex(idx);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'roco-panel border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)] ring-1 ring-amber-400/50'
                      : 'bg-[#061426]/70 border-[#b8860b]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PetAvatar speciesId={p.speciesId} size={48} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{p.nickname}</span>
                        {isLeader && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-400 text-slate-950 roco-title-font">
                            首发随行
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-1">
                        <span className={`px-1.5 py-0.2 rounded font-bold ${elColor.bg} ${elColor.text}`}>
                          {elColor.label}
                        </span>
                        <span className="font-mono text-amber-300">Lv.{p.level}</span>
                        <span>{p.nature}</span>
                      </div>
                    </div>
                  </div>

                  {/* HP Indicator */}
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-300 font-bold">
                      {p.currentHp}/{p.stats.hp}
                    </span>
                    <div className="w-16 roco-gauge-track h-2 overflow-hidden mt-1">
                      <div
                        className="roco-gauge-hp"
                        style={{ width: `${(p.currentHp / p.stats.hp) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Pet Sheet */}
          {selectedPet && species && (
            <div className="md:col-span-7 p-6 overflow-y-auto bg-[#040e1b]/40 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Pet Header */}
                <div className="flex items-center justify-between p-4 rounded-2xl roco-panel border border-[#b8860b]/40 shadow-md">
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => setShowGallerySpeciesId(selectedPet.speciesId)}
                      className="cursor-pointer group relative transition-transform hover:scale-105"
                      title="点击展开全景高精立绘"
                    >
                      <PetAvatar speciesId={selectedPet.speciesId} size={80} />
                      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black shadow-xs flex items-center gap-0.5 roco-title-font border border-yellow-200">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>画卷</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white roco-title-font">{selectedPet.nickname}</h3>
                        <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40 font-bold">
                          Lv.{selectedPet.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {species.title} · 性格: {selectedPet.nature}
                      </p>
                    </div>
                  </div>

                  {activeLeaderIndex !== selectedIndex ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSetLeaderIndex(selectedIndex);
                      }}
                      className="roco-turn-capsule px-4 py-2 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-slate-950" />
                      <span>设为首发跟随</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-300 font-bold flex items-center gap-1 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-400/50 roco-title-font">
                      <Check className="w-3.5 h-3.5" />
                      <span>已首发随行</span>
                    </div>
                  )}
                </div>

                {/* HP & EXP Bars */}
                <div className="p-4 rounded-xl roco-panel border border-[#b8860b]/40 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-200 font-mono">
                      <span className="text-rose-400 font-bold font-mono">气血生命 (HP)</span>
                      <span className="font-bold">
                        {selectedPet.currentHp} / {selectedPet.stats.hp}
                      </span>
                    </div>
                    <div className="w-full roco-gauge-track h-3 overflow-hidden">
                      <div
                        className="roco-gauge-hp"
                        style={{ width: `${(selectedPet.currentHp / selectedPet.stats.hp) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-200 font-mono">
                      <span className="text-cyan-400 font-bold font-mono">修行经验 (EXP)</span>
                      <span className="font-bold">
                        {selectedPet.exp} / {selectedPet.maxExp}
                      </span>
                    </div>
                    <div className="w-full roco-gauge-track h-2.5 overflow-hidden">
                      <div
                        className="roco-gauge-mp"
                        style={{ width: `${Math.min(100, (selectedPet.exp / selectedPet.maxExp) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="p-4 rounded-xl roco-panel border border-[#b8860b]/40">
                  <div className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-1.5 roco-title-font">
                    <Shield className="w-3.5 h-3.5 text-amber-300" />
                    <span>实战数值属性</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 shadow-inner">
                      <div className="text-slate-400 text-[10px]">物攻 (ATK)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.atk}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 shadow-inner">
                      <div className="text-slate-400 text-[10px]">物防 (DEF)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.def}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 shadow-inner">
                      <div className="text-slate-400 text-[10px]">速度 (SPD)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.speed}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 shadow-inner">
                      <div className="text-slate-400 text-[10px]">魔攻 (SP.ATK)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.spAtk}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 shadow-inner">
                      <div className="text-slate-400 text-[10px]">魔防 (SP.DEF)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.spDef}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 shadow-inner">
                      <div className="text-slate-400 text-[10px]">形态</div>
                      <div className="text-amber-300 font-bold mt-0.5">
                        {species.evolutionLevel ? `进阶Lv.${species.evolutionLevel}` : '终极形态'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipped Moves */}
                <div className="p-4 rounded-xl roco-panel border border-[#b8860b]/40 space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 roco-title-font">
                    <Sword className="w-3.5 h-3.5 text-amber-300" />
                    <span>已装备灵技招式 (4/4)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPet.moves.map((m) => {
                      const mv = MOVES_DATA[m.id];
                      if (!mv) return null;
                      const elColor = ELEMENT_COLORS[mv.type];
                      return (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-xl bg-[#061426]/80 border border-[#b8860b]/30 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5 roco-title-font">
                              {mv.name}
                              <span className={`text-[9px] px-1 rounded ${elColor.bg} ${elColor.text}`}>
                                {elColor.label}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">威力 {mv.power || '-'}</div>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">
                            PP: {m.pp}/{m.maxPp}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
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
