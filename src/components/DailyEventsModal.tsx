import React, { useState } from 'react';
import { Gift, Sparkles, Award, Compass, Zap, Flame, Droplets, Check, X, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';
import { PetInstance } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { PetAvatar } from './PetAvatar';
import { createPetInstance } from '../utils/battleEngine';

interface DailyEventsModalProps {
  playerCoins: number;
  onAddCoins: (amt: number) => void;
  onAddItem: (itemId: string, count: number) => void;
  onStartBossBattle: (bossPet: PetInstance) => void;
  onClose: () => void;
}

export const DailyEventsModal: React.FC<DailyEventsModalProps> = ({
  playerCoins,
  onAddCoins,
  onAddItem,
  onStartBossBattle,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'SIGNIN' | 'WHEEL' | 'BOSS'>('SIGNIN');

  // Signin state
  const [signedDays, setSignedDays] = useState<number[]>([1]);
  const [justSignedDay, setJustSignedDay] = useState<number | null>(null);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelReward, setWheelReward] = useState<string | null>(null);

  const SIGNIN_REWARDS = [
    { day: 1, name: '洛克贝 500 + 普通咕噜球x5', coins: 500, itemId: 'gulu_normal', itemCount: 5 },
    { day: 2, name: '经验可可果x3', coins: 300, itemId: 'exp_pill_small', itemCount: 3 },
    { day: 3, name: '中级咕噜球x3', coins: 600, itemId: 'gulu_mid', itemCount: 3 },
    { day: 4, name: '中级精力药剂x5', coins: 800, itemId: 'potion_mid', itemCount: 5 },
    { day: 5, name: '高级咕噜球x2', coins: 1000, itemId: 'gulu_high', itemCount: 2 },
    { day: 6, name: '大袋可可果x2', coins: 1500, itemId: 'exp_pill_large', itemCount: 2 },
    { day: 7, name: '国王咕噜球 (100%必中神器!)', coins: 3000, itemId: 'gulu_king', itemCount: 1 },
  ];

  const handleSignIn = (day: number) => {
    if (signedDays.includes(day)) return;
    sound.playCatchSuccess();
    setSignedDays([...signedDays, day]);
    setJustSignedDay(day);

    const rew = SIGNIN_REWARDS.find((r) => r.day === day);
    if (rew) {
      onAddCoins(rew.coins);
      onAddItem(rew.itemId, rew.itemCount);
    }
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    sound.playClick();
    setIsSpinning(true);
    setWheelReward(null);

    setTimeout(() => {
      sound.playCatchSuccess();
      setIsSpinning(false);
      const rewards = [
        { text: '恭喜抽中【洛克贝 x888】！', coins: 888 },
        { text: '恭喜抽中【中级咕噜球 x3】！', itemId: 'gulu_mid', count: 3 },
        { text: '恭喜抽中【经验可可果 x2】！', itemId: 'exp_pill_small', count: 2 },
        { text: '运气爆棚！抽中【高级咕噜球 x1】！', itemId: 'gulu_high', count: 1 },
      ];
      const pick = rewards[Math.floor(Math.random() * rewards.length)];
      setWheelReward(pick.text);
      if (pick.coins) onAddCoins(pick.coins);
      if (pick.itemId) onAddItem(pick.itemId, pick.count || 1);
    }, 1800);
  };

  const handleChallengeBoss = (speciesId: string, level: number) => {
    sound.playAttackHit();
    const boss = createPetInstance(speciesId, level);
    boss.nickname = `【稀有试炼】${boss.nickname}`;
    onStartBossBattle(boss);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] border-2 border-[#b8860b]/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Top Header */}
        <div className="h-16 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Gift className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black roco-gold-text roco-title-font flex items-center gap-2">
                  洛克王国 · 盛典活动中心
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  盛典
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest hidden sm:inline">— DAILY EVENTS —</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                魔法学院每日精彩福利与稀有宠物挑战降临！
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-close-btn shrink-0"
            title="关闭活动中心"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#040e1b]/60 px-6 py-2.5 border-b border-[#b8860b]/25 flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('SIGNIN');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font ${
              activeTab === 'SIGNIN'
                ? 'roco-turn-capsule text-slate-950 shadow-md'
                : 'bg-[#061426] text-amber-200/80 hover:text-white border border-[#b8860b]/30'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>七日神签 (领必抓圣皇晶)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('WHEEL');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font ${
              activeTab === 'WHEEL'
                ? 'roco-turn-capsule text-slate-950 shadow-md'
                : 'bg-[#061426] text-amber-200/80 hover:text-white border border-[#b8860b]/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>天机转盘 (每日运势)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('BOSS');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 roco-title-font ${
              activeTab === 'BOSS'
                ? 'roco-turn-capsule text-slate-950 shadow-md'
                : 'bg-[#061426] text-amber-200/80 hover:text-white border border-[#b8860b]/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>上古神兽降世</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/90 text-sm">
          {activeTab === 'SIGNIN' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 p-4 rounded-xl border border-amber-500/40 flex items-center justify-between">
                <div>
                  <h3 className="text-amber-300 font-black text-sm game-title-font">七日签到大礼包</h3>
                  <p className="text-xs text-slate-300">
                    每日登录王国即可领取丰厚洛克贝、经验可可果与珍贵咕噜球！第7天必得百分百必中神物【国王咕噜球】！
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  已签到：{signedDays.length}/7 天
                </span>
              </div>

              {justSignedDay && (
                <div className="bg-emerald-950 border border-emerald-400 p-2.5 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <Check className="w-4 h-4" />
                  <span>恭喜成功领取第 {justSignedDay} 天登录嘉奖！物品已放入魔法行囊！</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {SIGNIN_REWARDS.map((r) => {
                  const isDone = signedDays.includes(r.day);
                  const isCurrent = r.day === signedDays.length + 1;

                  return (
                    <div
                      key={r.day}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[160px] text-center relative ${
                        isDone
                          ? 'bg-slate-950/80 border-slate-700 opacity-70'
                          : isCurrent
                          ? 'bg-gradient-to-b from-amber-950 to-slate-900 border-amber-400 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="w-full flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <span>第 {r.day} 天</span>
                        {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>

                      <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center my-2">
                        {r.day === 7 ? (
                          <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
                        ) : (
                          <Gift className="w-6 h-6 text-amber-400" />
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-amber-200 line-clamp-2">
                        {r.name}
                      </span>

                      {isDone ? (
                        <span className="mt-2 text-[10px] text-emerald-400 font-bold">已领取</span>
                      ) : isCurrent ? (
                        <button
                          onClick={() => handleSignIn(r.day)}
                          className="mt-2 flash-gold-btn px-2.5 py-1 rounded text-[10px] w-full cursor-pointer"
                        >
                          立即签到
                        </button>
                      ) : (
                        <span className="mt-2 text-[10px] text-slate-500">待解锁</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'WHEEL' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <h3 className="text-base font-black text-rose-300 game-title-font mb-2">
                皇家魔法星盘 · 每日转盘抽取
              </h3>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                拨动神秘魔法星盘，获取魔法道具、高级咕噜球与美味可可果！
              </p>

              <div className="relative w-56 h-56 rounded-full border-4 border-amber-400 bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 shadow-2xl flex items-center justify-center mb-6 overflow-hidden">
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    isSpinning ? 'animate-[spin_0.4s_linear_infinite]' : ''
                  }`}
                >
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-amber-300/60" />
                  <div className="absolute w-36 h-36 rounded-full border border-rose-400/50" />
                  <Sparkles className="w-8 h-8 text-amber-400 absolute top-4" />
                  <Zap className="w-8 h-8 text-cyan-400 absolute bottom-4" />
                  <Flame className="w-8 h-8 text-rose-400 absolute left-4" />
                  <Droplets className="w-8 h-8 text-emerald-400 absolute right-4" />
                </div>

                <div className="w-16 h-16 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-black text-xs z-10">
                  {isSpinning ? '祈愿中' : '星盘'}
                </div>
              </div>

              {wheelReward && (
                <div className="bg-rose-950 border-2 border-rose-400 px-6 py-2 rounded-xl text-rose-200 font-bold text-xs mb-4 animate-bounce">
                  ✨ {wheelReward}
                </div>
              )}

              <button
                disabled={isSpinning}
                onClick={handleSpinWheel}
                className="flash-gold-btn px-8 py-2 rounded-xl text-sm font-black cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSpinning ? '魔法解析中...' : '开始转动星盘 (免费)'}
              </button>
            </div>
          )}

          {activeTab === 'BOSS' && (
            <div className="space-y-4">
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-500/40">
                <h3 className="text-purple-300 font-black text-sm game-title-font">
                  皇家试炼场 · 稀有宠物挑战
                </h3>
                <p className="text-xs text-slate-300">
                  战胜强大的高阶宠物，证明你的魔法实力，不仅能获得巨量经验，还可使用【国王咕噜球】将其直接捕获！
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Boss 1: 焚天凰 */}
                <div className="bg-slate-950 p-4 rounded-xl border-2 border-rose-500 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PetAvatar speciesId="fentianhuang" size={72} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-rose-400">焚天凰</span>
                        <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-400 px-1 rounded">
                          Lv.45 烈焰领主
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        火系终极形态，掌握天火烈焰与魔羽裂爪
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleChallengeBoss('fentianhuang', 45)}
                    className="flash-red-btn px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    挑战试炼
                  </button>
                </div>

                {/* Boss 2: 凌霄海皇 */}
                <div className="bg-slate-950 p-4 rounded-xl border-2 border-cyan-500 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PetAvatar speciesId="lingxiaohaihuang" size={72} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-cyan-400">凌霄海皇</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-400 px-1 rounded">
                          Lv.45 深海领主
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        水系终极形态，掌握万顷圣泉与沧海龙吟
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleChallengeBoss('lingxiaohaihuang', 45)}
                    className="flash-blue-btn px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    挑战试炼
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400">
          <span>每日凌晨 00:00 自动刷新盛典奖励</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          >
            返回圣境
          </button>
        </div>
      </div>
    </div>
  );
};
