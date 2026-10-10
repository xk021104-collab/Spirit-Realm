import React, { useState } from 'react';
import { PetInstance, InventorySlot } from '../types/game';
import { PET_SPECIES, RARITY_BADGES } from '../data/species';
import { ITEMS_DATA } from '../data/items';
import {
  calculateStats,
  calculateMaxExp,
  checkEvolution,
  rerollTalentScore,
  getRandomNature,
} from '../utils/battleEngine';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { ArtGalleryModal } from './ArtGalleryModal';
import { sound } from '../utils/audio';
import {
  Zap,
  Sparkles,
  Heart,
  Shield,
  Swords,
  ArrowUp,
  X,
  Check,
  Award,
  Sliders,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface PetTrainModalProps {
  party: PetInstance[];
  inventory: InventorySlot[];
  onUpdatePartyPet: (updatedPet: PetInstance) => void;
  onDeductItem: (itemId: string, count: number) => void;
  onOpenMoveManager?: (pet: PetInstance) => void;
  onTriggerEvolution?: (pet: PetInstance, oldId: string, newId: string) => void;
  onClose: () => void;
}

export const PetTrainModal: React.FC<PetTrainModalProps> = ({
  party,
  inventory,
  onUpdatePartyPet,
  onDeductItem,
  onOpenMoveManager,
  onTriggerEvolution,
  onClose,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'EXP' | 'CULTIVATION'>('EXP');
  const [evolutionNotice, setEvolutionNotice] = useState<string | null>(null);
  const [cultivateNotice, setCultivateNotice] = useState<string | null>(null);
  const [showGallerySpeciesId, setShowGallerySpeciesId] = useState<string | null>(null);

  const currentPet = party[selectedIdx];
  if (!currentPet) return null;

  const species = PET_SPECIES[currentPet.speciesId];

  // Inventory pill counts
  const smallPills = inventory.find((i) => i.itemId === 'exp_pill_small')?.count || 0;
  const largePills = inventory.find((i) => i.itemId === 'exp_pill_large')?.count || 0;
  const xiSuiPills = inventory.find((i) => i.itemId === 'xi_sui_dan')?.count || 0;
  const dingHunPills = inventory.find((i) => i.itemId === 'ding_hun_dan')?.count || 0;

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
      if (onTriggerEvolution) {
        onTriggerEvolution(currentPet, currentPet.speciesId, evo.newSpeciesId);
      }
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

  // Wash Marrow (Reroll Talent Score)
  const handleWashMarrow = () => {
    if (xiSuiPills <= 0) {
      sound.playClick();
      setCultivateNotice('缺少【九叶洗髓仙丹】，可在珍宝阁或历练任务中获取！');
      setTimeout(() => setCultivateNotice(null), 3000);
      return;
    }

    sound.playCatchSuccess();
    onDeductItem('xi_sui_dan', 1);

    const newTalent = rerollTalentScore();
    const oldTalent = currentPet.talentScore || 20;

    // Boost stats slightly if talent increased
    const multiplier = 1 + (newTalent - 20) * 0.01;
    const baseStats = calculateStats(species, currentPet.level);
    const newStats = {
      hp: Math.floor(baseStats.hp * multiplier),
      maxHp: Math.floor(baseStats.hp * multiplier),
      atk: Math.floor(baseStats.atk * multiplier),
      def: Math.floor(baseStats.def * multiplier),
      spAtk: Math.floor(baseStats.spAtk * multiplier),
      spDef: Math.floor(baseStats.spDef * multiplier),
      speed: Math.floor(baseStats.speed * multiplier),
    };

    const updatedPet: PetInstance = {
      ...currentPet,
      talentScore: newTalent,
      stats: newStats,
      currentHp: Math.min(newStats.hp, currentPet.currentHp),
    };

    onUpdatePartyPet(updatedPet);
    setCultivateNotice(
      `✨ 洗髓成功！天赋资质由 ${oldTalent} 重塑为 ${newTalent}/31！${
        newTalent >= 30 ? '（极品神资！）' : ''
      }`
    );
    setTimeout(() => setCultivateNotice(null), 4000);
  };

  // Reshape Nature
  const handleReshapeNature = () => {
    if (dingHunPills <= 0) {
      sound.playClick();
      setCultivateNotice('缺少【太素定魂神玉】，可在珍宝阁或仙友互赠中获取！');
      setTimeout(() => setCultivateNotice(null), 3000);
      return;
    }

    sound.playCatchSuccess();
    onDeductItem('ding_hun_dan', 1);

    const newNature = getRandomNature();
    const updatedPet: PetInstance = {
      ...currentPet,
      nature: newNature,
    };

    onUpdatePartyPet(updatedPet);
    setCultivateNotice(`🔮 先天性格重塑完毕！幻灵专精觉醒为：【${newNature}】！`);
    setTimeout(() => setCultivateNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] border-2 border-[#b8860b]/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="h-16 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black roco-gold-text roco-title-font flex items-center gap-2">
                  幻灵修炼室 · 突破洗髓与招式
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  修行
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest hidden sm:inline">— SPIRIT TRAINING —</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                九天灵源造化阁：炼化经验仙果、洗髓伐脉重塑性格、自由装配神兽出战招式
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-medallion-btn text-amber-200 cursor-pointer"
            title="关闭修炼室"
          >
            <X className="w-5 h-5 text-amber-200 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </button>
        </div>

        {/* Pet Selection Header Tabs */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 overflow-x-auto">
            {party.map((p, idx) => {
              const isSel = idx === selectedIdx;
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
                  <PetAvatar speciesId={p.speciesId} size={28} isShiny={p.isShiny} />
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">{p.nickname}</div>
                    <div className="text-[10px] text-amber-400 font-mono">Lv.{p.level}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Move Manager Shortcut */}
          {onOpenMoveManager && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenMoveManager(currentPet);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 text-purple-200 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow"
            >
              <Swords className="w-3.5 h-3.5 text-purple-400" />
              <span>装配出战招式</span>
            </button>
          )}
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

            {cultivateNotice && (
              <div className="w-full bg-purple-950 border-2 border-purple-400 p-2.5 rounded-xl text-purple-200 text-xs font-bold mb-4 flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{cultivateNotice}</span>
              </div>
            )}

            <div
              onClick={() => setShowGallerySpeciesId(currentPet.speciesId)}
              className="relative w-40 h-40 flex items-center justify-center mb-3 cursor-pointer group transition-transform hover:scale-105"
              title="点击展开全景高精立绘鉴赏"
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 animate-[spin_20s_linear_infinite]" />
              <PetAvatar speciesId={currentPet.speciesId} size={110} isShiny={currentPet.isShiny} />
              <div className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-slate-900/95 border border-amber-500/40 text-[10px] text-amber-300 font-bold flex items-center gap-1 shadow-md group-hover:bg-amber-500/20 group-hover:border-amber-400 transition-all">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                <span>立绘画卷</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-black text-amber-300 game-title-font">{currentPet.nickname}</h3>
              {currentPet.isShiny && <span className="text-amber-400">✨</span>}
              <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${RARITY_BADGES[species.rarity].bg} ${RARITY_BADGES[species.rarity].border} ${RARITY_BADGES[species.rarity].text}`}>
                {RARITY_BADGES[species.rarity].label}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-400">{species.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono">
                资质: {currentPet.talentScore || 20}/31
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
                {currentPet.nature}
              </span>
            </div>

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

            {/* Combat Attributes */}
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

          {/* Right Column: Two Tabs (EXP vs CULTIVATION) */}
          <div className="w-full md:w-1/2 flex flex-col justify-between bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              {/* Tab Selector */}
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveTab('EXP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'EXP'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  修为突破 (吞服仙果)
                </button>
                <button
                  onClick={() => setActiveTab('CULTIVATION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'CULTIVATION'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  洗髓伐脉 (资质与性格)
                </button>
              </div>

              {/* TAB 1: EXP PILLS */}
              {activeTab === 'EXP' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 mb-2">
                    吞服行囊中的高品经验果实，无需繁琐刷怪，瞬间提升修为并触发形态蜕变！
                  </p>

                  {/* Pill 1 */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
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

                  {/* Pill 2 */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-amber-300">九转通天仙果</span>
                        <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/40 font-mono">
                          +1000 EXP
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
                </div>
              )}

              {/* TAB 2: CULTIVATION & TALENT */}
              {activeTab === 'CULTIVATION' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 mb-2">
                    重塑天地幻灵的先天灵根，洗练 31 点资质极限，重塑性格专精倾向！
                  </p>

                  {/* Item 1: 洗髓丹 */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-purple-300">九叶洗髓仙丹</span>
                        <span className="text-[10px] bg-purple-950 text-purple-400 px-1.5 py-0.2 rounded border border-purple-500/40 font-mono">
                          资质重塑 (1~31)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        当前拥有：<b className="text-white font-mono">{xiSuiPills}</b> 颗
                      </span>
                    </div>

                    <button
                      disabled={xiSuiPills <= 0}
                      onClick={handleWashMarrow}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow"
                    >
                      洗髓 1 次
                    </button>
                  </div>

                  {/* Item 2: 定魂玉 */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-cyan-300">太素定魂神玉</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-500/40 font-mono">
                          性格重构
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        当前拥有：<b className="text-white font-mono">{dingHunPills}</b> 枚
                      </span>
                    </div>

                    <button
                      disabled={dingHunPills <= 0}
                      onClick={handleReshapeNature}
                      className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow"
                    >
                      定魂 1 次
                    </button>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 mt-4">
                <span className="text-amber-400 font-bold block mb-1">💡 修仙心得：</span>
                <p>• 资质达到 30 以上即可跃升为极品天品神兽，基础战力提升 15%</p>
                <p>• 固执性格大幅强化物理攻击，保守性格大幅强化法术特攻</p>
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
