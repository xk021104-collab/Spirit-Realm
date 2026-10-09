# 《幻灵秘境》 Redis 缓存与实时状态设计规范

本规范为游戏后端提供高性能 Redis 数据结构设计，负责玩家会话、场景同屏漫步、战斗状态机、防刷分布式锁以及全服天梯排行榜。

---

## 1. 键命名规范与数据结构

| 业务场景 | Redis Key 结构 | 数据类型 | 过期时间 (TTL) | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| **玩家在线位置** | `player:location:{playerId}` | HASH | 60 秒 (心跳续期) | 记录 `{ sceneId, x, y, direction, updatedAt }` |
| **场景在线玩家集合** | `scene:players:{sceneId}` | SET | 无 (退出/超时移除) | 当前场景所有在线玩家 ID，用于广播同屏视野 |
| **玩家随行战队缓存** | `player:party:{playerId}` | STRING (JSON) | 30 分钟 (变动刷新) | 玩家 6 槽位战队高频缓存，对战时直接读取避免击穿 DB |
| **玩家背包道具缓存** | `player:inventory:{playerId}` | HASH | 1 小时 (变动刷新) | `HGET / HINCRBY` 极速扣除与增加灵契晶石及药品 |
| **图鉴已解锁集合** | `player:dex:{playerId}` | SET | 24 小时 | 已解锁物种 ID 集合，极速判定是否初次收服 |
| **进行中战斗状态** | `battle:session:{battleId}` | STRING (JSON) | 10 分钟 | 双方即时气血、PP、回合数、异常状态 |
| **图鉴收集度排行榜** | `zset:leaderboard:dex` | ZSET | 永久 | Score: 解锁物种数，Member: `playerId` |
| **战力/等级排行榜** | `zset:leaderboard:level` | ZSET | 永久 | Score: 玩家战力/等级，Member: `playerId` |
| **分布式防刷锁** | `lock:spirit:catch:{battleId}` | STRING | 5 秒 (操作完释放) | 防止连续网络包重复扣球或重复结算 |

---

## 2. 常用操作命令示例

### A. 玩家移动与心跳上报
```redis
# 玩家移动到云梦古原 (x: 45, y: 60)
HSET player:location:usr_1001 sceneId "PRAIRIE" x "45" y "60" direction "right" updatedAt "1773000000"
EXPIRE player:location:usr_1001 60

# 添加至场景在线集合
SADD scene:players:PRAIRIE usr_1001
```

### B. 背包扣除灵契晶石 (原子递减)
```redis
# 使用 1 枚初阶灵契晶
HINCRBY player:inventory:usr_1001 gulu_normal -1
```

### C. 全服图鉴收集榜维护
```redis
# 玩家捕获新幻灵，解锁数达到 8
ZADD zset:leaderboard:dex 8 usr_1001

# 查询全服前 10 名灵契师
ZREVRANGE zset:leaderboard:dex 0 9 WITHSCORES
```
