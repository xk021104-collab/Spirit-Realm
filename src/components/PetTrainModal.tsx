import React, { useState } from 'react';
import { PetInstance, InventorySlot } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { ITEMS_DATA } from '../data/items';
import { calculateStats, calculateMaxExp, checkEvolution } from '../utils/battleEngine';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { ArtGalleryModal } from './ArtGalleryModal';
import { sound } from '../utils/audio';
import { Zap, Sparkles, Heart, Shield, Swords, ArrowUp, X, Check, Award } from 'lucide-react';

interface PetTrainModalProps {
  party: PetInstance[];
  inventory: InventorySlot[];
  onUpdatePartyPet: (updatedPet: PetInstance) => void;
  onDeductItem: (itemId: string, count: number) => void;
  onClose: () => void;
}

export const PetTrainModal: React.FC<PetTrainModalProps> = ({
  party,
  inventory,
  onUpdatePartyPet,
  onDeductItem,
  onClose,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [evolutionNotice, setEvolutionNotice] = useState<string | null>(null);
  const [showGallerySpeciesId, setShowGallerySpeciesId] = useState<string | null>(null);

  const currentPet = party[selectedIdx];
  if (!currentPet) return null;

  const species = PET_SPECIES[currentPet.speciesId];

  // Exp pills from inventory
  const smallPills = inventory.find((i) => i.itemId === 'exp_pill_small')?.count || 0;
  const largePills = inventory.find((i) => i.itemId === 'exp_pill_large')?.count || 0;

  // Feed EXP Pill
  const handleFeedExp = (pillType: 'small' | 'large') => {
    const pillId = pillType === 'small' ? 'exp_pill_small' : 'exp_pill_large';
    const expGain = pillType === 'small' ? 200 : 1000;
    const available = pillType === 'small' ? smallPills : largePills;

    if (available <= 0) {
      sound.playClick();
      return;
    }

    sound.playLevelUp();
    onDeductItem(pillId, 1);

    let newExp = currentPet.exp + expGain;
    let newLevel = currentPet.level;
    let newMaxExp = currentPet.maxExp;

    while (newExp >= newMaxExp && newLevel < 100) {
      newExp -= newMaxExp;
      newLevel += 1;
      newMaxExp = calculateMaxExp(newLevel);
    }

    // Check Evolution
    let updatedSpeciesId = currentPet.speciesId;
    let updatedNickname = currentPet.nickname;
    const evo = checkEvolution(updatedSpeciesId, newLevel);

    if (evo) {
      sound.playCatchSuccess();
      updatedSpeciesId = evo.newSpeciesId;
      if (currentPet.nickname === species.name) {
        updatedNickname = evo.newSpeciesName;
      }
      setEvolutionNotice(`🎉 恭喜！【${currentPet.nickname}】突破至 Lv.${newLevel}，成功蜕变为【${evo.newSpeciesName}】！`);
      setTimeout(() => setEvolutionNotice(null), 5000);
    }

    const newStats = calculateStats(PET_SPECIES[updatedSpeciesId], newLevel);
    const updatedPet: PetInstance = {
      ...currentPet,
      speciesId: updatedSpeciesId,
      nickname: updatedNickname,
      level: newLevel,
      exp: newExp,
      maxExp: newMaxExp,
      currentHp: newStats.hp,
      stats: newStats,
    };

    onUpdatePartyPet(updatedPet);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-14 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b-2 border-amber-500/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-300 game-title-font">
                幻灵修炼室 · 等级突破与形态蜕变
              </h2>
              <p className="text-[11px] text-amber-200/80">
                洛克/奥奇/赛尔风格升级仓：吞服经验仙果，直升百级蜕变！
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pet Selection Header Tabs */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {party.map((p, idx) => {
            const isSel = idx === selectedIdx;
            const sp = PET_SPECIES[p.speciesId];
            return (
              <button
                key={p.uid}
                onClick={() => {
                  sound.playClick();
                  setSelectedIdx(idx);
                }}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
                  isSel
                    ? 'bg-amber-950/80 border-amber-400 shadow-md text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <PetAvatar speciesId={p.speciesId} size={28} />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">{p.nickname}</div>
                  <div className="text-[10px] text-amber-400 font-mono">Lv.{p.level}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/90 text-sm flex flex-col md:flex-row gap-6">
          {/* Left Column: Pet Showcase & Stats */}
          <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-950 p-5 rounded-2xl border border-slate-800">
            {evolutionNotice && (
              <div className="w-full bg-amber-950 border-2 border-amber-400 p-2.5 rounded-xl text-amber-200 text-xs font-bold mb-4 flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{evolutionNotice}</span>
              </div>
            )}

            <div
              onClick={() => setShowGallerySpeciesId(currentPet.speciesId)}
              className="relative w-40 h-40 flex items-center justify-center mb-3 cursor-pointer group transition-transform hover:scale-105"
              title="点击展开全景高精立绘鉴赏"
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 animate-[spin_20s_linear_infinite]" />
              <PetAvatar speciesId={currentPet.speciesId} size={110} />
              <div className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-slate-900/95 border border-amber-500/40 text-[10px] text-amber-300 font-bold flex items-center gap-1 shadow-md group-hover:bg-amber-500/20 group-hover:border-amber-400 transition-all">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                <span>立绘画卷</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-black text-amber-300 game-title-font">{currentPet.nickname}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${RARITY_BADGES[species.rarity].bg} ${RARITY_BADGES[species.rarity].border} ${RARITY_BADGES[species.rarity].text}`}>
                {RARITY_BADGES[species.rarity].label}
              </span>
            </div>

            <p className="text-xs text-slate-400 text-center mb-4">{species.title}</p>

            {/* EXP Progress Gauge */}
            <div className="w-full bg-slate-900 p-3 rounded-xl border border-slate-800 mb-4">
              <div className="flex justify-between items-center text-xs mb-1 font-mono">
                <span className="text-slate-400">修炼等级: <b className="text-amber-400 font-bold">Lv.{currentPet.level}</b> / 100</span>
                <span className="text-amber-400 font-bold">{currentPet.exp} / {currentPet.maxExp} EXP</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentPet.exp / currentPet.maxExp) * 100)}%` }}
                />
              </div>
              {species.evolutionLevel && (
                <div className="mt-2 text-[10px] text-cyan-300 flex items-center gap-1 font-mono">
                  <ArrowUp className="w-3 h-3 text-cyan-400" />
                  <span>形态蜕变目标：达到 Lv.{species.evolutionLevel} 可蜕变进化！</span>
                </div>
              )}
            </div>

            {/* Combat Attributes Radar */}
            <div className="w-full grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">生命上限</span>
                <span className="text-emerald-400 font-mono font-bold">{currentPet.stats.hp}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">物理攻击</span>
                <span className="text-rose-400 font-mono font-bold">{currentPet.stats.atk}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">特攻法术</span>
                <span className="text-cyan-400 font-mono font-bold">{currentPet.stats.spAtk}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">出手速度</span>
                <span className="text-amber-400 font-mono font-bold">{currentPet.stats.speed}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Training Pills (Feed EXP) */}
          <div className="w-full md:w-1/2 flex flex-col justify-between bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              <h4 className="font-black text-amber-300 text-sm mb-2 game-title-font">
                炼丹房 · 投喂经验仙果
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                点击吞服储物行囊中的高品经验果实，无需繁琐刷怪，瞬间提升幻灵修为与技能领悟！
              </p>

              {/* Pill 1: 玄灵凝魄果 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-300">玄灵凝魄果</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/40 font-mono">
                      +200 EXP
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    当前拥有：<b className="text-white font-mono">{smallPills}</b> 枚
                  </span>
                </div>

                <button
                  disabled={smallPills <= 0}
                  onClick={() => handleFeedExp('small')}
                  className="flash-gold-btn px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  使用 1 枚
                </button>
              </div>

              {/* Pill 2: 九转通天仙果 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-amber-300">九转通天仙果</span>
                    <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/40 font-mono">
                      +1000 EXP (狂暴升级)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    当前拥有：<b className="text-white font-mono">{largePills}</b> 枚
                  </span>
                </div>

                <button
                  disabled={largePills <= 0}
                  onClick={() => handleFeedExp('large')}
                  className="flash-gold-btn px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  使用 1 枚
                </button>
              </div>

              {/* How to get more */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="text-amber-400 font-bold block mb-1">💡 仙果获取途径：</span>
                <p>1. 完成主线历练与新手引导章节直接获赠</p>
                <p>2. 前往【万象宝阁】使用灵石购买</p>
                <p>3. 参与盛典【天运罗盘】每日免费抽取</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flash-gold-btn px-6 py-1.5 rounded-xl text-xs cursor-pointer"
              >
                修炼完毕
              </button>
            </div>
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
