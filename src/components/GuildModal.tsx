import React, { useState } from 'react';
import { GuildInfo, GuildSkill } from '../types/game';
import { sound } from '../utils/audio';
import { Shield, Users, Coins, Sparkles, Zap, Check, X, ArrowUp, Crown } from 'lucide-react';

interface GuildModalProps {
  guild: GuildInfo;
  onClaimSalary: () => void;
  onUpgradeGuildSkill: (skillId: string) => void;
  onClose: () => void;
}

export const GuildModal: React.FC<GuildModalProps> = ({
  guild,
  onClaimSalary,
  onUpgradeGuildSkill,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'HALL' | 'SKILLS' | 'MEMBERS'>('HALL');
  const [notice, setNotice] = useState<string | null>(null);

  const handleClaim = () => {
    if (guild.hasClaimedSalaryToday) return;
    sound.playCatchSuccess();
    onClaimSalary();
    setNotice('成功领取今日公会每日津贴：星辉金币 +1,000，公会贡献 +50！');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleUpgradeSkill = (skill: GuildSkill) => {
    if (guild.playerDevotion < skill.cost) {
      sound.playClick();
      setNotice('公会贡献不足，无法研习更高级魔导科技！');
      setTimeout(() => setNotice(null), 2500);
      return;
    }
    sound.playLevelUp();
    onUpgradeGuildSkill(skill.id);
    setNotice(`恭喜研习【${skill.name}】至第 ${skill.level + 1} 阶！全队属性获得提升！`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-4xl h-[86vh] max-h-[720px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#b8860b]/50 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] overflow-hidden text-slate-100">
        
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  {guild.name} · 皇家公会
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  公会
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest hidden sm:inline">— ROYAL MAGIC GUILD —</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                公会等级 Lv.{guild.level} · 会长【{guild.leaderName}】 · 公会成员 ({guild.memberCount}/{guild.maxMembers})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-purple-500/30 text-xs shadow-inner">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">公会贡献:</span>
              <span className="font-mono font-bold text-purple-300">{guild.playerDevotion}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="roco-close-btn shrink-0"
              title="离开公会"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950/80 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[
              { id: 'HALL', label: '公会大厅与津贴', icon: Shield },
              { id: 'SKILLS', label: '公会魔导研究', icon: Zap },
              { id: 'MEMBERS', label: '公会成员名录', icon: Users },
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
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            disabled={guild.hasClaimedSalaryToday}
            onClick={handleClaim}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{guild.hasClaimedSalaryToday ? '今日津贴已领' : '领取每日公会津贴 (+1000 星辉金币)'}</span>
          </button>
        </div>

        {notice && (
          <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 text-xs px-6 py-2 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-amber-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: HALL */}
          {activeTab === 'HALL' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-amber-300">公会导师训诫告示板</span>
                  <span className="text-[10px] text-slate-500 font-mono">每日 00:00 刷新</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {guild.notice}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">公会金库星辉金币</div>
                  <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                    {guild.totalFunds.toLocaleString()} 星辉金币
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">皇家公会战阶</div>
                  <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                    白金三阶魔法公会
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">魔导科技加成</div>
                  <div className="text-lg font-bold font-mono text-purple-300 mt-1">
                    全队攻击 +{guild.skills[0]?.level * 5}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === 'SKILLS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                消耗公会贡献点，研习公会魔导核心科技，永久强化出战宠物的六维战斗属性！
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {guild.skills.map((sk) => {
                  const canAfford = guild.playerDevotion >= sk.cost;
                  const isMax = sk.level >= sk.maxLevel;

                  return (
                    <div
                      key={sk.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-200">{sk.name}</span>
                          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800">
                            第 {sk.level}/{sk.maxLevel} 阶
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{sk.description}</p>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          当前加成: +{sk.level * sk.bonusPerLevel} 点
                        </div>
                      </div>

                      <button
                        disabled={isMax || !canAfford}
                        onClick={() => handleUpgradeSkill(sk)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-all shadow flex items-center gap-1 shrink-0"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>{isMax ? '已至上限' : `研习 (-${sk.cost}贡献)`}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERS */}
          {activeTab === 'MEMBERS' && (
            <div className="space-y-2">
              {[
                { name: '大法师·奥古斯丁', role: '会长', level: 55, devotion: 1420 },
                { name: '炽火狂骑·卡特', role: '副会长', level: 48, devotion: 980 },
                { name: '沧海使者·艾琳', role: '魔法导师', level: 42, devotion: 650 },
                { name: '见习小魔法师', role: '精英学员 (我)', level: 22, devotion: guild.playerDevotion },
                { name: '雷霆游侠·莱恩', role: '正式成员', level: 38, devotion: 420 },
              ].map((mem, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {idx === 0 ? <Crown className="w-4 h-4 text-amber-400" /> : <span className="w-4 text-slate-500 font-mono">{idx + 1}</span>}
                    <span className="font-bold text-slate-200">{mem.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {mem.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-slate-400">Lv.{mem.level}</span>
                    <span className="text-purple-300">{mem.devotion} 贡献</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
