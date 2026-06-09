import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usePostgres = !!(process.env.DATABASE_URL || process.env.PGHOST);

console.log('--- Database Connection Diagnostic ---');
console.log('usePostgres:', usePostgres);
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  try {
    // Parse connection string safely without exposing passwords
    const parsed = new URL(process.env.DATABASE_URL);
    console.log('DATABASE_URL Hostname:', parsed.hostname);
    console.log('DATABASE_URL Port:', parsed.port || 'default');
    console.log('DATABASE_URL Database:', parsed.pathname);
    console.log('DATABASE_URL Username:', parsed.username);
  } catch (err) {
    console.log('DATABASE_URL is not a valid URL. Length:', process.env.DATABASE_URL.length);
    console.log('DATABASE_URL Starts with:', process.env.DATABASE_URL.substring(0, 15) + '...');
  }
}
console.log('PGHOST:', process.env.PGHOST || 'not set');
console.log('PGDATABASE:', process.env.PGDATABASE || 'not set');
console.log('PGUSER:', process.env.PGUSER || 'not set');
console.log('PGPORT:', process.env.PGPORT || 'not set');
console.log('--------------------------------------');

let pgPool = null;
let sqliteDb = null;

if (usePostgres) {
  console.log('Connecting to PostgreSQL database...');
  const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || 'portfolio_cms',
        port: parseInt(process.env.PGPORT || '5432')
      };
  pgPool = new pg.Pool(config);
  
  pgPool.connect((err, client, release) => {
    if (err) {
      console.error('Failed to connect to PostgreSQL database:', err.message);
    } else {
      console.log('Successfully connected to PostgreSQL database.');
      release();
    }
  });
} else {
  console.log('PostgreSQL environment not configured. Initializing local SQLite fallback...');
  const dbDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'database.sqlite');
  
  // Dynamically load sqlite3 so the native compiled binary is bypassed in production
  const sqlite3Module = await import('sqlite3');
  const sqlite3 = sqlite3Module.default;
  
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Failed to open SQLite database:', err.message);
    } else {
      console.log('Connected to local SQLite database at:', dbPath);
    }
  });
}

// Translate SQLite "?" placeholders to PostgreSQL "$1, $2" format
const translateSql = (sql) => {
  if (usePostgres) {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  }
  return sql;
};

export const query = async (sql, params = []) => {
  const finalSql = translateSql(sql);
  if (usePostgres) {
    const res = await pgPool.query(finalSql, params);
    return res.rows;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.all(finalSql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

export const queryOne = async (sql, params = []) => {
  const finalSql = translateSql(sql);
  if (usePostgres) {
    const res = await pgPool.query(finalSql, params);
    return res.rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.get(finalSql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }
};

export const run = async (sql, params = []) => {
  const translated = translateSql(sql);
  if (usePostgres) {
    let pgSql = translated;
    if (translated.trim().toUpperCase().startsWith('INSERT')) {
      if (!translated.toUpperCase().includes('RETURNING')) {
        pgSql = `${translated} RETURNING id`;
      }
    }
    const res = await pgPool.query(pgSql, params);
    const lastRow = res.rows[0];
    return { id: lastRow ? lastRow.id : null, changes: res.rowCount };
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run(translated, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

export const exec = async (sql) => {
  let schemaSql = sql;
  if (usePostgres) {
    schemaSql = schemaSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY');
    schemaSql = schemaSql.replace(/DATETIME/gi, 'TIMESTAMP');
  }
  
  if (usePostgres) {
    await pgPool.query(schemaSql);
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.exec(schemaSql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

export const isPostgres = () => usePostgres;
