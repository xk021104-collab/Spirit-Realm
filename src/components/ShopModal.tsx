import React, { useState } from 'react';
import { InventorySlot, Item } from '../types/game';
import { ITEMS_DATA } from '../data/items';
import { sound } from '../utils/audio';
import { ShoppingBag, Coins, CircleDot, Heart, X, Check } from 'lucide-react';

interface ShopModalProps {
  playerCoins: number;
  inventory: InventorySlot[];
  onBuyItem: (itemId: string, count: number, totalCost: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  playerCoins,
  inventory,
  onBuyItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'BALLS' | 'POTIONS'>('BALLS');
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  const ballItems = Object.values(ITEMS_DATA).filter((i) => i.category === 'BALL');
  const potionItems = Object.values(ITEMS_DATA).filter((i) => ['POTION', 'PP', 'REVIVE'].includes(i.category));

  const itemsToShow = activeTab === 'BALLS' ? ballItems : potionItems;

  const handlePurchase = (item: Item) => {
    if (playerCoins < item.price) {
      sound.playClick();
      return;
    }
    sound.playCatchSuccess();
    onBuyItem(item.id, 1, item.price);
    setPurchaseSuccessMessage(`成功购买 【${item.name}】！`);
    setTimeout(() => {
      setPurchaseSuccessMessage(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-3xl h-[80vh] max-h-[660px] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 tracking-wide flex items-center gap-2">
                万象珍宝阁 <span className="text-xs text-slate-400 font-normal">Treasure Bazaar</span>
              </h2>
              <p className="text-xs text-slate-400">阁主葛乾 · 供应各阶灵契宝玉与回春圣药</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-amber-400/30 font-mono text-xs">
              <Coins className="w-4 h-4 text-amber-300" />
              <span className="text-amber-300 font-bold">{playerCoins}</span>
              <span className="text-slate-400">灵石</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('BALLS');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'BALLS'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>灵契晶石 (收服幻灵)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('POTIONS');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'POTIONS'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>灵丹妙药 (气血调息)</span>
            </button>
          </div>

          {purchaseSuccessMessage && (
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
              <Check className="w-4 h-4" />
              <span>{purchaseSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {itemsToShow.map((item) => {
            const currentOwned = inventory.find((i) => i.itemId === item.id)?.count || 0;
            const canAfford = playerCoins >= item.price;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-white">{item.name}</span>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {item.price} 灵石
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                  <span className="text-xs text-slate-400 font-mono">已拥有: {currentOwned} 枚</span>
                  <button
                    disabled={!canAfford}
                    onClick={() => handlePurchase(item)}
                    className="py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                  >
                    {canAfford ? '立即购买' : '灵石不足'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
