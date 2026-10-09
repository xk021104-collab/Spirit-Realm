# 《幻灵秘境》服务端高并发架构设计规范 (PostgreSQL + Redis + RabbitMQ)

## 1. 架构总览

本架构专门针对《洛克王国》《奥奇传说》《赛尔号》类网页端宠物回合制收集 RPG 设计，具备：
- **微秒级场景同步与战斗撮合** (Redis 内存态)
- **严格 ACID 资产交易与图鉴持久化** (PostgreSQL 关系型数据库)
- **海量战斗事件与异步写回削峰填谷** (RabbitMQ 消息中间件)

```
[Web 前端 (React SPA)]
         │ HTTP / WebSocket
         ▼
[Node.js / Express / Go 游戏网关服务]
    ├── (高频读写 / 状态同步) ──► [Redis Cluster]
    │                                ├── 玩家 Session & 在线集合 (Set)
    │                                ├── 场景实时坐标与AOI视野广播
    │                                ├── 幻灵战力与天梯排行榜 (ZSet)
    │                                └── 回合制战斗锁与状态机缓存
    │
    ├── (异步削峰 / 广播事件) ──► [RabbitMQ Exchange]
    │                                ├── game.save.queue (异步写回 DB 削峰)
    │                                ├── game.battle.topic (战报与经验结算)
    │                                └── game.chat.fanout (全服喇叭广播)
    │
    └── (持久化落盘 / 事务保证) ──► [PostgreSQL]
                                     ├── 账号与角色资产 (player_profiles)
                                     ├── 幻灵实体与技能槽 (player_pets, pet_skills)
                                     ├── 百种图鉴全量收录 (pokedex_unlocks)
                                     └── 背包道具与任务流水 (player_inventory, player_quests)
```

---

## 2. PostgreSQL 数据库设计

SQL 初始化脚本位于：`/sql/init_schema.sql`。

### 核心表结构
1. **`users` / `player_profiles`**: 账号与角色档案，包含等级、灵石、灵晶、VIP、当前场景等。
2. **`player_pets`**: 幻灵实例表（每只捕捉的宠物均有唯一 UUID），存储等级、个体资质(Talent)、当前血量、性格与闪光变异标志。
3. **`pet_skills`**: 幻灵技能槽（1~4个技能位），记录当前 PP 灵力与最大 PP。
4. **`pokedex_unlocks`**: 幻灵图鉴解锁表，支持自动填充与捕捉计数。
5. **`player_inventory`**: 道具背包，支持灵契晶、回春丹、进化灵石等堆叠。
6. **`player_quests`**: 主线任务与新手引导追踪日志。
7. **`guilds` & `guild_members`**: 宗门/战队社交系统。
8. **`battle_logs`**: 战斗记录与收服产出日志。

---

## 3. Redis 缓存键设计 (Key Conventions)

| Key 格式 | 类型 | TTL | 作用说明 |
|---|---|---|---|
| `player:session:{token}` | String (JSON) | 7天 | 玩家鉴权会话与核心角色状态 |
| `player:{id}:party` | Hash | 24小时 | 随行6只幻灵实时战斗血量与技能PP（极速战斗读取） |
| `scene:{scene_id}:players` | Set | 永久 | 当前场景中的在线玩家 ID 集合 |
| `scene:{scene_id}:pos:{id}` | Hash (x, y) | 10分钟 | 玩家实时坐标（每秒心跳上报） |
| `rank:combat_power` | ZSet | 永久 | 全服战力总榜 (Member: player_id, Score: power) |
| `rank:pokedex_count` | ZSet | 永久 | 图鉴收集总数排行榜 |
| `battle:active:{battle_id}` | Hash | 30分钟 | 回合制战斗进行中的状态机（回合数、当前行动锁） |
| `rate_limit:chat:{player_id}` | String | 3秒 | 世界频道聊天防刷屏频率限制 |

---

## 4. RabbitMQ 拓扑结构 (Exchanges & Queues)

### 4.1 交换机 (Exchanges)
- **`game.direct` (Direct Exchange)**:
  - 路由键 `save.player` -> 绑定队列 `game.save.player.queue`（角色资产异步持久化）
  - 路由键 `save.pet` -> 绑定队列 `game.save.pet.queue`（新收服/进化幻灵落库）
- **`game.events` (Topic Exchange)**:
  - 路由键 `player.level_up.*` -> 触发全服成就检查与广播
  - 路由键 `pet.capture.*` -> 触发稀有神兽捕捉全服通告跑马灯
- **`game.chat` (Fanout Exchange)**:
  - 无路由键，扇出广播到所有 WebSocket 网关实例，实现跨服世界传音！

### 4.2 削峰填谷模式 (Write-Behind)
当玩家在前端点击收服幻灵或完成战斗时：
1. 服务端立刻在 Redis 中扣除灵契晶、生成新幻灵并更新背包（~1ms 极速响应前端）。
2. 发送消息到 RabbitMQ `game.save.pet.queue`。
3. 后台消费进程批量执行 PostgreSQL `INSERT INTO player_pets ...` 批量写入，保护数据库免受高并发冲击！

---

## 5. 待填配置模板 (.env 生产部署格式)

用户提供配置后可直接填入以下环境变量：

```env
# PostgreSQL 配置
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=huanling_mijing
PG_USER=postgres
PG_PASSWORD=your_password_here

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# RabbitMQ 配置
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VHOST=/huanling
```
