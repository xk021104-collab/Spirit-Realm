import React, { useState } from 'react';
import { CharacterOutfit, OutfitItem, OutfitPreset, OutfitSlot } from '../types/game';
import { OUTFIT_ITEMS, OUTFIT_PRESETS, OUTFIT_SLOT_TABS, RARITY_LABELS } from '../data/outfits';
import { PlayerAvatar } from './PlayerAvatar';
import { CultivatorPortrait } from './CultivatorPortrait';
import { IconRocoCoin } from './GameIcons';
import { sound } from '../utils/audio';
import {
  X,
  Sparkles,
  Check,
  RotateCcw,
  Crown,
  Shirt,
  Smile,
  Wand2,
  Feather,
  Sun,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

interface WardrobeModalProps {
  currentOutfit: CharacterOutfit;
  unlockedOutfitIds: string[];
  playerCoins: number;
  playerDiamonds?: number;
  onSaveOutfit: (newOutfit: CharacterOutfit) => void;
  onUnlockOutfitItem: (itemId: string, costCoins?: number, costDiamonds?: number) => void;
  onClose: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  currentOutfit,
  unlockedOutfitIds,
  playerCoins,
  playerDiamonds = 90,
  onSaveOutfit,
  onUnlockOutfitItem,
  onClose,
}) => {
  // Working preview outfit (allows trying on items without saving immediately)
  const [previewOutfit, setPreviewOutfit] = useState<CharacterOutfit>({ ...currentOutfit });
  const [selectedSlot, setSelectedSlot] = useState<OutfitSlot | 'ALL'>('ALL');
  const [previewMode, setPreviewMode] = useState<'chibi' | 'full'>('chibi');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Check if preview has unsaved changes compared to equipped
  const hasUnsavedChanges = JSON.stringify(previewOutfit) !== JSON.stringify(currentOutfit);

  // Filter items by slot
  const filteredItems = Object.values(OUTFIT_ITEMS).filter((item) => {
    if (selectedSlot === 'ALL') return true;
    return item.slot === selectedSlot;
  });

  // Calculate total stat bonuses from preview outfit
  const activeBonuses = Object.entries(previewOutfit)
    .map(([_, itemId]) => OUTFIT_ITEMS[itemId]?.bonusText)
    .filter(Boolean) as string[];

  // Try on item
  const handleTryOn = (item: OutfitItem) => {
    sound.playClick();
    const updated = { ...previewOutfit };
    switch (item.slot) {
      case 'HAT':
        updated.hatId = item.id;
        break;
      case 'HAIR':
        updated.hairId = item.id;
        break;
      case 'ROBE':
        updated.robeId = item.id;
        break;
      case 'HANDHELD':
        updated.handheldId = item.id;
        break;
      case 'WINGS':
        updated.wingsId = item.id;
        break;
      case 'AURA':
        updated.auraId = item.id;
        break;
    }
    setPreviewOutfit(updated);
  };

  // Unequip slot to default
  const handleUnequipSlot = (slot: OutfitSlot) => {
    sound.playClick();
    const updated = { ...previewOutfit };
    switch (slot) {
      case 'HAT':
        updated.hatId = 'hat_classic_wizard';
        break;
      case 'HAIR':
        updated.hairId = 'hair_golden_fluffy';
        break;
      case 'ROBE':
        updated.robeId = 'robe_academy_blue';
        break;
      case 'HANDHELD':
        updated.handheldId = 'wand_star_crystal';
        break;
      case 'WINGS':
        updated.wingsId = 'wings_none';
        break;
      case 'AURA':
        updated.auraId = 'aura_starlight';
        break;
    }
    setPreviewOutfit(updated);
  };

  // Apply a whole theme preset
  const handleApplyPreset = (preset: OutfitPreset) => {
    sound.playCatchSuccess();
    setPreviewOutfit({ ...preset.outfit });
    setFeedbackNotice(`✨ 已试穿套装【${preset.name}】！`);
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  // Unlock / Purchase locked fashion item
  const handleUnlockItem = (item: OutfitItem) => {
    const costCoins = item.priceCoins || 0;
    const costDiamonds = item.priceDiamonds || 0;

    if (costCoins > 0 && playerCoins < costCoins) {
      sound.playClick();
      setFeedbackNotice('幻灵金币不足，无法解锁该装扮！');
      setTimeout(() => setFeedbackNotice(null), 2500);
      return;
    }

    if (costDiamonds > 0 && playerDiamonds < costDiamonds) {
      sound.playClick();
      setFeedbackNotice('璀璨幻钻不足，无法解锁该传世装扮！');
      setTimeout(() => setFeedbackNotice(null), 2500);
      return;
    }

    sound.playLevelUp();
    onUnlockOutfitItem(item.id, costCoins, costDiamonds);
    setFeedbackNotice(`🎉 成功解锁装扮【${item.name}】！`);
    setTimeout(() => setFeedbackNotice(null), 2500);
    // Also equip it directly
    handleTryOn(item);
  };

  // Save current preview outfit
  const handleSave = () => {
    sound.playCatchSuccess();
    onSaveOutfit(previewOutfit);
    setFeedbackNotice('✨ 穿搭保存成功！全新形象已同步至全王国！');
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  // Reset preview to currently equipped outfit
  const handleReset = () => {
    sound.playClick();
    setPreviewOutfit({ ...currentOutfit });
    setFeedbackNotice('已还原为当前保存的穿搭。');
    setTimeout(() => setFeedbackNotice(null), 2000);
  };

  const getSlotIcon = (slot: OutfitSlot | 'ALL') => {
    switch (slot) {
      case 'HAT':
        return <Crown className="w-3.5 h-3.5" />;
      case 'HAIR':
        return <Smile className="w-3.5 h-3.5" />;
      case 'ROBE':
        return <Shirt className="w-3.5 h-3.5" />;
      case 'HANDHELD':
        return <Wand2 className="w-3.5 h-3.5" />;
      case 'WINGS':
        return <Feather className="w-3.5 h-3.5" />;
      case 'AURA':
        return <Sun className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="relative border-2 border-[#b8860b]/60 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[820px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17]">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40 z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-600/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Shirt className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  皮卡魔力衣橱 · 角色装扮沙龙
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  衣橱
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest hidden sm:inline">
                  — PIKA MAGIC WARDROBE —
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                皇家裁缝皮卡大师亲授 · 随心搭配头部、法袍、神杖、流光羽翼与足迹光环
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wealth Pills */}
            <div className="roco-currency-badge" title="当前拥有的幻灵金币">
              <IconRocoCoin size={20} />
              <span className="text-xs text-slate-400">幻灵金币:</span>
              <span className="text-sm font-bold font-mono text-amber-300">{playerCoins.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#2a1a0d]/80 text-cyan-300 border border-[#b48a52]/60 shadow-sm text-xs font-mono font-bold">
              <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                钻
              </div>
              <span>{playerDiamonds}</span>
              <span className="text-[10px] text-cyan-400 font-bold hidden sm:inline">璀璨幻钻</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="roco-close-btn shrink-0"
              title="离开衣橱"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackNotice && (
          <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/95 to-amber-950/90 border-b border-amber-500/50 text-amber-200 text-xs px-6 py-2 flex items-center gap-2 animate-in fade-in z-20">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="font-bold roco-title-font">{feedbackNotice}</span>
          </div>
        )}

        {/* Main Body: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* ==========================================================
              LEFT COLUMN: Live Character Visualizer Canvas (5 cols)
              ========================================================== */}
          <div className="md:col-span-5 p-4 sm:p-5 border-r border-[#b8860b]/30 bg-[#040e1b]/70 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* Top Switcher: Chibi Sprite vs Full HD Portrait */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-[#b8860b]/30">
                <button
                  onClick={() => {
                    sound.playClick();
                    setPreviewMode('chibi');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all roco-title-font ${
                    previewMode === 'chibi'
                      ? 'roco-turn-capsule text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  经典萌态 (Chibi)
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setPreviewMode('full');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all roco-title-font ${
                    previewMode === 'full'
                      ? 'roco-turn-capsule text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  全身高精画卷 (Full)
                </button>
              </div>

              {hasUnsavedChanges && (
                <span className="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  ● 试穿未保存
                </span>
              )}
            </div>

            {/* Character Stage Showcase */}
            <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#091b33]/60 via-[#061220]/80 to-[#02070e] border-2 border-[#b8860b]/40 flex flex-col items-center justify-center min-h-[260px] shadow-inner overflow-hidden">
              {/* Magic Runes Ambient Background Halo */}
              <div className="absolute w-48 h-48 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

              {/* Character Render Component */}
              <div className="relative z-10 transition-transform duration-300 hover:scale-105">
                {previewMode === 'chibi' ? (
                  <div className="scale-150 py-8">
                    <PlayerAvatar size={92} outfit={previewOutfit} />
                  </div>
                ) : (
                  <CultivatorPortrait mode="full" outfit={previewOutfit} className="max-h-[260px]" />
                )}
              </div>

              <div className="mt-3 relative z-10 flex items-center gap-1.5 text-xs text-amber-300 roco-title-font font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>实时装扮试穿镜</span>
              </div>
            </div>

            {/* Quick Thematic Outfit Presets Tray */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 roco-title-font">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>一键试穿官方主题套装:</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {OUTFIT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-[#b8860b]/30 hover:border-amber-400 text-left transition-all cursor-pointer group shadow-xs"
                    title={preset.description}
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-amber-300 roco-title-font truncate">
                      {preset.name}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">一键成套</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Active Stat Bonuses */}
            {activeBonuses.length > 0 && (
              <div className="p-2.5 rounded-xl roco-panel border border-cyan-500/30 text-xs space-y-1">
                <div className="text-[10px] font-bold text-cyan-300 flex items-center gap-1 roco-title-font">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>当前装扮附加魔力威能:</span>
                </div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {activeBonuses.map((bonus, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 font-mono"
                    >
                      {bonus}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Save & Reset Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#b8860b]/30">
              <button
                onClick={handleReset}
                disabled={!hasUnsavedChanges}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer transition-all flex items-center justify-center gap-1.5 roco-title-font"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>还原装扮</span>
              </button>

              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="flex-2 py-2 px-4 rounded-xl roco-turn-capsule disabled:opacity-40 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 roco-title-font"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>保存穿搭形象</span>
              </button>
            </div>
          </div>

          {/* ==========================================================
              RIGHT COLUMN: Parts Dressing Tray & Catalog (7 cols)
              ========================================================== */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-[#061426]/40">
            {/* Slot Tabs */}
            <div className="bg-slate-950/80 px-4 py-2 border-b border-[#b8860b]/30 flex items-center gap-1.5 overflow-x-auto shrink-0">
              {OUTFIT_SLOT_TABS.map((tab) => {
                const active = selectedSlot === tab.slot;
                return (
                  <button
                    key={tab.slot}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSlot(tab.slot);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap roco-title-font shrink-0 ${
                      active
                        ? 'roco-turn-capsule text-slate-950 shadow-md ring-1 ring-amber-300'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
                    }`}
                  >
                    {getSlotIcon(tab.slot)}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Items Grid Catalog */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => {
                  const isUnlocked =
                    item.unlockedByDefault || unlockedOutfitIds.includes(item.id);

                  // Is this item currently worn in the preview model?
                  const isEquippedInPreview =
                    (item.slot === 'HAT' && previewOutfit.hatId === item.id) ||
                    (item.slot === 'HAIR' && previewOutfit.hairId === item.id) ||
                    (item.slot === 'ROBE' && previewOutfit.robeId === item.id) ||
                    (item.slot === 'HANDHELD' && previewOutfit.handheldId === item.id) ||
                    (item.slot === 'WINGS' && previewOutfit.wingsId === item.id) ||
                    (item.slot === 'AURA' && previewOutfit.auraId === item.id);

                  const rarityInfo = RARITY_LABELS[item.rarity] || RARITY_LABELS.COMMON;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        handleTryOn(item);
                      }}
                      className={`p-3.5 rounded-2xl roco-panel border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-md group ${
                        isEquippedInPreview
                          ? 'border-[#d4af37] ring-2 ring-amber-400/60 bg-[#091f3a]/80 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'border-[#b8860b]/30 hover:border-amber-400/50 hover:bg-[#07182d]'
                      }`}
                    >
                      {/* Item Header & Details */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-sm text-white roco-title-font truncate group-hover:text-amber-200">
                              {item.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold border shrink-0 ${rarityInfo.badgeClass}`}
                            >
                              {rarityInfo.label}
                            </span>
                          </div>

                          {isEquippedInPreview && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 roco-title-font shrink-0">
                              试穿中
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {item.bonusText && (
                          <div className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{item.bonusText}</span>
                          </div>
                        )}
                      </div>

                      {/* Item Footer & Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        {isUnlocked ? (
                          <div className="flex items-center gap-2 w-full justify-between">
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>已解锁拥有</span>
                            </span>

                            {isEquippedInPreview ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnequipSlot(item.slot);
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
                              >
                                卸下
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTryOn(item);
                                }}
                                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-400/40 text-xs font-bold cursor-pointer transition-colors"
                              >
                                试穿
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300">
                              {item.priceCoins ? (
                                <>
                                  <IconRocoCoin size={15} />
                                  <span>{item.priceCoins} 幻灵金币</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-cyan-400 font-bold">
                                    {item.priceDiamonds} 璀璨幻钻
                                  </span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlockItem(item);
                              }}
                              className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all roco-title-font"
                            >
                              解锁购买
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
