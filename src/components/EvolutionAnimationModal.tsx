import React, { useState, useEffect } from 'react';
import { PetInstance } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audio';
import { Sparkles, ArrowRight, Award, Zap, Check } from 'lucide-react';

interface EvolutionAnimationModalProps {
  pet: PetInstance;
  fromSpeciesId: string;
  toSpeciesId: string;
  onClose: () => void;
}

export const EvolutionAnimationModal: React.FC<EvolutionAnimationModalProps> = ({
  pet,
  fromSpeciesId,
  toSpeciesId,
  onClose,
}) => {
  const [phase, setPhase] = useState<'AWAKENING' | 'TRANSFORMING' | 'REVEALED'>('AWAKENING');
  const oldSpecies = PET_SPECIES[fromSpeciesId];
  const newSpecies = PET_SPECIES[toSpeciesId];

  useEffect(() => {
    sound.playLevelUp();
    const t1 = setTimeout(() => {
      sound.playCatchSuccess();
      setPhase('TRANSFORMING');
    }, 1800);

    const t2 = setTimeout(() => {
      sound.playSuperEffective();
      setPhase('REVEALED');
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl text-center space-y-6 flex flex-col items-center">
        
        {/* Glowing Halo */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30 blur-3xl animate-pulse" />

        {/* Phase Title */}
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>奇迹觉醒 · 宠物进化仪式</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 roco-title-font drop-shadow-[0_2px_12px_rgba(245,158,11,0.8)]">
            {phase === 'REVEALED' ? `【${newSpecies?.name || '宠物'}】进化登场！` : `魔力凝聚，光芒绽放！`}
          </h2>
          <p className="text-xs text-slate-300 font-sans">
            {phase === 'REVEALED'
              ? `突破形态界限，魔力全面暴涨，领悟更强力的魔法技能！`
              : `魔法光芒耀眼闪烁，宠物即将迎来华丽形态蜕变...`}
          </p>
        </div>

        {/* Animated Avatar Stage */}
        <div className="relative w-64 h-64 flex items-center justify-center z-10">
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-400/40 animate-[spin_15s_linear_infinite_reverse]" />

          {phase === 'AWAKENING' && (
            <div className="animate-pulse scale-100 transition-all">
              <PetAvatar speciesId={fromSpeciesId} size={150} isShiny={pet.isShiny} />
            </div>
          )}

          {phase === 'TRANSFORMING' && (
            <div className="animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] filter brightness-200 contrast-200">
              <PetAvatar speciesId={toSpeciesId} size={160} isShiny={pet.isShiny} />
            </div>
          )}

          {phase === 'REVEALED' && (
            <div className="animate-in zoom-in-75 duration-700 flex flex-col items-center">
              <div className="filter drop-shadow-[0_0_30px_rgba(245,158,11,0.9)]">
                <PetAvatar speciesId={toSpeciesId} size={170} isShiny={pet.isShiny} />
              </div>
            </div>
          )}
        </div>

        {/* Comparison Details */}
        {phase === 'REVEALED' && oldSpecies && newSpecies && (
          <div className="w-full max-w-md p-4 rounded-2xl bg-slate-900/90 border border-amber-500/50 shadow-2xl space-y-3 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold">{oldSpecies.name}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 text-sm">{newSpecies.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div>精力: <strong className="text-cyan-400">{newSpecies.baseStats.hp}</strong> (+{newSpecies.baseStats.hp - oldSpecies.baseStats.hp})</div>
              <div>物攻: <strong className="text-red-400">{newSpecies.baseStats.atk}</strong> (+{newSpecies.baseStats.atk - oldSpecies.baseStats.atk})</div>
              <div>物防: <strong className="text-blue-400">{newSpecies.baseStats.def}</strong> (+{newSpecies.baseStats.def - oldSpecies.baseStats.def})</div>
              <div>魔攻: <strong className="text-purple-400">{newSpecies.baseStats.spAtk}</strong> (+{newSpecies.baseStats.spAtk - oldSpecies.baseStats.spAtk})</div>
            </div>

            <button
              onClick={() => {
                sound.playCatchSuccess();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              进化完成 · 开启全新冒险
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
