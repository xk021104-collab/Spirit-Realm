import React, { useState } from 'react';
import { InventorySlot, Item } from '../types/game';
import { ITEMS_DATA } from '../data/items';
import { sound } from '../utils/audio';
import { ShoppingBag, Coins, CircleDot, Heart, X, Check, ArrowRightLeft, Sparkles } from 'lucide-react';

interface ShopModalProps {
  playerCoins: number;
  inventory: InventorySlot[];
  onBuyItem: (itemId: string, count: number, totalCost: number) => void;
  onSellItem?: (itemId: string, count: number, totalEarned: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  playerCoins,
  inventory,
  onBuyItem,
  onSellItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'BALLS' | 'POTIONS' | 'CULTIVATION' | 'SELL'>('BALLS');
  const [buyCount, setBuyCount] = useState<number>(1);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const ballItems = Object.values(ITEMS_DATA).filter((i) => i.category === 'BALL');
  const potionItems = Object.values(ITEMS_DATA).filter((i) => ['POTION', 'PP', 'REVIVE'].includes(i.category));
  const cultivationItems = Object.values(ITEMS_DATA).filter((i) => i.category === 'CULTIVATION');

  const handlePurchase = (item: Item) => {
    const totalCost = item.price * buyCount;
    if (playerCoins < totalCost) {
      sound.playClick();
      setFeedbackMessage('灵石不足，无法完成请购！');
      setTimeout(() => setFeedbackMessage(null), 2500);
      return;
    }

    sound.playCatchSuccess();
    onBuyItem(item.id, buyCount, totalCost);
    setFeedbackMessage(`成功购买 【${item.name}】 x${buyCount}！`);
    setTimeout(() => {
      setFeedbackMessage(null), 2000;
    });
  };

  const handleSell = (item: Item, currentCount: number) => {
    if (!onSellItem || currentCount <= 0) return;
    const sellPrice = item.sellPrice || Math.floor(item.price * 0.5);
    const countToSell = Math.min(buyCount, currentCount);
    const totalEarned = sellPrice * countToSell;

    sound.playCatchSuccess();
    onSellItem(item.id, countToSell, totalEarned);
    setFeedbackMessage(`成功典当 【${item.name}】 x${countToSell}，获得 ${totalEarned} 灵石！`);
    setTimeout(() => setFeedbackMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative border-2 border-[#b8860b]/50 rounded-3xl w-full max-w-4xl h-[84vh] max-h-[700px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17]">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <ShoppingBag className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  万象珍宝阁 · 请购与典当
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  宝阁
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest hidden sm:inline">— TREASURE SHOP —</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">九洲灵石贸易行 · 选购奇珍灵药、典当储物行囊</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 shadow-inner">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">灵石:</span>
              <span className="text-sm font-bold font-mono text-amber-300">{playerCoins.toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="roco-medallion-btn text-amber-200 cursor-pointer"
              title="关闭珍宝阁"
            >
              <X className="w-5 h-5 text-amber-200 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </button>
          </div>
        </div>

        {/* Tab & Batch Selector */}
        <div className="bg-slate-950/80 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {[
              { id: 'BALLS', label: '契约晶石', icon: CircleDot },
              { id: 'POTIONS', label: '灵药仙丹', icon: Heart },
              { id: 'CULTIVATION', label: '洗髓造化', icon: Sparkles },
              { id: 'SELL', label: '行囊典当', icon: ArrowRightLeft },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>数量倍率:</span>
            {[1, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setBuyCount(num)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  buyCount === num
                    ? 'bg-amber-600/40 border border-amber-400 text-amber-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                x{num}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 text-xs px-6 py-2 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-amber-400" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'SELL' ? (
            /* Sell/Pawn Tab */
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                可将储物行囊内多余的道具折价 50% 典当给万象珍宝阁，换取充沛灵石资金。
              </p>
              {inventory.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-12">
                  储物行囊空空如也，暂无可典当物品
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inventory.map((slot) => {
                    const item = ITEMS_DATA[slot.itemId];
                    if (!item || slot.count <= 0) return null;
                    const sellPrice = item.sellPrice || Math.floor(item.price * 0.5);

                    return (
                      <div
                        key={slot.itemId}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{item.name}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                              拥有: {slot.count}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                          <div className="text-[11px] text-amber-400 font-mono">
                            典当单价: {sellPrice} 灵石
                          </div>
                        </div>

                        <button
                          onClick={() => handleSell(item, slot.count)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold cursor-pointer transition-colors"
                        >
                          典当 x{Math.min(buyCount, slot.count)}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Buy Tabs */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeTab === 'BALLS' ? ballItems : activeTab === 'POTIONS' ? potionItems : cultivationItems).map(
                (item) => {
                  const inBag = inventory.find((i) => i.itemId === item.id)?.count || 0;
                  const totalCost = item.price * buyCount;
                  const canAfford = playerCoins >= totalCost;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100">{item.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            已拥有: <strong className="text-cyan-400">{inBag}</strong>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <div className="text-xs font-mono font-bold text-amber-300">
                          {totalCost.toLocaleString()} 灵石
                          {buyCount > 1 && <span className="text-[10px] text-slate-500 ml-1">({item.price}/个)</span>}
                        </div>

                        <button
                          disabled={!canAfford}
                          onClick={() => handlePurchase(item)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all"
                        >
                          请购 x{buyCount}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
