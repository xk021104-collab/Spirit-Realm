# 《幻灵秘境》 RabbitMQ 消息队列拓扑与异步事件驱动规范

本规范定义了游戏后端在战斗结算、任务进度判定、图鉴自动解锁、全服奇遇广播等核心异步业务场景下的 RabbitMQ 架构。

---

## 1. 交换机与队列拓扑结构 (Topology)

```
[业务事件触发] 
       │
       ▼
┌─────────────────────────────────┐
│ Exchange: huanling.events.topic │ (Topic 交换机)
└─────────────────────────────────┘
       ├────────────────────────┬────────────────────────┬────────────────────────┐
       │ routing:               │ routing:               │ routing:               │
       │ event.spirit.caught    │ event.battle.*         │ event.quest.*          │
       ▼                        ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ Queue:               │ │ Queue:               │ │ Queue:               │ │ Queue:               │
│ q.pokedex.processor  │ │ q.battle.history     │ │ q.quest.tracker      │ │ q.achievement.reward │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘
       │                        │                        │                        │
       ▼                        ▼                        ▼                        ▼
写入 player_pokedex       写入 battle_history       更新任务计数器           分发邮件/成就礼赠
更新 Redis 图鉴榜        记录对战明细              解锁下一主线章节         
```

---

## 2. 核心队列职责与消息格式 (Message Payload)

### 1. 幻灵收服事件 (`q.pokedex.processor`)
- **路由键 (Routing Key)**: `event.spirit.caught`
- **处理职责**: 
  1. 往 PostgreSQL `player_pokedex` 插入首收记录。
  2. 往 Redis `zset:leaderboard:dex` 增加积分。
  3. 检查是否达成图鉴收集里程碑 (3 / 6 / 10 只)，触发奖励队列。
- **消息 JSON**:
```json
{
  "eventId": "evt_catch_98231",
  "eventType": "SPIRIT_CAUGHT",
  "playerId": "a3b4c5d6-e7f8-4321-9abc-0123456789ab",
  "speciesId": "chiyanque",
  "spiritInstanceId": "pet_177300123",
  "ballItemId": "gulu_normal",
  "sceneId": "PRAIRIE",
  "timestamp": 1773000000
}
```

### 2. 主线任务进度监听器 (`q.quest.tracker`)
- **路由键 (Routing Key)**: `event.*` (匹配 `event.spirit.caught`, `event.battle.win`, `event.item.bought`, `event.spirit.evolved`, `event.hospital.healed`)
- **处理职责**: 
  1. 检索该玩家当前 `ACTIVE` 状态的主线任务。
  2. 匹配 `targetType`。若目标达成，自动流转为 `COMPLETED`。
  3. 推送通知至客户端 WebSocket 网关。
- **消息 JSON**:
```json
{
  "eventId": "evt_evolve_71822",
  "eventType": "SPIRIT_EVOLVED",
  "playerId": "a3b4c5d6-e7f8-4321-9abc-0123456789ab",
  "fromSpeciesId": "chiyanque",
  "toSpeciesId": "zhuoyuying",
  "targetLevel": 16,
  "timestamp": 1773000500
}
```

### 3. 全服传世幻灵广播 (`huanling.broadcast.fanout`)
- **交换机类型**: `fanout`
- **处理职责**: 当玩家收服天穹传世（LEGENDARY）幻灵（如【焚天凰】、【幻海灵尊】、【苍林神尊】）或斩获【天穹天命徽章】时，无延迟推送到全服在线玩家的聊天与传音跑马灯。
- **消息 JSON**:
```json
{
  "broadcastType": "WORLD_ANNOUNCEMENT",
  "title": "天命神兽现世",
  "content": "天道轰鸣！灵契师【云游灵契师】于苍炎熔渊历经千险，成功缔结至尊神禽【焚天凰】！",
  "timestamp": 1773000999
}
```
