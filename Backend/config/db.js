// Conexión MySQL original (se mantiene comentada para referencia)
// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });
// connection.connect(err => {
//   if (err) throw err;
//   console.log(colors.bgCyan('Conectado a la base de datos MySQL'));
// });

const sql = require('mssql');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config();

const useInstance = !!process.env.DB_INSTANCE;
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

if (useInstance) {
  sqlConfig.options.instanceName = process.env.DB_INSTANCE;
} else {
  sqlConfig.port = Number(process.env.DB_PORT) || 1433;
}

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then((pool) => {
    console.log(colors.bgCyan('Conectado a SQL Server'));
    return pool;
  })
  .catch((err) => {
    console.error('Error al conectar a SQL Server:', err);
    throw err;
  });

const inferType = (value) => {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? sql.Int : sql.Float;
  }
  if (typeof value === 'boolean') return sql.Bit;
  if (value instanceof Date) return sql.DateTime2;
  return sql.NVarChar(sql.MAX);
};

const formatQuery = (query, params = []) => {
  if (!params || !params.length) {
    return { text: query, names: [] };
  }
  const parts = query.split('?');
  let text = '';
  const names = [];
  parts.forEach((part, idx) => {
    text += part;
    if (idx < params.length) {
      const name = `p${idx}`;
      text += `@${name}`;
      names.push(name);
    }
  });
  return { text, names };
};

const connection = {
  currentTransaction: null,

  async query(queryText, paramsOrCb, maybeCb) {
    const params = Array.isArray(paramsOrCb) ? paramsOrCb : [];
    const callback = typeof paramsOrCb === 'function' ? paramsOrCb : maybeCb;

    try {
      const pool = await poolPromise;
      const request = connection.currentTransaction
        ? new sql.Request(connection.currentTransaction)
        : pool.request();

      const rawValues = params || [];
      const values = rawValues.map((v) => (v === undefined ? null : v));
      const { text, names } = formatQuery(queryText, values);

      names.forEach((name, idx) => {
        request.input(name, inferType(values[idx]), values[idx]);
      });

      const isInsert = /^\s*insert/i.test(queryText.trim());
      const finalQuery = isInsert
        ? `${text}; SELECT SCOPE_IDENTITY() AS insertId;`
        : text;

      const result = await request.query(finalQuery);

      if (isInsert) {
        const recordsets = result.recordsets || [];
        const lastSet = recordsets[recordsets.length - 1] || [];
        const insertId =
          lastSet[0]?.insertId !== undefined
            ? Number(lastSet[0].insertId)
            : undefined;
        const response = {
          insertId,
          rowsAffected: result.rowsAffected?.[0] ?? 0,
        };
        if (callback) return callback(null, response);
        return response;
      }

      const rows =
        Array.isArray(result.recordset) && result.recordset.length >= 0
          ? result.recordset
          : [];
      const affected =
        result.rowsAffected?.reduce((sum, n) => sum + (n || 0), 0) || 0;
      rows.affectedRows = affected;

      if (callback) return callback(null, rows);
      return rows;
    } catch (err) {
      if (err?.number === 2627 || err?.number === 2601) {
        err.code = 'ER_DUP_ENTRY'; // homologa error de clave duplicada
      }
      if (callback) return callback(err, []);
      throw err;
    }
  },

  async beginTransaction(cb) {
    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      connection.currentTransaction = transaction;
      if (cb) cb(null);
      return transaction;
    } catch (err) {
      if (cb) return cb(err);
      throw err;
    }
  },

  async commit(cb) {
    try {
      const tx = connection.currentTransaction;
      if (!tx) throw new Error('No hay transacción activa');
      await tx.commit();
      connection.currentTransaction = null;
      if (cb) cb(null);
    } catch (err) {
      if (cb) return cb(err);
      throw err;
    }
  },

  async rollback(cb) {
    try {
      const tx = connection.currentTransaction;
      if (tx) {
        await tx.rollback();
        connection.currentTransaction = null;
      }
      if (cb) cb(null);
    } catch (err) {
      if (cb) return cb(err);
      throw err;
    }
  },
};

module.exports = connection;
module.exports.sql = sql;


