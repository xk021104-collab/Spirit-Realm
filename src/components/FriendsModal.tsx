import React, { useState } from 'react';
import { Friend, FriendAvatarStyle } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { RECOMMENDED_CANDIDATES } from '../data/friends';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { FriendAvatar } from './PlayerAvatar';
import { sound } from '../utils/audio';
import {
  Users,
  UserPlus,
  Sparkles,
  Gift,
  Heart,
  Search,
  Check,
  Compass,
  Footprints,
  ShoppingBag,
  X,
  UserCheck,
  Coins,
} from 'lucide-react';

interface FriendsModalProps {
  friends: Friend[];
  spiritShards: number;
  onClose: () => void;
  onGiftFriend: (friendId: string) => void;
  onClaimFromFriend: (friendId: string) => void;
  onClaimAllAndGiftAll: () => void;
  onToggleFollowInScene: (friendId: string) => void;
  onAddFriend: (newFriend: Friend) => void;
  onRemoveFriend: (friendId: string) => void;
  onExchangeReward: (rewardId: string, cost: number) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  friends,
  spiritShards,
  onClose,
  onGiftFriend,
  onClaimFromFriend,
  onClaimAllAndGiftAll,
  onToggleFollowInScene,
  onAddFriend,
  onRemoveFriend,
  onExchangeReward,
}) => {
  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'ADD' | 'EXCHANGE'>('FRIENDS');
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customStyle, setCustomStyle] = useState<FriendAvatarStyle>('fairy');
  const [customPetSpecies, setCustomPetSpecies] = useState('canglinshenzun');
  const [exchangeNotice, setExchangeNotice] = useState<string | null>(null);

  // Filtered friends
  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.companionPet.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const claimableCount = friends.filter((f) => f.canClaimFromFriend).length;
  const giftableCount = friends.filter((f) => !f.hasGiftedToday).length;

  const handleExchange = (rewardId: string, cost: number, rewardName: string) => {
    if (spiritShards < cost) {
      sound.playAttackHit();
      setExchangeNotice(`友谊魔法碎片不足！兑换【${rewardName}】需要 ${cost} 友谊魔法碎片。`);
      setTimeout(() => setExchangeNotice(null), 3000);
      return;
    }
    sound.playCatchSuccess();
    onExchangeReward(rewardId, cost);
    setExchangeNotice(`✨ 成功消耗 ${cost} 友谊魔法碎片兑换【${rewardName}】！已存入背包。`);
    setTimeout(() => setExchangeNotice(null), 3000);
  };

  const handleCreateCustomFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newFriend: Friend = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      title: '王国探险家 · 魔法学徒',
      level: 30 + Math.floor(Math.random() * 20),
      avatarStyle: customStyle,
      locationId: 'ACADEMY',
      locationName: '魔法学院',
      signature: '探索王国奇迹，与好友共同培养魔法宠物！',
      greeting: `你好呀！今天在轻风山探险收获颇丰，特赠你一枚友谊魔法碎片。`,
      companionPet: {
        speciesId: customPetSpecies,
        nickname: PET_SPECIES[customPetSpecies]?.name || '小宠物',
        level: 32 + Math.floor(Math.random() * 18),
      },
      hasGiftedToday: false,
      canClaimFromFriend: true,
      isFollowingInScene: true, // Auto accompany
      x: 35 + Math.floor(Math.random() * 30),
      y: 65 + Math.floor(Math.random() * 15),
    };

    onAddFriend(newFriend);
    setCustomName('');
    setActiveTab('FRIENDS');
    sound.playCatchSuccess();
  };

  const handleAddCandidate = (cand: typeof RECOMMENDED_CANDIDATES[0]) => {
    const newFriend: Friend = {
      ...cand,
      hasGiftedToday: false,
      canClaimFromFriend: true,
      isFollowingInScene: true,
      x: 35 + Math.floor(Math.random() * 30),
      y: 65 + Math.floor(Math.random() * 15),
    };
    onAddFriend(newFriend);
    sound.playCatchSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none">
      {/* Outer Frame */}
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[740px] bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] border-2 border-[#b8860b]/50 rounded-3xl flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Top Header */}
        <div className="px-5 py-3.5 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Users className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg roco-gold-text roco-title-font tracking-wide flex items-center gap-2">
                  王国好友中心 · 友谊录
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  好友
                </span>
                <span className="text-[10px] text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/40">
                  好友 {friends.length}/50
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block mt-0.5">
                结识洛克王国的魔法伙伴，携手同行冒险，每日互赠友谊魔法碎片兑换珍稀宝物
              </p>
            </div>
          </div>

          {/* Right: Spirit Shards Balance & Close */}
          <div className="flex items-center gap-3">
            {/* Shards Currency Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#061426]/90 border border-amber-400/50 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold font-mono text-amber-200">
                  {spiritShards}
                </span>
                <span className="text-[9px] text-slate-400">友谊碎片</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="roco-close-btn shrink-0"
              title="关闭好友中心"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notice Alert if any */}
        {exchangeNotice && (
          <div className="px-4 py-2 bg-cyan-950/90 border-b border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between animate-fadeIn">
            <span>{exchangeNotice}</span>
            <button
              onClick={() => setExchangeNotice(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation & Search */}
        <div className="px-4 py-2 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('FRIENDS');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'FRIENDS'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>我的好友 ({friends.length})</span>
              {claimableCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                  {claimableCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('ADD');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ADD'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>添加好友</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('EXCHANGE');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'EXCHANGE'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>友谊祈愿工坊</span>
            </button>
          </div>

          {/* Quick Actions on ActiveTab === FRIENDS */}
          {activeTab === 'FRIENDS' && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索好友/跟随宠物..."
                  className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 pl-7 w-40 sm:w-48 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
              </div>

              {(claimableCount > 0 || giftableCount > 0) && (
                <button
                  onClick={() => {
                    sound.playCatchSuccess();
                    onClaimAllAndGiftAll();
                  }}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs shrink-0"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>一键互赠与收取</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1: 我的好友 (My Friends List) */}
        {activeTab === 'FRIENDS' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-2">
                <Users className="w-12 h-12 stroke-1 text-slate-600" />
                <p className="text-sm">暂无匹配的好友记录</p>
                <button
                  onClick={() => setActiveTab('ADD')}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  前往添加新好友
                </button>
              </div>
            ) : (
              filteredFriends.map((friend) => {
                const companionSpecies = PET_SPECIES[friend.companionPet.speciesId];
                const elem = companionSpecies ? ELEMENT_COLORS[companionSpecies.type] : null;

                return (
                  <div
                    key={friend.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md group"
                  >
                    {/* Left: Friend Avatar + Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-slate-800 to-indigo-950/80 border border-cyan-400/40 flex items-center justify-center overflow-hidden shadow-inner ring-1 ring-cyan-500/20">
                          <FriendAvatar style={friend.avatarStyle} size={46} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 text-[9px] font-bold px-1.5 rounded-full border border-cyan-200">
                          Lv.{friend.level}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-200 transition-colors">
                            {friend.name}
                          </span>
                          <span className="text-[10px] text-cyan-300/80 px-2 py-0.2 rounded-full bg-cyan-950/50 border border-cyan-500/20">
                            {friend.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Compass className="w-3.5 h-3.5 text-cyan-400" />
                            {friend.locationName}
                          </span>
                          <span>·</span>
                          <span className="italic text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                            "{friend.signature}"
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Friend's Follower Companion */}
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
                      <div className="relative">
                        <PetAvatar speciesId={friend.companionPet.speciesId} size={36} />
                        <div className="w-8 h-2 bg-cyan-400/20 rounded-full blur-2xs mx-auto -mt-1" />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-cyan-100">
                            {friend.companionPet.nickname}
                          </span>
                          {elem && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${elem.bg} ${elem.text}`}>
                              {elem.label}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          随行宠物 · Lv.{friend.companionPet.level}
                        </span>
                      </div>
                    </div>

                    {/* Right: Interactive Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                      {/* Follow in scene toggle */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          onToggleFollowInScene(friend.id);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                          friend.isFollowingInScene
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                            : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border-slate-700/80 hover:bg-slate-700/60'
                        }`}
                        title={
                          friend.isFollowingInScene
                            ? '当前已在此场景中跟随并肩探索'
                            : '邀请此好友及随行宠物进入场景并肩历练'
                        }
                      >
                        <Footprints className="w-3.5 h-3.5" />
                        <span>{friend.isFollowingInScene ? '同游中' : '邀请同游'}</span>
                      </button>

                      {/* Gift Shard */}
                      <button
                        disabled={friend.hasGiftedToday}
                        onClick={() => {
                          sound.playCatchSuccess();
                          onGiftFriend(friend.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                          friend.hasGiftedToday
                            ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                            : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/40 cursor-pointer shadow-sm'
                        }`}
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>{friend.hasGiftedToday ? '今日已赠' : '赠送碎片'}</span>
                      </button>

                      {/* Claim Shard */}
                      <button
                        disabled={!friend.canClaimFromFriend}
                        onClick={() => {
                          sound.playCatchSuccess();
                          onClaimFromFriend(friend.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                          friend.canClaimFromFriend
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer animate-pulse'
                            : 'bg-slate-800/30 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{friend.canClaimFromFriend ? '收取碎片' : '已收取'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: 结识新伙伴 (Add Friend & Classmates Recommendations) */}
        {activeTab === 'ADD' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* Custom Friend Creation Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100">自定义添加好友 · 魔法伙伴</h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                输入好友昵称，挑选其形象与跟随宠物，即可结为冒险同伴！
              </p>

              <form onSubmit={handleCreateCustomFriend} className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="输入好友昵称（如：菲尔特、可丽希亚、小明...）"
                  className="bg-slate-950/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 flex-1 min-w-[200px] focus:outline-none focus:border-cyan-400"
                  maxLength={10}
                />

                {/* Avatar Style Picker */}
                <select
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value as FriendAvatarStyle)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="wizard">见习小法师 (Wizard Apprentice)</option>
                  <option value="fairy">森林小仙子 (Forest Fairy)</option>
                  <option value="knight">王国小骑士 (Royal Knight)</option>
                  <option value="scholar">博学小学者 (Academy Scholar)</option>
                  <option value="swordsman">剑术学徒 (Sword Apprentice)</option>
                  <option value="taoist">自然使者 (Nature Envoy)</option>
                </select>

                {/* Companion Species Picker */}
                <select
                  value={customPetSpecies}
                  onChange={(e) => setCustomPetSpecies(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="shenlong">苍穹圣龙 (圣光守护龙)</option>
                  <option value="fenghuang">炽火神凰 (火系神凰)</option>
                  <option value="chiyanque">赤焰雀 (初阶火羽)</option>
                  <option value="bishuiling">碧水灵 (初阶水灵)</option>
                  <option value="qingmulu">青木鹿 (初阶神鹿)</option>
                  <option value="dianjihu">电击虎 (初阶雷兽)</option>
                </select>

                <button
                  type="submit"
                  disabled={!customName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40 shrink-0"
                >
                  添加好友
                </button>
              </form>
            </div>

            {/* Recommended Cultivator Pool */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-sm text-slate-200">洛克王国 · 推荐好友</h3>
                </div>
                <span className="text-[11px] text-slate-400">各路见习魔法师，相聚王国即是缘分</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RECOMMENDED_CANDIDATES.map((cand) => {
                  const alreadyFriend = friends.some((f) => f.name === cand.name);
                  const companion = PET_SPECIES[cand.companionPet.speciesId];
                  const elem = companion ? ELEMENT_COLORS[companion.type] : null;

                  return (
                    <div
                      key={cand.id}
                      className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center overflow-hidden shrink-0">
                          <FriendAvatar style={cand.avatarStyle as FriendAvatarStyle} size={38} />
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-100">{cand.name}</span>
                            <span className="text-[9px] text-cyan-300 font-mono">Lv.{cand.level}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{cand.title}</span>
                          <span className="text-[9px] text-slate-400 italic line-clamp-1">
                            "{cand.signature}"
                          </span>
                        </div>
                      </div>

                      {/* Companion & Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative">
                          <PetAvatar speciesId={cand.companionPet.speciesId} size={32} />
                        </div>

                        {alreadyFriend ? (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium px-2 py-1 rounded-lg bg-slate-800/40">
                            <Check className="w-3 h-3 text-emerald-400" />
                            已是好友
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddCandidate(cand)}
                            className="px-2.5 py-1 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-medium transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>添加好友</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 皇家友谊工坊 (Friendship Shard Exchange) */}
        {activeTab === 'EXCHANGE' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    皇家魔法友谊工坊
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    好友每日赠送的友谊魔法碎片，可在此兑换珍稀国王球、高级咕噜球与可可果！
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-400/40 shrink-0">
                <span className="text-xs text-slate-400">当前持有碎片:</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {spiritShards}
                </span>
              </div>
            </div>

            {/* Exchange Offer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. 国王球 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-400/60 transition-all flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-300">国王球 ×1</span>
                    <span className="text-[10px] text-amber-400 font-bold px-1.5 rounded bg-amber-950/80 border border-amber-500/40">
                      100% 必定捕获
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    洛克王国至高无上的圣物！必定百分之百成功收服任何野外宠物，珍稀必中！
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    需要 10 碎片
                  </span>
                  <button
                    onClick={() => handleExchange('gulu_king', 10, '国王球')}
                    className="px-3 py-1 rounded-xl bg-amber-600/40 hover:bg-amber-600/60 text-amber-200 border border-amber-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    兑换
                  </button>
                </div>
              </div>

              {/* 2. 高级咕噜球 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/30 hover:border-indigo-400/60 transition-all flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-300">高级咕噜球 ×2</span>
                    <span className="text-[10px] text-indigo-400 font-bold px-1.5 rounded bg-indigo-950/80 border border-indigo-500/40">
                      超高捕获率
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    皇家工坊精密炼制的高级咕噜球，大幅提高野外宠物捕获成功概率。
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    需要 5 碎片
                  </span>
                  <button
                    onClick={() => handleExchange('gulu_high', 5, '高级咕噜球 ×2')}
                    className="px-3 py-1 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    兑换
                  </button>
                </div>
              </div>

              {/* 3. 严父果 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-300">严父果 ×2</span>
                    <span className="text-[10px] text-emerald-400 font-bold px-1.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                      +2,000 升级经验
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    传说中极其珍贵的魔法圣果，宠物食用后暴涨升级经验，快速触发形态进化！
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    需要 4 碎片
                  </span>
                  <button
                    onClick={() => handleExchange('exp_pill_large', 4, '严父果 ×2')}
                    className="px-3 py-1 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-200 border border-emerald-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    兑换
                  </button>
                </div>
              </div>

              {/* 4. 洛克贝钱袋 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-cyan-300">洛克贝钱袋</span>
                    <span className="text-[10px] text-cyan-400 font-bold px-1.5 rounded bg-cyan-950/80 border border-cyan-500/40">
                      +1,500 洛克贝
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    皇家魔导商会金币袋，打开即可瞬间获取 1,500 洛克贝，可在跳跳集市购买各种道具！
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    需要 3 碎片
                  </span>
                  <button
                    onClick={() => handleExchange('coins_1500', 3, '1,500 洛克贝')}
                    className="px-3 py-1 rounded-xl bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-200 border border-cyan-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    兑换
                  </button>
                </div>
              </div>

              {/* 5. 高级精力全回复剂 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-400/60 transition-all flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-rose-300">高级精力全回复剂 ×2</span>
                    <span className="text-[10px] text-rose-400 font-bold px-1.5 rounded bg-rose-950/80 border border-rose-500/40">
                      精力全回满
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    皇家药剂大师炼制的神奇魔药，瞬间完全回复单只宠物的全部精力生命！
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    需要 4 碎片
                  </span>
                  <button
                    onClick={() => handleExchange('potion_full', 4, '高级精力全回复剂 ×2')}
                    className="px-3 py-1 rounded-xl bg-rose-600/40 hover:bg-rose-600/60 text-rose-200 border border-rose-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    兑换
                  </button>
                </div>
              </div>

              {/* 6. 活力复活药剂 */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-teal-500/30 hover:border-teal-400/60 transition-all flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-teal-300">活力复活药剂 ×2</span>
                    <span className="text-[10px] text-teal-400 font-bold px-1.5 rounded bg-teal-950/80 border border-teal-500/40">
                      战斗复活
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    神奇魔药，可唤醒战斗脱力的宠物并恢复其半数精力，逆转战局！
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    需要 4 碎片
                  </span>
                  <button
                    onClick={() => handleExchange('revive_herb', 4, '活力复活药剂 ×2')}
                    className="px-3 py-1 rounded-xl bg-teal-600/40 hover:bg-teal-600/60 text-teal-200 border border-teal-500/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    兑换
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
