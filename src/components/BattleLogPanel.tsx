import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ElementType } from '../types/game';
import { ELEMENT_COLORS } from './PetAvatar';
import { sound } from '../utils/audio';
import {
  Swords,
  Shield,
  Zap,
  Sparkles,
  Heart,
  Flame,
  Droplets,
  Trees,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
  Maximize2,
  Clock,
  Activity,
  FileText,
  Filter,
  CheckCircle2,
  Sun,
  CloudRain,
  Wind,
  Scroll,
} from 'lucide-react';

export type CombatLogType =
  | 'MOVE'           // Move executed
  | 'DAMAGE'         // Damage inflicted
  | 'HEAL'           // HP recovered
  | 'STATUS_BURN'    // Burn status inflicted
  | 'STATUS_SLEEP'   // Sleep status inflicted
  | 'STATUS_PARALYZE'// Paralyze status inflicted
  | 'STATUS_TICK'    // Status effect damage tick
  | 'STATUS_CURED'   // Status effect cured/woke up
  | 'STAT_BUFF'      // Stat buff applied (+atk, +speed, etc.)
  | 'STAT_DEBUFF'    // Stat debuff applied (-def, etc.)
  | 'WEATHER'        // Weather change / passive tick
  | 'FAINT'          // Pet fainted
  | 'CAPTURE'        // Capture attempt
  | 'SWITCH'         // Pet switch
  | 'SYSTEM';        // Battle init, round transitions

export interface CombatLogRecord {
  id: string;
  turn: number;
  time: string;
  type: CombatLogType;
  actorSide: 'PLAYER' | 'ENEMY' | 'ENVIRONMENT' | 'SYSTEM';
  actorName?: string;
  targetName?: string;
  moveName?: string;
  element?: ElementType;
  category?: 'PHYSICAL' | 'SPECIAL' | 'STATUS';
  damage?: number;
  heal?: number;
  isCrit?: boolean;
  multiplier?: number; // 2.0 (super-effective), 0.5 (not very effective), 1.0 (normal)
  statName?: string;   // '物攻', '物防', '特攻', '特防', '速度'
  statAmount?: number; // +1, -1, etc.
  statusName?: string; // '灼烧', '沉睡', '麻痹'
  weatherMsg?: string;
  message: string;
}

interface BattleLogPanelProps {
  logs: CombatLogRecord[];
  currentTurn: number;
  onOpenFullLog: () => void;
  className?: string;
}

/**
 * 战况指挥台 · 实时斗法战录 (Compact Console Battle Log Component)
 * Designed for BattleView lower command console:
 * - Clear badges for Move execution, Damage numbers, Crits, Effectiveness, and Status changes
 * - Fast-action auto-scroll with visual emphasis on newest events
 * - Quick filter pills: 全部 / 招式伤害 / 状态变化
 * - Expand button to inspect the full Combat Chronicle
 */
export const BattleLogPanel: React.FC<BattleLogPanelProps> = ({
  logs,
  currentTurn,
  onOpenFullLog,
  className = '',
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DAMAGE' | 'STATUS'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredLogs = useMemo(() => {
    if (activeFilter === 'DAMAGE') {
      return logs.filter((l) => l.type === 'MOVE' || l.type === 'DAMAGE' || l.type === 'HEAL');
    }
    if (activeFilter === 'STATUS') {
      return logs.filter(
        (l) =>
          l.type === 'STATUS_BURN' ||
          l.type === 'STATUS_SLEEP' ||
          l.type === 'STATUS_PARALYZE' ||
          l.type === 'STATUS_TICK' ||
          l.type === 'STATUS_CURED' ||
          l.type === 'STAT_BUFF' ||
          l.type === 'STAT_DEBUFF'
      );
    }
    return logs;
  }, [logs, activeFilter]);

  // Keep latest visible
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs]);

  // Total recent actions count for badge
  const unreadCount = logs.length;

  return (
    <div
      className={`w-full md:w-80 rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b from-[#0c1e33]/95 via-[#081525]/95 to-[#040c17]/98 border border-cyan-500/40 text-xs shadow-xl flex flex-col justify-between h-32 md:h-32 backdrop-blur-md relative overflow-hidden select-none ${className}`}
    >
      {/* 1. Header Bar: Title, Active Turn, Filter Pills & Expand Button */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-1.5 mb-1.5 gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-amber-300 flex items-center gap-1 tracking-wider text-xs">
            <Scroll className="w-3.5 h-3.5 text-cyan-400" />
            <span>斗法战录</span>
          </span>
          <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
            回合 {currentTurn}
          </span>
        </div>

        {/* Quick Filter Switcher Pills */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-lg p-0.5 text-[9px]">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-1.5 py-0.2 rounded font-bold cursor-pointer transition-colors ${
                activeFilter === 'ALL' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveFilter('DAMAGE')}
              className={`px-1.5 py-0.2 rounded font-bold cursor-pointer transition-colors ${
                activeFilter === 'DAMAGE' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              伤害
            </button>
            <button
              onClick={() => setActiveFilter('STATUS')}
              className={`px-1.5 py-0.2 rounded font-bold cursor-pointer transition-colors ${
                activeFilter === 'STATUS' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              状态
            </button>
          </div>

          {/* Expand Full Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenFullLog();
            }}
            title="查看完整战斗纪事统计"
            className="p-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-800/80 text-cyan-300 hover:text-white border border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="text-[9px] font-mono hidden sm:inline">详记</span>
          </button>
        </div>
      </div>

      {/* 2. Scrolling Combat Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 leading-relaxed scrollbar-thin text-slate-200"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-slate-400 italic">
            暂无此分类战况记录...
          </div>
        ) : (
          filteredLogs.slice(-15).map((log, idx) => (
            <div
              key={log.id}
              className={`text-[11px] flex items-start gap-1.5 transition-all ${
                idx === filteredLogs.slice(-15).length - 1
                  ? 'bg-cyan-500/10 p-1 rounded-lg border border-cyan-500/30'
                  : 'p-0.5'
              }`}
            >
              {/* Type Icon Badge */}
              <div className="shrink-0 mt-0.5">
                {log.type === 'MOVE' && (
                  <span className="w-4 h-4 rounded bg-blue-600/30 border border-blue-400/50 text-blue-300 flex items-center justify-center text-[9px]">
                    <Swords className="w-2.5 h-2.5" />
                  </span>
                )}
                {log.type === 'DAMAGE' && (
                  <span className="w-4 h-4 rounded bg-rose-600/30 border border-rose-400/50 text-rose-300 flex items-center justify-center text-[9px] font-bold">
                    ⚔
                  </span>
                )}
                {log.type === 'HEAL' && (
                  <span className="w-4 h-4 rounded bg-emerald-600/30 border border-emerald-400/50 text-emerald-300 flex items-center justify-center text-[9px]">
                    <Heart className="w-2.5 h-2.5" />
                  </span>
                )}
                {(log.type === 'STATUS_BURN' || log.type === 'STATUS_TICK') && (
                  <span className="w-4 h-4 rounded bg-orange-600/30 border border-orange-400/50 text-orange-300 flex items-center justify-center text-[9px]">
                    <Flame className="w-2.5 h-2.5" />
                  </span>
                )}
                {log.type === 'STATUS_PARALYZE' && (
                  <span className="w-4 h-4 rounded bg-yellow-600/30 border border-yellow-400/50 text-yellow-300 flex items-center justify-center text-[9px]">
                    <Zap className="w-2.5 h-2.5" />
                  </span>
                )}
                {(log.type === 'STAT_BUFF' || log.type === 'STAT_DEBUFF') && (
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                    log.type === 'STAT_BUFF'
                      ? 'bg-emerald-600/30 border border-emerald-400/50 text-emerald-300'
                      : 'bg-amber-600/30 border border-amber-400/50 text-amber-300'
                  }`}>
                    {log.type === 'STAT_BUFF' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  </span>
                )}
                {log.type === 'WEATHER' && (
                  <span className="w-4 h-4 rounded bg-indigo-600/30 border border-indigo-400/50 text-indigo-300 flex items-center justify-center text-[9px]">
                    <Sun className="w-2.5 h-2.5" />
                  </span>
                )}
                {log.type !== 'MOVE' &&
                  log.type !== 'DAMAGE' &&
                  log.type !== 'HEAL' &&
                  log.type !== 'STATUS_BURN' &&
                  log.type !== 'STATUS_TICK' &&
                  log.type !== 'STATUS_PARALYZE' &&
                  log.type !== 'STAT_BUFF' &&
                  log.type !== 'STAT_DEBUFF' &&
                  log.type !== 'WEATHER' && (
                    <span className="w-4 h-4 rounded bg-slate-800 text-slate-400 flex items-center justify-center text-[9px]">
                      ✦
                    </span>
                  )}
              </div>

              {/* Log Message Content */}
              <div className="flex-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-snug">
                {/* Side Tag */}
                {log.actorSide === 'PLAYER' && (
                  <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800/40">
                    我方
                  </span>
                )}
                {log.actorSide === 'ENEMY' && (
                  <span className="text-[9px] font-bold text-rose-300 bg-rose-950/60 px-1 py-0.2 rounded border border-rose-800/40">
                    敌方
                  </span>
                )}

                {/* Move execution name pill */}
                {log.moveName && (
                  <span className="font-bold text-amber-200">
                    【{log.moveName}】
                  </span>
                )}

                {/* Damage Number Chip */}
                {log.damage !== undefined && (
                  <span className="font-mono font-black text-rose-400 bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-500/40 shadow-xs">
                    -{log.damage} HP
                  </span>
                )}

                {/* Critical hit badge */}
                {log.isCrit && (
                  <span className="text-[9px] font-black text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-400/60 animate-pulse">
                    💥 暴击!
                  </span>
                )}

                {/* Type Effectiveness Chip */}
                {log.multiplier !== undefined && log.multiplier > 1.2 && (
                  <span className="text-[9px] font-bold text-yellow-300 bg-yellow-950/60 px-1 py-0.2 rounded border border-yellow-500/40">
                    ⚡ 克制({log.multiplier}x)
                  </span>
                )}
                {log.multiplier !== undefined && log.multiplier < 0.8 && (
                  <span className="text-[9px] text-slate-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-700">
                    微弱({log.multiplier}x)
                  </span>
                )}

                {/* Heal Chip */}
                {log.heal !== undefined && (
                  <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                    +{log.heal} HP
                  </span>
                )}

                {/* Status or Stat pill */}
                {log.statusName && (
                  <span className="text-[9px] font-bold text-orange-300 bg-orange-950/80 px-1 py-0.2 rounded border border-orange-500/40">
                    [{log.statusName}]
                  </span>
                )}
                {log.statName && (
                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${
                    (log.statAmount || 0) > 0
                      ? 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40'
                      : 'text-amber-300 bg-amber-950/80 border-amber-500/40'
                  }`}>
                    {log.statName} {(log.statAmount || 0) > 0 ? `+${log.statAmount}` : log.statAmount}
                  </span>
                )}

                {/* Descriptive narrative */}
                <span className="text-slate-300 text-[10px] break-words">
                  {log.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FULL COMBAT CHRONICLE MODAL (乾坤斗法 · 详尽战纪)
// ============================================================================

interface BattleLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: CombatLogRecord[];
  currentTurn: number;
  playerName?: string;
  enemyName?: string;
}

export const BattleLogModal: React.FC<BattleLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  currentTurn,
  playerName = '我方幻灵',
  enemyName = '敌方幻灵',
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'MOVE_DMG' | 'STATUS' | 'WEATHER'>('ALL');
  const [selectedTurn, setSelectedTurn] = useState<number | 'ALL'>('ALL');

  if (!isOpen) return null;

  // Combat Statistics
  const stats = useMemo(() => {
    let playerDmg = 0;
    let enemyDmg = 0;
    let crits = 0;
    let superEffective = 0;
    let buffsApplied = 0;

    logs.forEach((l) => {
      if (l.type === 'DAMAGE' && l.damage) {
        if (l.actorSide === 'PLAYER') playerDmg += l.damage;
        if (l.actorSide === 'ENEMY') enemyDmg += l.damage;
      }
      if (l.isCrit) crits++;
      if (l.multiplier && l.multiplier > 1.2) superEffective++;
      if (l.type === 'STAT_BUFF' || l.type === 'STAT_DEBUFF' || l.type === 'STATUS_BURN' || l.type === 'STATUS_SLEEP' || l.type === 'STATUS_PARALYZE') {
        buffsApplied++;
      }
    });

    return { playerDmg, enemyDmg, crits, superEffective, buffsApplied };
  }, [logs]);

  // Turn list
  const turns = useMemo(() => {
    const set = new Set<number>();
    logs.forEach((l) => set.add(l.turn));
    return Array.from(set).sort((a, b) => a - b);
  }, [logs]);

  // Filtered entries
  const displayLogs = useMemo(() => {
    return logs.filter((l) => {
      // Turn Filter
      if (selectedTurn !== 'ALL' && l.turn !== selectedTurn) return false;

      // Category Tab Filter
      if (filterTab === 'MOVE_DMG') {
        return l.type === 'MOVE' || l.type === 'DAMAGE' || l.type === 'HEAL';
      }
      if (filterTab === 'STATUS') {
        return (
          l.type === 'STATUS_BURN' ||
          l.type === 'STATUS_SLEEP' ||
          l.type === 'STATUS_PARALYZE' ||
          l.type === 'STATUS_TICK' ||
          l.type === 'STATUS_CURED' ||
          l.type === 'STAT_BUFF' ||
          l.type === 'STAT_DEBUFF'
        );
      }
      if (filterTab === 'WEATHER') {
        return l.type === 'WEATHER';
      }
      return true;
    });
  }, [logs, selectedTurn, filterTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-gradient-to-b from-[#09152b] via-[#061022] to-[#030814] rounded-3xl border-2 border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.35)] overflow-hidden text-slate-100 flex flex-col">
        {/* 1. Header Bar */}
        <div className="px-6 py-4 border-b border-cyan-500/30 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-cyan-300/40">
              <Scroll className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-amber-200 game-title-font tracking-wide">
                  乾坤斗法 · 战斗全纪录
                </h2>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded font-mono font-bold">
                  共 {logs.length} 条记录
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>实时勘定五行生克、技能灵力、伤损数值与道法状态</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Combat Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-6 py-3 bg-[#050e1f]/90 border-b border-cyan-500/20 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">我方总伤害</div>
            <div className="text-sm font-black font-mono text-cyan-300 mt-0.5">
              {stats.playerDmg}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">承受总伤害</div>
            <div className="text-sm font-black font-mono text-rose-400 mt-0.5">
              {stats.enemyDmg}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">会心一击</div>
            <div className="text-sm font-black font-mono text-amber-300 mt-0.5">
              {stats.crits} 次
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">属性克制</div>
            <div className="text-sm font-black font-mono text-yellow-300 mt-0.5">
              {stats.superEffective} 次
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">状态/能力波动</div>
            <div className="text-sm font-black font-mono text-emerald-300 mt-0.5">
              {stats.buffsApplied} 次
            </div>
          </div>
        </div>

        {/* 3. Category Filter Tabs & Turn Filter Pill Bar */}
        <div className="px-6 py-2.5 bg-[#071329]/80 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5">
            {[
              { key: 'ALL' as const, label: '全部战录' },
              { key: 'MOVE_DMG' as const, label: '招式与伤害' },
              { key: 'STATUS' as const, label: '状态与增益' },
              { key: 'WEATHER' as const, label: '天象流转' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  sound.playClick();
                  setFilterTab(tab.key);
                }}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  filterTab === tab.key
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-300/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Turn Dropdown / Selector */}
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <span className="text-slate-400">回合筛选:</span>
            <select
              value={selectedTurn}
              onChange={(e) => {
                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                setSelectedTurn(val);
              }}
              className="bg-slate-900 border border-cyan-500/40 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
            >
              <option value="ALL">全部回合 ({turns.length})</option>
              {turns.map((t) => (
                <option key={t} value={t}>
                  第 {t} 回合
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Logs Scroll List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 scrollbar-thin">
          {displayLogs.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Scroll className="w-10 h-10 text-cyan-500/40" />
              <p className="text-sm text-slate-400">暂无对应斗法记录</p>
            </div>
          ) : (
            displayLogs.map((log) => {
              const elColor = log.element ? ELEMENT_COLORS[log.element] : null;

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col gap-1.5 shadow-sm"
                >
                  {/* Top Line: Turn Badge, Time, Actor, Event Tag */}
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-400/40 text-cyan-300 font-mono font-bold">
                        回合 {log.turn}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {log.time}
                      </span>

                      {/* Actor Pill */}
                      {log.actorSide === 'PLAYER' && (
                        <span className="font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.2 rounded border border-cyan-700/40">
                          我方 · {log.actorName || playerName}
                        </span>
                      )}
                      {log.actorSide === 'ENEMY' && (
                        <span className="font-bold text-rose-300 bg-rose-950/60 px-2 py-0.2 rounded border border-rose-700/40">
                          敌方 · {log.actorName || enemyName}
                        </span>
                      )}
                      {log.actorSide === 'ENVIRONMENT' && (
                        <span className="font-bold text-amber-300 bg-amber-950/60 px-2 py-0.2 rounded border border-amber-700/40">
                          天象灵境
                        </span>
                      )}
                    </div>

                    {/* Move Type & Element Badge */}
                    {elColor && (
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded font-bold border ${elColor.bg} ${elColor.text} ${elColor.border}`}
                      >
                        {elColor.label}系
                      </span>
                    )}
                  </div>

                  {/* Main Event Body */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-200 font-medium leading-relaxed flex flex-wrap items-center gap-1.5">
                      {log.moveName && (
                        <span className="font-black text-amber-200">
                          【{log.moveName}】
                        </span>
                      )}
                      <span>{log.message}</span>
                    </div>

                    {/* Numeric Impact Badges (Damage, Heal, Buff) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {log.damage !== undefined && (
                        <span className="font-mono font-black text-sm text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-lg border border-rose-500/50 shadow-md">
                          -{log.damage} HP
                        </span>
                      )}
                      {log.heal !== undefined && (
                        <span className="font-mono font-black text-sm text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/50 shadow-md">
                          +{log.heal} HP
                        </span>
                      )}
                      {log.isCrit && (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded-md border border-amber-400/60">
                          💥 会心一击
                        </span>
                      )}
                      {log.multiplier !== undefined && log.multiplier > 1.2 && (
                        <span className="text-[10px] font-bold text-yellow-300 bg-yellow-950 px-1.5 py-0.5 rounded-md border border-yellow-500/40">
                          ⚡ 属性拔群 (2.0x)
                        </span>
                      )}
                      {log.statusName && (
                        <span className="text-[10px] font-bold text-orange-300 bg-orange-950 px-2 py-0.5 rounded-md border border-orange-500/40">
                          {log.statusName}
                        </span>
                      )}
                      {log.statName && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          (log.statAmount || 0) > 0
                            ? 'text-emerald-300 bg-emerald-950 border-emerald-500/40'
                            : 'text-amber-300 bg-amber-950 border-amber-500/40'
                        }`}>
                          {log.statName} {(log.statAmount || 0) > 0 ? `+${log.statAmount}` : log.statAmount} 阶
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Footer Bar */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400">
          <span>
            提示: 依据五行相克法则择术斗法，善用增益道法与天象呼应，可显著提升胜率。
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            返回对决
          </button>
        </div>
      </div>
    </div>
  );
};
