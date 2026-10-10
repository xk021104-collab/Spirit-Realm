import React, { useState } from 'react';
import { PetInstance, Move } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { ELEMENT_COLORS, PetAvatar } from './PetAvatar';
import { sound } from '../utils/audio';
import { Swords, Check, X, Sparkles, AlertCircle, Shield, Zap } from 'lucide-react';

interface MoveManagerModalProps {
  pet: PetInstance;
  onSaveMoves: (petUid: string, selectedMoveIds: string[]) => void;
  onClose: () => void;
}

export const MoveManagerModal: React.FC<MoveManagerModalProps> = ({
  pet,
  onSaveMoves,
  onClose,
}) => {
  const species = PET_SPECIES[pet.speciesId];
  
  // All moves unlocked up to this level
  const unlockedMoveIds: string[] = Array.from(
    new Set([
      ...(pet.learnedMoveIds || []),
      ...(species?.learnableMoves.filter((m) => m.level <= pet.level).map((m) => m.moveId) || []),
      ...pet.moves.map((m) => m.id),
    ])
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(pet.moves.map((m) => m.id));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleMove = (moveId: string) => {
    sound.playClick();
    setErrorMsg(null);
    if (selectedIds.includes(moveId)) {
      if (selectedIds.length <= 1) {
        setErrorMsg('幻灵出战必须至少保留 1 个招式！');
        return;
      }
      setSelectedIds(selectedIds.filter((id) => id !== moveId));
    } else {
      if (selectedIds.length >= 4) {
        setErrorMsg('出战招式槽位已满（至多 4 个），请先取消勾选其他招式！');
        return;
      }
      setSelectedIds([...selectedIds, moveId]);
    }
  };

  const handleSave = () => {
    if (selectedIds.length === 0) {
      setErrorMsg('请至少选择 1 个出战招式！');
      return;
    }
    sound.playCatchSuccess();
    onSaveMoves(pet.uid, selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-2xl bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] border-2 border-[#b8860b]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Swords className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                招式殿堂 · 技能装配
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                【{pet.nickname}】当前已掌握技能库 · 已选槽位 ({selectedIds.length}/4)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="roco-medallion-btn text-amber-200 cursor-pointer">
            <X className="w-5 h-5 text-amber-200" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2.5">
            {unlockedMoveIds.map((mId) => {
              const move = MOVES_DATA[mId];
              if (!move) return null;
              const isEquipped = selectedIds.includes(mId);

              return (
                <div
                  key={mId}
                  onClick={() => toggleMove(mId)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-amber-500/20 border-amber-400/80 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{move.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${ELEMENT_COLORS[move.type]?.bg || 'bg-slate-700/50'} ${ELEMENT_COLORS[move.type]?.text || 'text-slate-200'} ${ELEMENT_COLORS[move.type]?.border || 'border-slate-600'}`}
                      >
                        {move.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {move.category === 'PHYSICAL' ? '物理' : move.category === 'SPECIAL' ? '特殊' : '变化'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{move.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span>威力: <strong className="text-amber-300">{move.power || '-'}</strong></span>
                      <span>命中: <strong className="text-cyan-300">{move.accuracy}%</strong></span>
                      <span>PP: <strong className="text-emerald-300">{move.maxPp}</strong></span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isEquipped
                          ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold'
                          : 'border-slate-700 bg-slate-900 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            出战配置: <strong className="text-amber-300 font-mono">{selectedIds.length} / 4</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-xs shadow cursor-pointer transition-all"
            >
              确认装配
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
