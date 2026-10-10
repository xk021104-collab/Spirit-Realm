import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Coins,
  Shield,
  Sparkles,
  Server,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  RotateCcw,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
  Droplets,
  Leaf,
  Zap,
  Award,
  Layers,
  ArrowLeft,
  Mail,
  Sliders,
  Eye,
  Trash2,
  Clock,
  Radio,
  FileText,
  Gift,
} from 'lucide-react';
import { PET_SPECIES } from '../../data/species';
import { ITEMS_DATA } from '../../data/items';
import { SCENES_DATA } from '../../data/scenes';

interface AdminDashboardProps {
  onReturnToGame: () => void;
  localPlayerState?: {
    playerName: string;
    playerCoins: number;
    party: any[];
    inventory: any[];
    currentSceneId: string;
  };
}

interface PlayerRecord {
  id: string;
  username: string;
  nickname: string;
  title: string;
  level: number;
  vipLevel: number;
  spiritCoins: number;
  spiritGems: number;
  vitality: number;
  combatPower: number;
  currentSceneId: string;
  status: 'ACTIVE' | 'BANNED' | 'MUTED';
  lastLoginAt: string;
  createdAt: string;
  pets: {
    uid: string;
    speciesId: string;
    nickname: string;
    level: number;
    currentHp: number;
    maxHp: number;
    nature: string;
    isShiny: boolean;
    talentScore: number;
    inParty: boolean;
  }[];
  inventory: {
    itemId: string;
    count: number;
  }[];
}

interface AuditLogRecord {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  target: string;
  details: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToGame,
  localPlayerState,
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'PLAYERS' | 'MAIL_GM' | 'SPECIES' | 'INFRA' | 'LOGS'>('METRICS');
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Players state
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRecord | null>(null);

  // Edit player asset modal state
  const [editingCoins, setEditingCoins] = useState<number>(0);
  const [editingGems, setEditingGems] = useState<number>(0);
  const [editingLevel, setEditingLevel] = useState<number>(1);

  // GM Mail Dispatcher state
  const [mailTitle, setMailTitle] = useState<string>('全服修仙福利大礼包');
  const [mailContent, setMailContent] = useState<string>('恭祝各位灵契使修道日进千里，特奉上宗门修炼物资！');
  const [mailTarget, setMailTarget] = useState<'ALL' | 'INDIVIDUAL'>('ALL');
  const [mailTargetId, setMailTargetId] = useState<string>('');
  const [mailCoinsReward, setMailCoinsReward] = useState<number>(10000);
  const [mailGemsReward, setMailGemsReward] = useState<number>(100);
  const [mailSelectedItemId, setMailSelectedItemId] = useState<string>('gulu_high');
  const [mailItemCount, setMailItemCount] = useState<number>(5);
  const [mailPetSpeciesId, setMailPetSpeciesId] = useState<string>('');

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  // SQL Dump modal
  const [sqlDumpText, setSqlDumpText] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // 1. Initial Load & Check Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        setIsServerOnline(true);
        // Load players from server
        const pRes = await fetch('/api/admin/players');
        const pData = await pRes.json();
        setPlayers(pData.players || []);

        // Load logs from server
        const lRes = await fetch('/api/admin/audit-logs');
        const lData = await lRes.json();
        setAuditLogs(lData.logs || []);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not running, use fallback data
    }

    // Fallback Mock Data
    setIsServerOnline(false);
    const mockPlayers: PlayerRecord[] = [
      {
        id: 'p-001-yunyou',
        username: 'yunyou_master',
        nickname: localPlayerState?.playerName || '云游灵契师',
        title: '天命契约者',
        level: localPlayerState?.party?.[0]?.level || 20,
        vipLevel: 1,
        spiritCoins: localPlayerState?.playerCoins || 25000,
        spiritGems: 180,
        vitality: 100,
        combatPower: 4200,
        currentSceneId: localPlayerState?.currentSceneId || 'ACADEMY',
        status: 'ACTIVE',
        lastLoginAt: new Date().toISOString(),
        createdAt: '2026-10-01T08:00:00Z',
        pets: localPlayerState?.party?.map((p, idx) => ({
          uid: p.uid,
          speciesId: p.speciesId,
          nickname: p.nickname,
          level: p.level,
          currentHp: p.currentHp,
          maxHp: p.stats?.hp || 150,
          nature: p.nature || '固执',
          isShiny: !!p.isShiny,
          talentScore: 31,
          inParty: true,
        })) || [
          {
            uid: 'pet-01',
            speciesId: 'chiyanque',
            nickname: '赤焰雀★极品',
            level: 22,
            currentHp: 180,
            maxHp: 180,
            nature: '固执 (+物攻)',
            isShiny: true,
            talentScore: 31,
            inParty: true,
          },
        ],
        inventory: localPlayerState?.inventory || [
          { itemId: 'gulu_king', count: 3 },
          { itemId: 'potion_full', count: 10 },
        ],
      },
      {
        id: 'p-002-lingjian',
        username: 'lingjian_zi',
        nickname: '青莲剑仙·李白',
        title: '太白剑意传人',
        level: 45,
        vipLevel: 3,
        spiritCoins: 188000,
        spiritGems: 980,
        vitality: 100,
        combatPower: 12450,
        currentSceneId: 'BAMBOO',
        status: 'ACTIVE',
        lastLoginAt: '2026-10-09T18:30:00Z',
        createdAt: '2026-09-15T12:00:00Z',
        pets: [
          {
            uid: 'pet-101',
            speciesId: 'cangqiongshenglong',
            nickname: '苍穹神龙',
            level: 50,
            currentHp: 480,
            maxHp: 480,
            nature: '胆小 (+速度)',
            isShiny: true,
            talentScore: 31,
            inParty: true,
          },
          {
            uid: 'pet-102',
            speciesId: 'fentianhuang',
            nickname: '焚天神凰',
            level: 48,
            currentHp: 420,
            maxHp: 420,
            nature: '保守 (+魔攻)',
            isShiny: false,
            talentScore: 29,
            inParty: true,
          },
        ],
        inventory: [
          { itemId: 'gulu_king', count: 10 },
          { itemId: 'potion_full', count: 30 },
        ],
      },
      {
        id: 'p-003-tianyan',
        username: 'tianyan_jun',
        nickname: '炽炎炎皇',
        title: '熔岩领主',
        level: 32,
        vipLevel: 2,
        spiritCoins: 56000,
        spiritGems: 340,
        vitality: 80,
        combatPower: 7600,
        currentSceneId: 'VOLCANO',
        status: 'ACTIVE',
        lastLoginAt: '2026-10-10T02:15:00Z',
        createdAt: '2026-09-22T10:00:00Z',
        pets: [
          {
            uid: 'pet-201',
            speciesId: 'zhuoyuying',
            nickname: '灼羽神鹰',
            level: 35,
            currentHp: 260,
            maxHp: 260,
            nature: '勇敢 (+物攻)',
            isShiny: false,
            talentScore: 28,
            inParty: true,
          },
        ],
        inventory: [{ itemId: 'gulu_mid', count: 20 }],
      },
      {
        id: 'p-004-cheater',
        username: 'hack_spirit_99',
        nickname: '脚本测试违规号',
        title: '封号处理中',
        level: 99,
        vipLevel: 0,
        spiritCoins: 99999999,
        spiritGems: 99999,
        vitality: 0,
        combatPower: 99999,
        currentSceneId: 'ACADEMY',
        status: 'BANNED',
        lastLoginAt: '2026-10-08T11:00:00Z',
        createdAt: '2026-10-08T10:55:00Z',
        pets: [],
        inventory: [],
      },
    ];
    setPlayers(mockPlayers);

    setAuditLogs([
      {
        id: 'log-001',
        timestamp: '2026-10-10T09:30:00Z',
        operator: 'SuperAdmin',
        action: 'BAN_USER',
        target: 'p-004-cheater',
        details: '判定涉嫌自动化脚本刷取金币，执行封停 30 天',
      },
      {
        id: 'log-002',
        timestamp: '2026-10-10T10:00:00Z',
        operator: 'SuperAdmin',
        action: 'SYSTEM_MAINTENANCE',
        target: 'ALL',
        details: '完成了 Redis Cluster 缓存预热与 RabbitMQ 削峰队列拓扑自检',
      },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Player Asset
  const handleSavePlayerAsset = async () => {
    if (!selectedPlayer) return;
    if (isServerOnline) {
      try {
        const res = await fetch(`/api/admin/players/${selectedPlayer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spiritCoins: editingCoins,
            spiritGems: editingGems,
            level: editingLevel,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setSelectedPlayer(updated.player);
          setPlayers((prev) =>
            prev.map((p) => (p.id === selectedPlayer.id ? updated.player : p))
          );
          showNotify('玩家资产已成功更新到后端数据库！');
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Local state fallback
    const updated: PlayerRecord = {
      ...selectedPlayer,
      spiritCoins: editingCoins,
      spiritGems: editingGems,
      level: editingLevel,
    };
    setSelectedPlayer(updated);
    setPlayers((prev) => prev.map((p) => (p.id === selectedPlayer.id ? updated : p)));
    addAuditLog('Admin', 'UPDATE_PLAYER', selectedPlayer.id, `修改资产: 灵石=${editingCoins}, 等级=${editingLevel}`);
    showNotify('已在本地后台更新玩家资产！');
  };

  // Toggle Ban / Unban
  const handleToggleBan = async (player: PlayerRecord) => {
    const newStatus: PlayerRecord['status'] = player.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
    if (isServerOnline) {
      try {
        const res = await fetch(`/api/admin/players/${player.id}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          setPlayers((prev) =>
            prev.map((p) => (p.id === player.id ? { ...p, status: newStatus } : p))
          );
          if (selectedPlayer?.id === player.id) {
            setSelectedPlayer({ ...selectedPlayer, status: newStatus });
          }
          showNotify(`账号状态已变更为: ${newStatus === 'BANNED' ? '封禁' : '正常'}`);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback
    setPlayers((prev) =>
      prev.map((p) => (p.id === player.id ? { ...p, status: newStatus } : p))
    );
    if (selectedPlayer?.id === player.id) {
      setSelectedPlayer({ ...selectedPlayer, status: newStatus });
    }
    addAuditLog('Admin', 'TOGGLE_BAN', player.id, `账号状态设定为: ${newStatus}`);
    showNotify(`账号状态已变更为: ${newStatus === 'BANNED' ? '封禁' : '正常'}`);
  };

  // Send Mail / Rewards
  const handleSendMail = async () => {
    if (!mailTitle || !mailContent) {
      showNotify('请输入邮件标题与公告内容！');
      return;
    }

    const payload = {
      title: mailTitle,
      content: mailContent,
      targetType: mailTarget,
      targetPlayerId: mailTarget === 'INDIVIDUAL' ? mailTargetId : undefined,
      rewards: {
        coins: mailCoinsReward > 0 ? mailCoinsReward : undefined,
        gems: mailGemsReward > 0 ? mailGemsReward : undefined,
        items: mailSelectedItemId ? [{ itemId: mailSelectedItemId, count: mailItemCount }] : undefined,
        petSpeciesId: mailPetSpeciesId || undefined,
      },
    };

    if (isServerOnline) {
      try {
        const res = await fetch('/api/admin/broadcast/mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showNotify('邮件与运营奖励已通过 RabbitMQ 广播成功下发！');
          loadData();
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback local update
    if (mailTarget === 'ALL') {
      setPlayers((prev) =>
        prev.map((p) =>
          p.status === 'ACTIVE'
            ? {
                ...p,
                spiritCoins: p.spiritCoins + mailCoinsReward,
                spiritGems: p.spiritGems + mailGemsReward,
              }
            : p
        )
      );
    } else if (mailTargetId) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === mailTargetId
            ? {
                ...p,
                spiritCoins: p.spiritCoins + mailCoinsReward,
                spiritGems: p.spiritGems + mailGemsReward,
              }
            : p
        )
      );
    }

    addAuditLog('Admin', 'DISPATCH_MAIL', mailTarget, `下发邮件【${mailTitle}】，包含灵石+${mailCoinsReward}`);
    showNotify('邮件及道具已下发至玩家邮箱！');
  };

  const addAuditLog = (operator: string, action: string, target: string, details: string) => {
    const log: AuditLogRecord = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      operator,
      action,
      target,
      details,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Generate SQL Dump
  const handleExportSql = () => {
    let sql = `-- ========================================================\n`;
    sql += `-- 《幻灵秘境》 生产数据库导出演算 SQL DUMP\n`;
    sql += `-- 生成时间: ${new Date().toISOString()}\n`;
    sql += `-- ========================================================\n\n`;

    players.forEach((p) => {
      sql += `INSERT INTO player_profiles (player_id, nickname, level, spirit_coins, spirit_gems, combat_power, current_scene_id, vip_level)\n`;
      sql += `VALUES ('${p.id}', '${p.nickname}', ${p.level}, ${p.spiritCoins}, ${p.spiritGems}, ${p.combatPower}, '${p.currentSceneId}', ${p.vipLevel})\n`;
      sql += `ON CONFLICT (player_id) DO UPDATE SET spirit_coins = EXCLUDED.spirit_coins, level = EXCLUDED.level;\n\n`;
    });

    setSqlDumpText(sql);
  };

  // Filtered Players
  const filteredPlayers = players.filter((p) => {
    const matchQuery =
      p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onReturnToGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-medium cursor-pointer transition-colors border border-slate-700/80 shadow"
            title="返回游戏客户端"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回修仙游戏</span>
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
                  《幻灵秘境》运营中台管理系统
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/60">
                  v1.2.0 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                PostgreSQL + Redis + RabbitMQ 服务端架构配套管控平台
              </p>
            </div>
          </div>
        </div>

        {/* Server Status Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
              isServerOnline
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-blue-950/80 border-blue-500/50 text-blue-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isServerOnline ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
              }`}
            />
            <span>
              {isServerOnline ? 'Express API 服务端已连通 (Port 3001)' : '沙箱独立演示模式'}
            </span>
          </div>

          <button
            onClick={loadData}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="刷新数据"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/90 border border-purple-400 text-purple-200 text-xs shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-purple-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Main Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'METRICS', label: '运营概览看板', icon: Activity },
          { id: 'PLAYERS', label: '灵契师档案管理', icon: Users },
          { id: 'MAIL_GM', label: '全服邮件与道具下发', icon: Mail },
          { id: 'SPECIES', label: '幻灵种族与平衡字典', icon: Sparkles },
          { id: 'INFRA', label: '中间件与数据库监控', icon: Database },
          { id: 'LOGS', label: '管理员审计日志', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* TAB 1: METRICS */}
        {activeTab === 'METRICS' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow">
                <div>
                  <span className="text-xs text-slate-400">全服注册修仙者</span>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                    {players.length.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400">↑ 100% 活跃健康</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow">
                <div>
                  <span className="text-xs text-slate-400">全服灵石流通池</span>
                  <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                    {players.reduce((sum, p) => sum + p.spiritCoins, 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">经济通胀率稳定</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow">
                <div>
                  <span className="text-xs text-slate-400">契约幻灵总数</span>
                  <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
                    {players.reduce((sum, p) => sum + p.pets.length, 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-purple-400">含 16 种图鉴神兽</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/50 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow">
                <div>
                  <span className="text-xs text-slate-400">高并发架构吞吐</span>
                  <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                    1,420 <span className="text-xs font-normal text-slate-400">QPS</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Redis 命中率 98.4%</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Middle Row: Architecture Status & Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Architecture Cluster Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    三大中间件实时运行状态
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">PostgreSQL 核心库</div>
                      <div className="text-[11px] text-slate-400">ACID 资产与宠物持久化落盘</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700">
                      连接池 12/50
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">Redis Cluster 集群</div>
                      <div className="text-[11px] text-slate-400">微秒级会话、场景坐标与战斗锁</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700">
                      缓存命中 98.4%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">RabbitMQ 消息中间件</div>
                      <div className="text-[11px] text-slate-400">写回削峰填谷与全服广播</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700">
                      队列积压 0
                    </span>
                  </div>
                </div>
              </div>

              {/* Scene Distribution */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    幻灵大陆场景分布与活跃热度
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">AOI 视野心跳同步</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.values(SCENES_DATA).map((sc) => {
                    const countInScene = players.filter((p) => p.currentSceneId === sc.id).length;
                    return (
                      <div
                        key={sc.id}
                        className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{sc.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {countInScene} 人
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{sc.region}</div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                            style={{
                              width: `${Math.min(100, (countInScene / Math.max(1, players.length)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PLAYERS */}
        {activeTab === 'PLAYERS' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="按玩家昵称、账号或 UUID 检索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">状态筛选:</span>
                {['ALL', 'ACTIVE', 'BANNED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      statusFilter === st
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? '全部' : st === 'ACTIVE' ? '正常在籍' : '封禁黑名单'}
                  </button>
                ))}
              </div>
            </div>

            {/* Players Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">玩家修仙档案</th>
                    <th className="py-3 px-4">等级 / VIP</th>
                    <th className="py-3 px-4">灵石资产</th>
                    <th className="py-3 px-4">综合战力</th>
                    <th className="py-3 px-4">所在洞天</th>
                    <th className="py-3 px-4">账号状态</th>
                    <th className="py-3 px-4 text-right">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{player.nickname}</div>
                        <div className="text-[11px] text-slate-500 font-mono">@{player.username}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-amber-300 font-bold">Lv.{player.level}</span>
                        {player.vipLevel > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">
                            VIP{player.vipLevel}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400">
                        {player.spiritCoins.toLocaleString()} 灵石
                      </td>
                      <td className="py-3 px-4 font-mono text-purple-300 font-bold">
                        {player.combatPower.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {SCENES_DATA[player.currentSceneId]?.name || player.currentSceneId}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            player.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {player.status === 'ACTIVE' ? '正常' : '封禁中'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPlayer(player);
                            setEditingCoins(player.spiritCoins);
                            setEditingGems(player.spiritGems);
                            setEditingLevel(player.level);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs cursor-pointer transition-colors"
                        >
                          详情 / 调账
                        </button>
                        <button
                          onClick={() => handleToggleBan(player)}
                          className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                            player.status === 'BANNED'
                              ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-700'
                              : 'bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-700'
                          }`}
                        >
                          {player.status === 'BANNED' ? '解封' : '封禁'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Player Detail Modal / Drawer */}
            {selectedPlayer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        <span>{selectedPlayer.nickname}</span>
                        <span className="text-xs text-slate-400 font-normal">({selectedPlayer.id})</span>
                      </h3>
                      <p className="text-xs text-slate-400">{selectedPlayer.title} · VIP{selectedPlayer.vipLevel}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPlayer(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Asset Adjustment Form */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" /> GM 后台资产调配
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">灵石 (金币)</label>
                        <input
                          type="number"
                          value={editingCoins}
                          onChange={(e) => setEditingCoins(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-amber-300"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">灵晶 (钻石)</label>
                        <input
                          type="number"
                          value={editingGems}
                          onChange={(e) => setEditingGems(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-cyan-300"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">修仙等级</label>
                        <input
                          type="number"
                          value={editingLevel}
                          onChange={(e) => setEditingLevel(parseInt(e.target.value, 10) || 1)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-purple-300"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSavePlayerAsset}
                        className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow"
                      >
                        保存资产变更
                      </button>
                    </div>
                  </div>

                  {/* Pets in Party */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 随行出战幻灵 ({selectedPlayer.pets.length}/6)
                    </h4>
                    {selectedPlayer.pets.length === 0 ? (
                      <div className="text-xs text-slate-500 p-3 bg-slate-950 rounded-xl">背包暂无随行幻灵</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        {selectedPlayer.pets.map((pet) => (
                          <div
                            key={pet.uid}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-200">
                                {pet.nickname}
                                {pet.isShiny && <span className="text-amber-400 ml-1">✨</span>}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Lv.{pet.level} · {pet.nature}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">
                              资质: {pet.talentScore}/31
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inventory Items */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> 背包内道具
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayer.inventory.map((inv) => {
                        const itemInfo = ITEMS_DATA[inv.itemId];
                        return (
                          <span
                            key={inv.itemId}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                          >
                            <span>{itemInfo?.name || inv.itemId}</span>
                            <span className="font-mono text-cyan-400">x{inv.count}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MAIL & REWARDS GM DISPATCH */}
        {activeTab === 'MAIL_GM' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    运营邮件与全服道具/幻灵下发中台
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    支持通过 RabbitMQ 事件总线向全服广播或指定修士发放修仙资源
                  </p>
                </div>
              </div>

              {/* Target Type */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">发放目标范围</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="targetType"
                      checked={mailTarget === 'ALL'}
                      onChange={() => setMailTarget('ALL')}
                      className="accent-purple-500"
                    />
                    <span>全服所有活跃玩家广播 (All Active Players)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="targetType"
                      checked={mailTarget === 'INDIVIDUAL'}
                      onChange={() => setMailTarget('INDIVIDUAL')}
                      className="accent-purple-500"
                    />
                    <span>指定特定玩家 ID (Individual Player)</span>
                  </label>
                </div>

                {mailTarget === 'INDIVIDUAL' && (
                  <div className="pt-2">
                    <select
                      value={mailTargetId}
                      onChange={(e) => setMailTargetId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-purple-200"
                    >
                      <option value="">-- 请选择目标玩家 --</option>
                      {players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nickname} (ID: {p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Title & Content */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">邮件公告标题</label>
                  <input
                    type="text"
                    value={mailTitle}
                    onChange={(e) => setMailTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">邮件正文说明</label>
                  <textarea
                    rows={3}
                    value={mailContent}
                    onChange={(e) => setMailContent(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Rewards Configuration */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> 附赠运营福利配置
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">赠送灵石 (金币)</label>
                    <input
                      type="number"
                      value={mailCoinsReward}
                      onChange={(e) => setMailCoinsReward(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-amber-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">赠送灵晶 (钻石)</label>
                    <input
                      type="number"
                      value={mailGemsReward}
                      onChange={(e) => setMailGemsReward(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">附赠指定道具</label>
                    <select
                      value={mailSelectedItemId}
                      onChange={(e) => setMailSelectedItemId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
                    >
                      <option value="">-- 无道具 --</option>
                      {Object.values(ITEMS_DATA).map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">道具数量</label>
                    <input
                      type="number"
                      value={mailItemCount}
                      onChange={(e) => setMailItemCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">直接特赠神兽幻灵</label>
                    <select
                      value={mailPetSpeciesId}
                      onChange={(e) => setMailPetSpeciesId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-purple-200"
                    >
                      <option value="">-- 无特赠幻灵 --</option>
                      {Object.values(PET_SPECIES).map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name} ({spec.type} - {spec.rarity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSendMail}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                立即执行全网下发广播
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SPECIES */}
        {activeTab === 'SPECIES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  全大陆 16 种天地幻灵种族字典 (Species Config Table)
                </h3>
                <p className="text-xs text-slate-400">
                  对应 PostgreSQL `pet_species_config` 基础数值配置表
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(PET_SPECIES).map((spec) => (
                <div
                  key={spec.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold">
                        #{spec.pokedexNum}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{spec.name}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        spec.rarity === 'LEGENDARY'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : spec.rarity === 'EPIC'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {spec.rarity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{spec.description}</p>

                  {/* Base Stats */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono bg-slate-950 p-2 rounded-xl">
                    <div>生命: <span className="text-cyan-400">{spec.baseStats.hp}</span></div>
                    <div>物攻: <span className="text-red-400">{spec.baseStats.atk}</span></div>
                    <div>物防: <span className="text-blue-400">{spec.baseStats.def}</span></div>
                    <div>特攻: <span className="text-purple-400">{spec.baseStats.spAtk}</span></div>
                    <div>特防: <span className="text-emerald-400">{spec.baseStats.spDef}</span></div>
                    <div>速度: <span className="text-amber-400">{spec.baseStats.speed}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INFRASTRUCTURE & DB */}
        {activeTab === 'INFRA' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  服务端三驾马车 (PG + Redis + RabbitMQ) 架构拓扑
                </h3>
                <p className="text-xs text-slate-400">
                  支持在线一键导出符合 `sql/init_schema.sql` 标准的生产级数据备份
                </p>
              </div>
              <button
                onClick={handleExportSql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" /> 导出数据库 SQL Dump
              </button>
            </div>

            {/* Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <Database className="w-4 h-4" /> PostgreSQL 关系持久化
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>• `player_profiles`: 核心角色资产表</div>
                  <div>• `player_pets`: 幻灵实例与资质</div>
                  <div>• `player_inventory`: 道具背包堆叠</div>
                  <div>• `battle_logs`: 战斗流水审计</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Zap className="w-4 h-4" /> Redis 内存态高频缓存
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>• `player:session:*`: 会话与鉴权</div>
                  <div>• `scene:[id]:pos:*`: 实时 AOI 坐标</div>
                  <div>• `rank:combat_power`: 战力排行榜 ZSet</div>
                  <div>• `battle:active:*`: 回合制战斗锁</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Layers className="w-4 h-4" /> RabbitMQ 异步削峰消息
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>• `game.save.queue`: 写回持久化削峰</div>
                  <div>• `game.battle.topic`: 战报异步落库</div>
                  <div>• `game.chat.fanout`: 全服传音广播</div>
                </div>
              </div>
            </div>

            {/* SQL Dump Modal */}
            {sqlDumpText && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">导出的 SQL 数据备份脚本:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(sqlDumpText);
                        showNotify('SQL 脚本已成功复制到剪贴板！');
                      }}
                      className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer"
                    >
                      复制 SQL
                    </button>
                    <button
                      onClick={() => setSqlDumpText(null)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      关闭
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60">
                  {sqlDumpText}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'LOGS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">GM 管理员操作安全审计流水</h3>
                <p className="text-xs text-slate-400">记录每一笔后台调账、封号及全服广播动作</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">流水时间</th>
                    <th className="py-3 px-4">操作员</th>
                    <th className="py-3 px-4">动作类型</th>
                    <th className="py-3 px-4">受影响对象</th>
                    <th className="py-3 px-4">操作明细</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-purple-300 font-bold">{log.operator}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cyan-400">{log.target}</td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
