import React, { useState } from 'react';
import { PetInstance } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
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
  const selectedPet = party[selectedIndex] || party[0];
  const species = selectedPet ? PET_SPECIES[selectedPet.speciesId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200">
      <div className="flash-frame rounded-3xl w-full max-w-4xl h-[86vh] max-h-[740px] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b-2 border-amber-500/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Backpack className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 tracking-wide flex items-center gap-2 game-title-font">
                随行幻灵背包 <span className="text-xs text-slate-400 font-normal">Spirit Party</span>
              </h2>
              <p className="text-xs text-slate-400">管理你的随行战队 · 当前随行伙伴 ({party.length} / 6)</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Left 6-slot party list / Right Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Party 6 slots list */}
          <div className="md:col-span-5 border-r border-slate-800 p-4 overflow-y-auto space-y-2 bg-slate-950/20">
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
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PetAvatar speciesId={p.speciesId} size={48} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{p.nickname}</span>
                        {isLeader && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-400 text-slate-950">
                            首发随行
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className={`px-1.5 py-0.2 rounded ${elColor.bg} ${elColor.text}`}>
                          {elColor.label}
                        </span>
                        <span className="font-mono">Lv.{p.level}</span>
                        <span>{p.nature}</span>
                      </div>
                    </div>
                  </div>

                  {/* HP Indicator */}
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-300">
                      {p.currentHp}/{p.stats.hp}
                    </span>
                    <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          p.currentHp / p.stats.hp > 0.5
                            ? 'bg-emerald-500'
                            : p.currentHp / p.stats.hp > 0.2
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
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
            <div className="md:col-span-7 p-6 overflow-y-auto bg-slate-900/60 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Pet Header */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <PetAvatar speciesId={selectedPet.speciesId} size={80} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white">{selectedPet.nickname}</h3>
                        <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                          Lv.{selectedPet.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
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
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>设为首发跟随</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
                      <Check className="w-3.5 h-3.5" />
                      <span>已首发随行</span>
                    </div>
                  )}
                </div>

                {/* HP & EXP Bars */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300 font-mono">
                      <span>气血生命 (HP)</span>
                      <span>
                        {selectedPet.currentHp} / {selectedPet.stats.hp}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(selectedPet.currentHp / selectedPet.stats.hp) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300 font-mono">
                      <span>修行经验 (EXP)</span>
                      <span>
                        {selectedPet.exp} / {selectedPet.maxExp}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${Math.min(100, (selectedPet.exp / selectedPet.maxExp) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-300" />
                    <span>实战数值属性</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">物攻 (ATK)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.atk}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">物防 (DEF)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.def}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">速度 (SPD)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.speed}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">魔攻 (SP.ATK)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.spAtk}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">魔防 (SP.DEF)</div>
                      <div className="text-white font-bold mt-0.5">{selectedPet.stats.spDef}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">形态</div>
                      <div className="text-amber-300 font-bold mt-0.5">
                        {species.evolutionLevel ? `进阶Lv.${species.evolutionLevel}` : '终极形态'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipped Moves */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
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
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
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
    </div>
  );
};
