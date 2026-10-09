import React, { useState } from 'react';
import { Database, Server, Cpu, Copy, Check, Terminal, ExternalLink, X, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface DatabaseArchitectureModalProps {
  onClose: () => void;
}

export const DatabaseArchitectureModal: React.FC<DatabaseArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'SQL' | 'REDIS' | 'RABBITMQ' | 'CONFIG'>('SQL');
  const [copied, setCopied] = useState<boolean>(false);

  // Config generator state
  const [pgHost, setPgHost] = useState<string>('localhost');
  const [pgPort, setPgPort] = useState<string>('5432');
  const [pgDb, setPgDb] = useState<string>('huanling_mijing');
  const [pgUser, setPgUser] = useState<string>('postgres');
  const [pgPass, setPgPass] = useState<string>('secret_password');

  const [redisHost, setRedisHost] = useState<string>('localhost');
  const [redisPort, setRedisPort] = useState<string>('6379');
  const [redisPass, setRedisPass] = useState<string>('');

  const [rabbitHost, setRabbitHost] = useState<string>('localhost');
  const [rabbitPort, setRabbitPort] = useState<string>('5672');
  const [rabbitUser, setRabbitUser] = useState<string>('guest');
  const [rabbitPass, setRabbitPass] = useState<string>('guest');

  const generatedEnv = `# 《幻灵秘境》服务端高并发中间件与数据库环境配置
# 1. PostgreSQL 核心持久化
PG_HOST=${pgHost}
PG_PORT=${pgPort}
PG_DATABASE=${pgDb}
PG_USER=${pgUser}
PG_PASSWORD=${pgPass}

# 2. Redis 高速缓存 & 战力排行榜 & 状态同步
REDIS_HOST=${redisHost}
REDIS_PORT=${redisPort}
REDIS_PASSWORD=${redisPass}
REDIS_DB=0

# 3. RabbitMQ 异步写回削峰 & 全服传音广播
RABBITMQ_HOST=${rabbitHost}
RABBITMQ_PORT=${rabbitPort}
RABBITMQ_USER=${rabbitUser}
RABBITMQ_PASSWORD=${rabbitPass}
RABBITMQ_VHOST=/huanling
`;

  const sqlSample = `-- 《幻灵秘境》PostgreSQL 数据库结构 (已保存至 /sql/init_schema.sql)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_profiles (
    player_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(64) NOT NULL,
    title VARCHAR(64) DEFAULT '初阶灵契使',
    level INT NOT NULL DEFAULT 1,
    current_exp BIGINT NOT NULL DEFAULT 0,
    spirit_coins BIGINT NOT NULL DEFAULT 1000, -- 灵石
    spirit_gems INT NOT NULL DEFAULT 50,       -- 灵晶
    vip_level INT NOT NULL DEFAULT 0,
    combat_power INT NOT NULL DEFAULT 100,
    current_scene_id VARCHAR(32) DEFAULT 'ACADEMY'
);

CREATE TABLE player_pets (
    pet_uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    species_id VARCHAR(64) NOT NULL,
    nickname VARCHAR(64) NOT NULL,
    level INT NOT NULL DEFAULT 5,
    in_party BOOLEAN NOT NULL DEFAULT TRUE,    -- 随行背包(6只)
    current_hp INT NOT NULL DEFAULT 50,
    max_hp INT NOT NULL DEFAULT 50,
    talent_score INT DEFAULT 20,              -- 个体天赋资质 (1-31)
    is_shiny BOOLEAN DEFAULT FALSE
);

CREATE TABLE pokedex_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    species_id VARCHAR(64) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, species_id)
);

CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES player_profiles(player_id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL,
    count INT NOT NULL DEFAULT 1,
    UNIQUE(player_id, item_id)
);`;

  const copyToClipboard = (text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-14 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b-2 border-amber-500/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-300 game-title-font">
                系统架构与数据库中心 (PostgreSQL + Redis + RabbitMQ)
              </h2>
              <p className="text-[11px] text-slate-400">
                专为经典页游高并发设计的后端资产与消息拓扑
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('SQL');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'SQL'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL 脚本 (/sql/init_schema.sql)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('REDIS');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REDIS'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Redis 缓存设计</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('RABBITMQ');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RABBITMQ'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>RabbitMQ 消息拓扑</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('CONFIG');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CONFIG'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>环境配置生成 (.env)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/90 text-sm">
          {activeTab === 'SQL' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-amber-300 text-sm block">完整 PostgreSQL DDL 初始化脚本</span>
                  <span className="text-xs text-slate-400">已完整生成在项目根目录 <code className="text-amber-400 font-mono">/sql/init_schema.sql</code></span>
                </div>
                <button
                  onClick={() => copyToClipboard(sqlSample)}
                  className="flash-gold-btn px-4 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                  <span>{copied ? '已复制到剪贴板！' : '复制核心 SQL 片段'}</span>
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
                <pre>{sqlSample}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-xs font-black text-amber-300 block mb-1">🛡️ 资产 ACID 事务保证</span>
                  <span className="text-[11px] text-slate-400">幻灵收服、放生、进化、背包道具扣减均在事务中执行，绝不丢宠回档。</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-xs font-black text-amber-300 block mb-1">📖 图鉴自动解锁联动</span>
                  <span className="text-[11px] text-slate-400">捕捉新幻灵触发唯一约束录入，实时解锁图鉴数值与属性技能。</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-xs font-black text-amber-300 block mb-1">⚡ 性能索引完备</span>
                  <span className="text-[11px] text-slate-400">覆盖战力天梯榜、玩家随行6宠查询、背包道具归类复合索引。</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'REDIS' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-rose-400 text-sm mb-2">Redis 极速缓存键规划规范</h3>
                <p className="text-xs text-slate-300 mb-3">
                  在回合制对战与场景移动中，读写直接走 Redis，降低数据库 99% 的直接 IO 负载：
                </p>

                <div className="space-y-2 font-mono text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-rose-400 font-bold">player:&#123;id&#125;:party</span>
                      <span className="text-slate-400 text-[11px] ml-2">(Hash) - 随行6宠实时生命值与招式PP</span>
                    </div>
                    <span className="text-emerald-400 text-[10px]">TTL: 24h</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-rose-400 font-bold">scene:&#123;scene_id&#125;:players</span>
                      <span className="text-slate-400 text-[11px] ml-2">(Set) - 当前地图场景中在线的玩家列表</span>
                    </div>
                    <span className="text-emerald-400 text-[10px]">实时广播</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-rose-400 font-bold">rank:combat_power</span>
                      <span className="text-slate-400 text-[11px] ml-2">(ZSet) - 全服灵契师综合战力排行天梯</span>
                    </div>
                    <span className="text-emerald-400 text-[10px]">实时有序</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-rose-400 font-bold">battle:active:&#123;battle_id&#125;</span>
                      <span className="text-slate-400 text-[11px] ml-2">(Hash) - 战斗回合状态机与行动锁，防止并发作弊</span>
                    </div>
                    <span className="text-emerald-400 text-[10px]">TTL: 30m</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RABBITMQ' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-amber-400 text-sm mb-2">RabbitMQ 削峰填谷与全服广播拓扑</h3>
                <p className="text-xs text-slate-300 mb-3">
                  支持经典页游万人同服时的即时传音、战报异步持久化、稀有神兽捕捉全服横幅：
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span className="font-bold text-xs text-blue-300">game.save.queue (Direct)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Write-Behind 异步落库队列。玩家对战获得经验、使用药水时先写 Redis，然后推送队列批量入库 PostgreSQL，保护 DB 不被瞬时打垮。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="font-bold text-xs text-amber-300">game.events.topic (Topic)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      事件交换机。捕获稀有幻灵、主线章节完成、战力突破时触发全服跑马灯与成就下发。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="font-bold text-xs text-emerald-300">game.chat.fanout (Fanout)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      全服喇叭扇出广播。跨网关服务器多节点无缝分发聊天消息，毫秒级送达所有客户端。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CONFIG' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 block mb-3">
                  输入你的 PostgreSQL、Redis 与 RabbitMQ 连接参数，一键生成服务端 .env 配置：
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">PG 主机</label>
                    <input
                      type="text"
                      value={pgHost}
                      onChange={(e) => setPgHost(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">PG 端口</label>
                    <input
                      type="text"
                      value={pgPort}
                      onChange={(e) => setPgPort(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">PG 库名</label>
                    <input
                      type="text"
                      value={pgDb}
                      onChange={(e) => setPgDb(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">PG 用户名</label>
                    <input
                      type="text"
                      value={pgUser}
                      onChange={(e) => setPgUser(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">生成预览：</span>
                  <button
                    onClick={() => copyToClipboard(generatedEnv)}
                    className="flash-gold-btn px-3 py-1 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? '已复制！' : '复制 .env 配置'}</span>
                  </button>
                </div>

                <pre className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
                  {generatedEnv}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400">
          <span>完整技术文档已保存至：<code className="text-amber-400 font-mono">/docs/BACKEND_ARCHITECTURE.md</code></span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          >
            关闭窗口
          </button>
        </div>
      </div>
    </div>
  );
};
