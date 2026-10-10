import React, { useState } from 'react';
import { PetInstance } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { MOVES_DATA } from '../data/moves';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { sound } from '../utils/audio';
import {
  Archive,
  ArrowRightLeft,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Heart,
  Zap,
  Sword,
  Shield,
  Trash2,
  X,
  Check,
  Star,
  Layers,
  Crown
} from 'lucide-react';

interface PetStorageModalProps {
  party: PetInstance[];
  storage: PetInstance[];
  activeLeaderIndex: number;
  onSetLeaderIndex: (index: number) => void;
  onDepositToStorage: (partyIndex: number) => void;
  onWithdrawFromStorage: (storageIndex: number) => void;
  onSwapPartyAndStorage: (partyIndex: number, storageIndex: number) => void;
  onReleasePet: (from: 'party' | 'storage', index: number) => void;
  onClose: () => void;
}

export const PetStorageModal: React.FC<PetStorageModalProps> = ({
  party,
  storage,
  activeLeaderIndex,
  onSetLeaderIndex,
  onDepositToStorage,
  onWithdrawFromStorage,
  onSwapPartyAndStorage,
  onReleasePet,
  onClose,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<'party' | 'storage'>('party');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [confirmRelease, setConfirmRelease] = useState<boolean>(false);
  const [activeBoxPage, setActiveBoxPage] = useState<number>(1);

  const selectedPet =
    selectedLocation === 'party'
      ? party[selectedIndex] || party[0]
      : storage[selectedIndex] || storage[0];

  const species = selectedPet ? PET_SPECIES[selectedPet.speciesId] : null;

  // Box pagination: 30 pets per box
  const BOX_SIZE = 30;
  const totalBoxPages = Math.max(1, Math.ceil(storage.length / BOX_SIZE));
  const currentBoxPets = storage.slice((activeBoxPage - 1) * BOX_SIZE, activeBoxPage * BOX_SIZE);

  const handleSelectPartyPet = (idx: number) => {
    sound.playClick();
    setSelectedLocation('party');
    setSelectedIndex(idx);
    setConfirmRelease(false);
  };

  const handleSelectStoragePet = (localIdx: number) => {
    sound.playClick();
    const globalIdx = (activeBoxPage - 1) * BOX_SIZE + localIdx;
    setSelectedLocation('storage');
    setSelectedIndex(globalIdx);
    setConfirmRelease(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-5xl h-[88vh] max-h-[760px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#b8860b]/50 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] overflow-hidden text-slate-100">
        
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Archive className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  皇家宠物医院 · 宠物仓库
                </h2>
                <span className="roco-seal text-[9px] px-1.5 py-0.2 font-bold tracking-wider">
                  仓库
                </span>
                <span className="text-[10px] text-amber-300/60 font-mono hidden sm:inline">— PET STORAGE —</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                随行战队 ({party.length}/6) · 仓库存储 ({storage.length} 只) · 捕捉超过 6 只自动存放仓库
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-close-btn shrink-0"
            title="关闭仓库"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-4 gap-4">
          
          {/* Left: Party (3 Cols) */}
          <div className="lg:col-span-4 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> 随行出战战队 ({party.length}/6)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">至多 6 席</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {party.map((pet, idx) => {
                const sp = PET_SPECIES[pet.speciesId];
                const isSelected = selectedLocation === 'party' && selectedIndex === idx;
                const isLeader = activeLeaderIndex === idx;

                return (
                  <div
                    key={pet.uid}
                    onClick={() => handleSelectPartyPet(idx)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800 relative">
                      <PetAvatar speciesId={pet.speciesId} size={42} isShiny={pet.isShiny} />
                      {isLeader && (
                        <span className="absolute -top-1 -left-1 px-1 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-bold">
                          首发
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {pet.nickname}
                          {pet.isShiny && <span className="text-amber-400 ml-1">✨</span>}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">Lv.{pet.level}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold border ${ELEMENT_COLORS[sp?.type || 'NORMAL']?.bg || 'bg-slate-700/50'} ${ELEMENT_COLORS[sp?.type || 'NORMAL']?.text || 'text-slate-200'} ${ELEMENT_COLORS[sp?.type || 'NORMAL']?.border || 'border-slate-600'}`}
                        >
                          {sp?.type}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          精力: {pet.currentHp}/{pet.stats.hp}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle: Storage Box (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Archive className="w-3.5 h-3.5 text-cyan-400" /> 王国宠物仓库 ({storage.length} 只)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  disabled={activeBoxPage <= 1}
                  onClick={() => setActiveBoxPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer text-[10px]"
                >
                  ◀
                </button>
                <span className="text-[11px] font-mono text-amber-300">
                  仓 {activeBoxPage}/{totalBoxPages}
                </span>
                <button
                  disabled={activeBoxPage >= totalBoxPages}
                  onClick={() => setActiveBoxPage((p) => Math.min(totalBoxPages, p + 1))}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer text-[10px]"
                >
                  ▶
                </button>
              </div>
            </div>

            {storage.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center space-y-2">
                <Archive className="w-10 h-10 text-slate-600 animate-pulse" />
                <p>宠物仓库暂无存放宠物</p>
                <p className="text-[10px] text-slate-600">
                  随行背包满 6 只后捕获的新宠物，将自动存入此仓库
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-2 p-1 content-start">
                {currentBoxPets.map((pet, localIdx) => {
                  const globalIdx = (activeBoxPage - 1) * BOX_SIZE + localIdx;
                  const isSelected = selectedLocation === 'storage' && selectedIndex === globalIdx;

                  return (
                    <div
                      key={pet.uid}
                      onClick={() => handleSelectStoragePet(localIdx)}
                      className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <PetAvatar speciesId={pet.speciesId} size={36} isShiny={pet.isShiny} />
                      <span className="text-[9px] font-mono text-slate-300 truncate w-full text-center mt-0.5">
                        Lv.{pet.level}
                      </span>
                      {pet.isShiny && (
                        <span className="absolute top-0.5 right-0.5 text-[8px] text-amber-400">✨</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Pet Detail & Actions (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 overflow-y-auto justify-between space-y-4">
            {selectedPet && species ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 flex items-center justify-center shadow-inner">
                      <PetAvatar speciesId={selectedPet.speciesId} size={54} isShiny={selectedPet.isShiny} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-amber-200 truncate">
                          {selectedPet.nickname}
                        </span>
                        {selectedPet.isShiny && <span className="text-amber-400">✨</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {species.name} · Lv.{selectedPet.level}
                      </div>
                      <span
                        className={`inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-bold border ${ELEMENT_COLORS[species.type]?.bg || 'bg-slate-700/50'} ${ELEMENT_COLORS[species.type]?.text || 'text-slate-200'} ${ELEMENT_COLORS[species.type]?.border || 'border-slate-600'}`}
                      >
                        {species.type}
                      </span>
                    </div>
                  </div>

                  {/* Stats & Talent */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">先天天赋</span>
                      <span className="font-mono font-bold text-amber-300">
                        资质: {selectedPet.talentScore || 20}/31
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">性格专精</span>
                      <span className="text-purple-300 font-semibold">{selectedPet.nature}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] font-mono text-slate-400">
                      <div>生命: <span className="text-cyan-400">{selectedPet.stats.hp}</span></div>
                      <div>物攻: <span className="text-red-400">{selectedPet.stats.atk}</span></div>
                      <div>物防: <span className="text-blue-400">{selectedPet.stats.def}</span></div>
                      <div>特攻: <span className="text-purple-400">{selectedPet.stats.spAtk}</span></div>
                      <div>特防: <span className="text-emerald-400">{selectedPet.stats.spDef}</span></div>
                      <div>速度: <span className="text-amber-400">{selectedPet.stats.speed}</span></div>
                    </div>
                  </div>

                  {/* Moves */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold">掌握招式:</span>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      {selectedPet.moves.map((m) => {
                        const mv = MOVES_DATA[m.id];
                        return (
                          <div
                            key={m.id}
                            className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 truncate text-center"
                          >
                            {mv?.name || m.id}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Transfer Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {selectedLocation === 'party' ? (
                    <>
                      {activeLeaderIndex !== selectedIndex && (
                        <button
                          onClick={() => {
                            sound.playCatchSuccess();
                            onSetLeaderIndex(selectedIndex);
                          }}
                          className="w-full py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          设为出战首发
                        </button>
                      )}
                      <button
                        disabled={party.length <= 1}
                        onClick={() => {
                          sound.playCatchSuccess();
                          onDepositToStorage(selectedIndex);
                        }}
                        className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow flex items-center justify-center gap-1.5"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        存入宠物仓库
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={party.length >= 6}
                      onClick={() => {
                        sound.playCatchSuccess();
                        onWithdrawFromStorage(selectedIndex);
                      }}
                      className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow flex items-center justify-center gap-1.5"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      取出至随行战队
                    </button>
                  )}

                  {/* Release / Recycle */}
                  {confirmRelease ? (
                    <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-center space-y-1.5">
                      <p className="text-[10px] text-red-300">
                        确认放生【{selectedPet.nickname}】？将返还 500 星辉金币与 2 友谊魔法碎片！
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            sound.playCatchSuccess();
                            onReleasePet(selectedLocation, selectedIndex);
                            setConfirmRelease(false);
                          }}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                        >
                          确认放生
                        </button>
                        <button
                          onClick={() => setConfirmRelease(false)}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs cursor-pointer"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      disabled={selectedLocation === 'party' && party.length <= 1}
                      onClick={() => setConfirmRelease(true)}
                      className="w-full py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/80 border border-red-900/50 text-red-400 hover:text-red-300 text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      放生宠物归于自然
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 text-xs my-auto">
                请点击选择宠物查看详情
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
