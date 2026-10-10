import React, { useState } from 'react';
import { LeaderboardItem, PetInstance } from '../types/game';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audio';
import { Trophy, BookOpen, Crown, Medal, Award, Flame, X, Check, ThumbsUp, Sparkles } from 'lucide-react';

interface LeaderboardModalProps {
  myPlayerName: string;
  myCombatPower: number;
  myDexCount: number;
  myLevel: number;
  myLeaderSpeciesId: string;
  onPraiseLeader: () => void;
  hasPraisedToday: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  myPlayerName,
  myCombatPower,
  myDexCount,
  myLevel,
  myLeaderSpeciesId,
  onPraiseLeader,
  hasPraisedToday,
  onClose,
}) => {
  const [activeBoard, setActiveBoard] = useState<'POWER' | 'DEX'>('POWER');
  const [praiseNotice, setPraiseNotice] = useState<string | null>(null);

  // High-level players seed data
  const basePowerRankings: LeaderboardItem[] = [
    {
      rank: 1,
      playerId: 'p-002',
      playerName: '大法师·奥古斯丁',
      playerTitle: '皇家学院名誉院长',
      score: 18450,
      level: 55,
      avatarPetSpeciesId: 'shenlong',
      vipLevel: 3,
    },
    {
      rank: 2,
      playerId: 'p-003',
      playerName: '炽火狂骑·卡特',
      playerTitle: '维苏威火山领主',
      score: 14200,
      level: 48,
      avatarPetSpeciesId: 'fenghuang',
      vipLevel: 2,
    },
    {
      rank: 3,
      playerId: 'p-005',
      playerName: '沧海使者·艾琳',
      playerTitle: '人鱼湾潮汐守护者',
      score: 11900,
      level: 42,
      avatarPetSpeciesId: 'bishuiling',
      vipLevel: 2,
    },
    {
      rank: 4,
      playerId: 'p-006',
      playerName: '霜风魔导师·雷恩',
      playerTitle: '极光冰原守护者',
      score: 9800,
      level: 38,
      avatarPetSpeciesId: 'dianjihu',
      vipLevel: 1,
    },
    {
      rank: 5,
      playerId: 'p-007',
      playerName: '圣殿骑士·兰斯',
      playerTitle: '皇家骑士团教官',
      score: 8650,
      level: 35,
      avatarPetSpeciesId: 'qingmulu',
      vipLevel: 1,
    },
  ];

  const baseDexRankings: LeaderboardItem[] = [
    {
      rank: 1,
      playerId: 'p-002',
      playerName: '大法师·奥古斯丁',
      playerTitle: '皇家学院名誉院长',
      score: 16,
      level: 55,
      avatarPetSpeciesId: 'shenlong',
      vipLevel: 3,
    },
    {
      rank: 2,
      playerId: 'p-005',
      playerName: '沧海使者·艾琳',
      playerTitle: '人鱼湾潮汐守护者',
      score: 14,
      level: 42,
      avatarPetSpeciesId: 'bishuiling',
      vipLevel: 2,
    },
    {
      rank: 3,
      playerId: 'p-003',
      playerName: '炽火狂骑·卡特',
      playerTitle: '维苏威火山领主',
      score: 12,
      level: 48,
      avatarPetSpeciesId: 'fenghuang',
      vipLevel: 2,
    },
    {
      rank: 4,
      playerId: 'p-007',
      playerName: '圣殿骑士·兰斯',
      playerTitle: '皇家骑士团教官',
      score: 10,
      level: 35,
      avatarPetSpeciesId: 'qingmulu',
      vipLevel: 1,
    },
  ];

  // Insert or calculate local player's ranking
  const myPowerEntry: LeaderboardItem = {
    rank: 6,
    playerId: 'p-local',
    playerName: myPlayerName,
    playerTitle: '天命契约者',
    score: myCombatPower,
    level: myLevel,
    avatarPetSpeciesId: myLeaderSpeciesId || 'chiyanque',
  };

  const myDexEntry: LeaderboardItem = {
    rank: 5,
    playerId: 'p-local',
    playerName: myPlayerName,
    playerTitle: '天命契约者',
    score: myDexCount,
    level: myLevel,
    avatarPetSpeciesId: myLeaderSpeciesId || 'chiyanque',
  };

  const currentRankings = (
    activeBoard === 'POWER'
      ? [...basePowerRankings, myPowerEntry].sort((a, b) => b.score - a.score)
      : [...baseDexRankings, myDexEntry].sort((a, b) => b.score - a.score)
  ).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const myRankItem = currentRankings.find((r) => r.playerId === 'p-local');

  const handlePraise = () => {
    if (hasPraisedToday) return;
    sound.playCatchSuccess();
    onPraiseLeader();
    setPraiseNotice('膜拜天梯榜首成功！获得王国洛克贝 +200 奖励！');
    setTimeout(() => setPraiseNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-3xl h-[86vh] max-h-[720px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#b8860b]/50 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] overflow-hidden text-slate-100">
        
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  洛克王国 · 皇家天梯排行榜
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  天梯榜
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest hidden sm:inline">— LEADERBOARD —</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">王国小魔法师宠物战力巅峰与图鉴收集宗师排行榜</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-close-btn shrink-0"
            title="关闭排行榜"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board Switcher */}
        <div className="bg-slate-950/80 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveBoard('POWER');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeBoard === 'POWER'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>宠物综合战力榜</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveBoard('DEX');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeBoard === 'DEX'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>魔兽图鉴收集榜</span>
            </button>
          </div>

          <button
            disabled={hasPraisedToday}
            onClick={handlePraise}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 disabled:opacity-50 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
            <span>{hasPraisedToday ? '今日已膜拜榜首' : '每日膜拜榜首 (+200洛克贝)'}</span>
          </button>
        </div>

        {praiseNotice && (
          <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 text-xs px-6 py-2 flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{praiseNotice}</span>
          </div>
        )}

        {/* Rankings List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {currentRankings.map((entry) => {
            const isMe = entry.playerId === 'p-local';
            const isTop1 = entry.rank === 1;
            const isTop2 = entry.rank === 2;
            const isTop3 = entry.rank === 3;

            return (
              <div
                key={`${entry.rank}-${entry.playerId}`}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isMe
                    ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md ring-1 ring-cyan-400'
                    : isTop1
                    ? 'bg-gradient-to-r from-amber-950/50 via-slate-950/80 to-slate-950/80 border-amber-500/60 shadow'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                {/* Rank & Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center font-black font-mono">
                    {isTop1 ? (
                      <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
                    ) : isTop2 ? (
                      <Medal className="w-5 h-5 text-slate-300" />
                    ) : isTop3 ? (
                      <Medal className="w-5 h-5 text-amber-600" />
                    ) : (
                      <span className="text-sm text-slate-400">#{entry.rank}</span>
                    )}
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <PetAvatar speciesId={entry.avatarPetSpeciesId} size={36} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isMe ? 'text-cyan-300' : 'text-slate-100'}`}>
                        {entry.playerName}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 border border-cyan-700 text-cyan-300">
                          我
                        </span>
                      )}
                      {entry.vipLevel && entry.vipLevel > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-950 border border-amber-700 text-amber-400 font-bold">
                          VIP{entry.vipLevel}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{entry.playerTitle} · Lv.{entry.level}</div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-amber-300">
                    {activeBoard === 'POWER' ? `${entry.score.toLocaleString()} 战力` : `${entry.score} 种宠物`}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {activeBoard === 'POWER' ? '全队评分' : '图鉴点亮率'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: My Status */}
        <div className="px-6 py-3 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">我的实时名次:</span>
            <span className="font-mono font-bold text-amber-300">
              第 {myRankItem?.rank || '-'} 名
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              当前{activeBoard === 'POWER' ? '战力' : '图鉴'}:{' '}
              <strong className="text-cyan-300 font-mono">
                {activeBoard === 'POWER' ? `${myCombatPower} 点` : `${myDexCount}/16 只`}
              </strong>
            </span>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            天梯榜每 10 分钟基于 Redis 实时刷新
          </span>
        </div>

      </div>
    </div>
  );
};
