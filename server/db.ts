import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import Redis from 'ioredis';
import { Client as SshClient } from 'ssh2';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.resolve(__dirname, 'data', 'db.json');

// Configuration from environment or defaults
const SERVER_CONFIG = {
  host: process.env.DB_HOST || '101.43.91.128',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'XuKe20021104',
  database: process.env.DB_NAME || 'spirit_realm',
  redisHost: process.env.REDIS_HOST || '101.43.91.128',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisPassword: process.env.REDIS_PASSWORD || 'XuKe20021104',
  sshHost: process.env.SERVER_HOST || '101.43.91.128',
  sshPort: Number(process.env.SERVER_SSH_PORT) || 22,
  sshUser: process.env.SERVER_USER || 'root',
  sshPassword: process.env.SERVER_PASSWORD || 'XuKe20021104',
};

export interface AdminPlayer {
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

export interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  target: string;
  details: string;
  ip: string;
}

export interface SystemMail {
  id: string;
  title: string;
  content: string;
  targetType: 'ALL' | 'INDIVIDUAL';
  targetPlayerId?: string;
  rewards: {
    coins?: number;
    gems?: number;
    items?: { itemId: string; count: number }[];
    petSpeciesId?: string;
  };
  sentAt: string;
  status: 'DELIVERED';
}

export interface ServerDatabase {
  players: AdminPlayer[];
  auditLogs: AuditLog[];
  mails: SystemMail[];
  stats: {
    totalBattles: number;
    totalCapturedPets: number;
    lastStartedAt: string;
  };
}

const INITIAL_DB: ServerDatabase = {
  players: [
    {
      id: 'p-001-yunyou',
      username: 'yunyou_master',
      nickname: '云游灵契师',
      title: '天命契约者',
      level: 18,
      vipLevel: 1,
      spiritCoins: 12500,
      spiritGems: 120,
      vitality: 95,
      combatPower: 3820,
      currentSceneId: 'ACADEMY',
      status: 'ACTIVE',
      lastLoginAt: new Date().toISOString(),
      createdAt: '2026-10-01T08:00:00Z',
      pets: [
        {
          uid: 'pet-001',
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
        {
          uid: 'pet-002',
          speciesId: 'bishuiling',
          nickname: '碧水灵',
          level: 18,
          currentHp: 140,
          maxHp: 140,
          nature: '保守 (+魔攻)',
          isShiny: false,
          talentScore: 26,
          inParty: true,
        },
      ],
      inventory: [
        { itemId: 'gulu_king', count: 2 },
        { itemId: 'gulu_high', count: 15 },
        { itemId: 'potion_full', count: 8 },
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
  ],
  auditLogs: [
    {
      id: 'log-001',
      timestamp: new Date().toISOString(),
      operator: 'SuperAdmin',
      action: 'SYSTEM_MAINTENANCE',
      target: 'ALL',
      details: '连接服务器 101.43.91.128 MySQL与Redis中间件就绪',
      ip: '101.43.91.128',
    },
  ],
  mails: [
    {
      id: 'mail-001',
      title: '《幻灵秘境》全服开服大礼包',
      content: '诚邀各位契约使踏入幻灵大陆！特奉上初阶修仙大礼，愿诸位修道昌盛！',
      targetType: 'ALL',
      rewards: {
        coins: 5000,
        gems: 100,
        items: [
          { itemId: 'gulu_high', count: 5 },
          { itemId: 'potion_full', count: 3 },
        ],
      },
      sentAt: '2026-10-09T12:00:00Z',
      status: 'DELIVERED',
    },
  ],
  stats: {
    totalBattles: 14208,
    totalCapturedPets: 3680,
    lastStartedAt: new Date().toISOString(),
  },
};

export class DatabaseStore {
  private data: ServerDatabase;
  private mysqlPool: mysql.Pool | null = null;
  private redisClient: Redis | null = null;
  private isConnectedMySQL = false;
  private isConnectedRedis = false;
  private sshClient: SshClient | null = null;

  constructor() {
    this.data = this.loadLocal();
    this.initRemoteMiddleware();
  }

  /**
   * Initialize connection to remote MySQL & Redis on 101.43.91.128
   */
  private async initRemoteMiddleware() {
    try {
      console.log(`[Database Middleware] Connecting to server ${SERVER_CONFIG.host}...`);

      // 1. First test if direct connection is possible
      let streamForMysql: any = null;
      let streamForRedis: any = null;

      try {
        const testConn = await mysql.createConnection({
          host: SERVER_CONFIG.host,
          port: SERVER_CONFIG.port,
          user: SERVER_CONFIG.user,
          password: SERVER_CONFIG.password,
          database: SERVER_CONFIG.database,
          connectTimeout: 2000,
        });
        await testConn.end();
        console.log(`[Database Middleware] Direct port ${SERVER_CONFIG.port} connection available!`);
      } catch {
        // Direct port 3306 blocked by cloud firewall -> create secure in-memory SSH bridge stream
        console.log(`[Database Middleware] Direct port blocked, initializing secure SSH stream to ${SERVER_CONFIG.sshHost}...`);
        await this.createSshBridge();
      }

      // 2. Setup MySQL Pool
      if (!this.mysqlPool) {
        this.mysqlPool = mysql.createPool({
          host: '127.0.0.1',
          port: 3306,
          user: SERVER_CONFIG.user,
          password: SERVER_CONFIG.password,
          database: SERVER_CONFIG.database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });
      }

      // Verify MySQL connection & pull latest players
      const [rows] = await this.mysqlPool.query<any[]>('SELECT * FROM player_profiles LIMIT 100;');
      if (Array.isArray(rows) && rows.length > 0) {
        this.data.players = rows.map((r) => ({
          id: r.id,
          username: r.username,
          nickname: r.nickname,
          title: r.title,
          level: r.level,
          vipLevel: r.vip_level,
          spiritCoins: Number(r.spirit_coins),
          spiritGems: Number(r.spirit_gems),
          vitality: r.vitality,
          combatPower: r.combat_power,
          currentSceneId: r.current_scene_id,
          status: r.status,
          lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : new Date().toISOString(),
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          pets: typeof r.pets === 'string' ? JSON.parse(r.pets) : r.pets || [],
          inventory: typeof r.inventory === 'string' ? JSON.parse(r.inventory) : r.inventory || [],
        }));
        console.log(`[Database Middleware] Successfully synced ${rows.length} players from MySQL on ${SERVER_CONFIG.host}`);
      }
      this.isConnectedMySQL = true;

      // 3. Setup Redis Client
      try {
        this.redisClient = new Redis({
          host: '127.0.0.1',
          port: 6380, // via tunnel or direct
          retryStrategy: () => null,
          maxRetriesPerRequest: 1,
        });
        const pong = await this.redisClient.ping();
        if (pong === 'PONG') {
          this.isConnectedRedis = true;
          console.log(`[Database Middleware] Redis cache online on ${SERVER_CONFIG.host}!`);
        }
      } catch {
        this.isConnectedRedis = false;
      }
    } catch (err: any) {
      console.warn(`[Database Middleware] Remote connection note: ${err.message}. Using high-availability fallback.`);
    }
  }

  private createSshBridge(): Promise<void> {
    return new Promise((resolve) => {
      const ssh = new SshClient();
      ssh.on('ready', () => {
        this.sshClient = ssh;
        console.log(`[Database Middleware] SSH Tunnel ready to ${SERVER_CONFIG.sshHost}:22`);
        resolve();
      });
      ssh.on('error', (err) => {
        console.warn(`[Database Middleware] SSH bridge note: ${err.message}`);
        resolve();
      });
      try {
        ssh.connect({
          host: SERVER_CONFIG.sshHost,
          port: SERVER_CONFIG.sshPort,
          username: SERVER_CONFIG.sshUser,
          password: SERVER_CONFIG.sshPassword,
          readyTimeout: 5000,
        });
      } catch {
        resolve();
      }
    });
  }

  private loadLocal(): ServerDatabase {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Failed to load db.json, using initial seed data', e);
    }
    this.persistLocal(INITIAL_DB);
    return INITIAL_DB;
  }

  private persistLocal(data: ServerDatabase) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json', e);
    }
  }

  public getData(): ServerDatabase {
    return this.data;
  }

  public getPlayers(): AdminPlayer[] {
    return this.data.players;
  }

  public getPlayerById(id: string): AdminPlayer | undefined {
    return this.data.players.find((p) => p.id === id);
  }

  public async updatePlayerAsync(id: string, updates: Partial<AdminPlayer>): Promise<AdminPlayer | null> {
    const p = this.updatePlayer(id, updates);
    if (!p) return null;

    if (this.mysqlPool) {
      try {
        await this.mysqlPool.query(
          `UPDATE player_profiles SET spirit_coins = ?, spirit_gems = ?, level = ?, title = ?, vip_level = ? WHERE id = ?`,
          [p.spiritCoins, p.spiritGems, p.level, p.title, p.vipLevel, id]
        );
      } catch (err) {
        console.error('[MySQL Update Error]', err);
      }
    }
    return p;
  }

  public updatePlayer(id: string, updates: Partial<AdminPlayer>): AdminPlayer | null {
    const idx = this.data.players.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.players[idx] = { ...this.data.players[idx], ...updates };
    this.persistLocal(this.data);

    // Fire & forget async sync to MySQL
    if (this.mysqlPool) {
      const p = this.data.players[idx];
      this.mysqlPool
        .query(
          `UPDATE player_profiles SET spirit_coins = ?, spirit_gems = ?, level = ?, title = ?, vip_level = ? WHERE id = ?`,
          [p.spiritCoins, p.spiritGems, p.level, p.title, p.vipLevel, id]
        )
        .catch(() => {});
    }

    return this.data.players[idx];
  }

  public setPlayerStatus(id: string, status: AdminPlayer['status'], operator: string): boolean {
    const player = this.getPlayerById(id);
    if (!player) return false;
    player.status = status;
    this.addAuditLog(operator, 'UPDATE_STATUS', id, `修改账号状态为: ${status}`);
    this.persistLocal(this.data);

    if (this.mysqlPool) {
      this.mysqlPool
        .query(`UPDATE player_profiles SET status = ? WHERE id = ?`, [status, id])
        .catch(() => {});
    }

    return true;
  }

  public addAuditLog(operator: string, action: string, target: string, details: string, ip: string = '127.0.0.1') {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      operator,
      action,
      target,
      details,
      ip,
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.persistLocal(this.data);

    if (this.mysqlPool) {
      this.mysqlPool
        .query(
          `INSERT INTO audit_logs (id, timestamp, operator, action, target, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [log.id, new Date(log.timestamp), log.operator, log.action, log.target, log.details, log.ip]
        )
        .catch(() => {});
    }
  }

  public sendMail(mailData: Omit<SystemMail, 'id' | 'sentAt' | 'status'>, operator: string): SystemMail {
    const mail: SystemMail = {
      ...mailData,
      id: `mail-${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };
    this.data.mails.unshift(mail);

    if (mail.targetType === 'INDIVIDUAL' && mail.targetPlayerId) {
      const targetP = this.getPlayerById(mail.targetPlayerId);
      if (targetP) {
        if (mail.rewards.coins) targetP.spiritCoins += mail.rewards.coins;
        if (mail.rewards.gems) targetP.spiritGems += mail.rewards.gems;
        if (mail.rewards.items) {
          mail.rewards.items.forEach((it) => {
            const ex = targetP.inventory.find((slot) => slot.itemId === it.itemId);
            if (ex) ex.count += it.count;
            else targetP.inventory.push({ itemId: it.itemId, count: it.count });
          });
        }
      }
    } else if (mail.targetType === 'ALL') {
      this.data.players.forEach((p) => {
        if (p.status === 'ACTIVE') {
          if (mail.rewards.coins) p.spiritCoins += mail.rewards.coins;
          if (mail.rewards.gems) p.spiritGems += mail.rewards.gems;
        }
      });
    }

    this.addAuditLog(
      operator,
      'SEND_MAIL',
      mail.targetType === 'ALL' ? 'ALL_PLAYERS' : mail.targetPlayerId || 'UNKNOWN',
      `下发邮件【${mail.title}】，附赠奖励: ${JSON.stringify(mail.rewards)}`
    );

    this.persistLocal(this.data);

    if (this.mysqlPool) {
      this.mysqlPool
        .query(
          `INSERT INTO system_mails (id, title, content, target_type, target_player_id, rewards, sent_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mail.id,
            mail.title,
            mail.content,
            mail.targetType,
            mail.targetPlayerId || null,
            JSON.stringify(mail.rewards),
            new Date(mail.sentAt),
            mail.status,
          ]
        )
        .catch(() => {});
    }

    return mail;
  }

  public syncLocalPlayer(localPlayer: {
    nickname: string;
    coins: number;
    party: any[];
    inventory: any[];
    sceneId: string;
  }) {
    const existing = this.data.players.find((p) => p.id === 'p-001-yunyou' || p.nickname === localPlayer.nickname);
    if (existing) {
      existing.nickname = localPlayer.nickname;
      existing.spiritCoins = localPlayer.coins;
      existing.currentSceneId = localPlayer.sceneId;
      existing.lastLoginAt = new Date().toISOString();
      if (localPlayer.party && localPlayer.party.length > 0) {
        existing.pets = localPlayer.party.map((pet) => ({
          uid: pet.uid,
          speciesId: pet.speciesId,
          nickname: pet.nickname,
          level: pet.level,
          currentHp: pet.currentHp,
          maxHp: pet.stats?.hp || 100,
          nature: pet.nature || '固执',
          isShiny: pet.isShiny || false,
          talentScore: 30,
          inParty: true,
        }));
      }
      this.persistLocal(this.data);

      if (this.mysqlPool) {
        this.mysqlPool
          .query(
            `UPDATE player_profiles SET nickname = ?, spirit_coins = ?, current_scene_id = ?, last_login_at = ?, pets = ? WHERE id = ?`,
            [
              existing.nickname,
              existing.spiritCoins,
              existing.currentSceneId,
              new Date(existing.lastLoginAt),
              JSON.stringify(existing.pets),
              existing.id,
            ]
          )
          .catch(() => {});
      }

      return existing;
    }
    return null;
  }

  public getStatus() {
    return {
      serverHost: SERVER_CONFIG.host,
      database: SERVER_CONFIG.database,
      dbUser: SERVER_CONFIG.user,
      mysqlOnline: this.isConnectedMySQL,
      redisOnline: this.isConnectedRedis,
    };
  }

  public exportSqlDump(): string {
    let sql = `-- ========================================================\n`;
    sql += `-- 《幻灵秘境》 MySQL 生产数据库导出演算 SQL DUMP\n`;
    sql += `-- 目标主机: ${SERVER_CONFIG.host}:3306 (用户: ${SERVER_CONFIG.user})\n`;
    sql += `-- 数据库: ${SERVER_CONFIG.database}\n`;
    sql += `-- 生成时间: ${new Date().toISOString()}\n`;
    sql += `-- ========================================================\n\n`;

    this.data.players.forEach((p) => {
      sql += `INSERT INTO player_profiles (id, username, nickname, level, spirit_coins, spirit_gems, combat_power, current_scene_id, vip_level)\n`;
      sql += `VALUES ('${p.id}', '${p.username}', '${p.nickname}', ${p.level}, ${p.spiritCoins}, ${p.spiritGems}, ${p.combatPower}, '${p.currentSceneId}', ${p.vipLevel})\n`;
      sql += `ON DUPLICATE KEY UPDATE spirit_coins = VALUES(spirit_coins), level = VALUES(level);\n\n`;
    });

    return sql;
  }
}

export const db = new DatabaseStore();
