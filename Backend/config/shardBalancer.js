const sql = require('mssql');

const shardDatabases = (process.env.DB_SHARD_DATABASES || '')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);

if (!shardDatabases.length) {
  console.warn(
    '[ShardBalancer] No se encontraron DB_SHARD_DATABASES en el .env (no se usarán shards)'
  );
}

const useInstance = !!process.env.DB_INSTANCE;
const baseConfig = {
  server: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '15', 10),
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    idleTimeoutMillis: 30000,
  },
  requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT_MS || '15000', 10),
  connectionTimeout: parseInt(
    process.env.DB_CONNECTION_TIMEOUT_MS || '5000',
    10
  ),
};

if (useInstance) {
  baseConfig.options.instanceName = process.env.DB_INSTANCE;
} else {
  baseConfig.port = parseInt(process.env.DB_PORT || '1433', 10);
}

class ShardBalancer {
  constructor(mode = 'round_robin') {
    this.mode = mode; // round_robin | hash | parallel
    this.shards = shardDatabases.map((dbName) => ({
      dbName,
      poolPromise: null,
    }));
    this._rrIndex = 0;
  }

  get hasShards() {
    return this.shards.length > 0;
  }

  async _getPool(index) {
    const shard = this.shards[index];
    if (!shard) {
      throw new Error(`Shard index ${index} no válido`);
    }
    if (!shard.poolPromise) {
      const cfg = { ...baseConfig, database: shard.dbName };
      shard.poolPromise = new sql.ConnectionPool(cfg)
        .connect()
        .then((pool) => {
          console.log(`[ShardBalancer] Conectado al shard: ${shard.dbName}`);
          return pool;
        })
        .catch((err) => {
          console.error(`[ShardBalancer] Error conectando al shard ${shard.dbName}`, err);
          shard.poolPromise = null;
          throw err;
        });
    }
    return shard.poolPromise;
  }

  _selectShardRoundRobin() {
    const idx = this._rrIndex;
    this._rrIndex = (this._rrIndex + 1) % this.shards.length;
    return idx;
  }

  _selectShardHash(key) {
    if (key === null || key === undefined) {
      return this._selectShardRoundRobin();
    }
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash % this.shards.length;
  }

  async queryAny(sqlText, params = {}, hashKey = null) {
    if (!this.hasShards) {
      throw new Error('No hay shards configurados');
    }

    let idx;
    if (this.mode === 'hash' && hashKey !== null && hashKey !== undefined) {
      idx = this._selectShardHash(hashKey);
    } else {
      idx = this._selectShardRoundRobin();
    }

    const pool = await this._getPool(idx);
    const request = pool.request();
    Object.entries(params).forEach(([name, value]) => request.input(name, value));
    const result = await request.query(sqlText);
    return { shard: this.shards[idx].dbName, rows: result.recordset };
  }

  async queryAll(sqlText, params = {}) {
    if (!this.hasShards) {
      throw new Error('No hay shards configurados');
    }
    const promises = this.shards.map(async (shard, idx) => {
      const pool = await this._getPool(idx);
      const request = pool.request();
      Object.entries(params).forEach(([name, value]) => request.input(name, value));
      const result = await request.query(sqlText);
      return { shard: shard.dbName, rows: result.recordset };
    });
    return Promise.all(promises);
  }

  async getProjectsSummary() {
    const sqlText = `
      SELECT
        COUNT(*) AS total_projects,
        SUM(CASE WHEN status = N'En progreso' THEN 1 ELSE 0 END) AS en_progreso,
        SUM(CASE WHEN status = N'Completado' THEN 1 ELSE 0 END) AS completado,
        SUM(CASE WHEN status = N'En pausa' THEN 1 ELSE 0 END) AS en_pausa
      FROM projects;
    `;
    const shardResults = await this.queryAll(sqlText);
    const global = shardResults.reduce(
      (acc, r) => {
        const row = r.rows[0] || {};
        acc.total_projects += row.total_projects || 0;
        acc.en_progreso += row.en_progreso || 0;
        acc.completado += row.completado || 0;
        acc.en_pausa += row.en_pausa || 0;
        return acc;
      },
      { total_projects: 0, en_progreso: 0, completado: 0, en_pausa: 0 }
    );
    return { global, shards: shardResults };
  }

  async searchProjectsByName(name) {
    const sqlText = `
      SELECT
        id,
        name,
        description,
        start_date,
        end_date,
        status
      FROM projects
      WHERE name LIKE @name
    `;
    const results = await this.queryAll(sqlText, { name: `%${name}%` });
    const merged = [];
    for (const shardResult of results) {
      const shardName = shardResult.shard;
      for (const row of shardResult.rows) {
        merged.push({ ...row, shard: shardName });
      }
    }
    return merged;
  }
}

const mode = process.env.DB_SHARD_MODE || 'round_robin';
module.exports = new ShardBalancer(mode);
