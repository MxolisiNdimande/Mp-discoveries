import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || null;

let pool = null;

if (connectionString || process.env.PGHOST) {
  pool = new Pool({
    connectionString: connectionString || undefined,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
} else {
  console.warn('No Postgres configuration found. Database features will use in-memory fallbacks.');
}

export async function query(text, params) {
  if (!pool) throw new Error('Database not configured');
  return pool.query(text, params);
}

export async function testConnection() {
  if (!pool) return false;
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Postgres connection test failed:', err.message || err);
    return false;
  }
}

export default { pool, query, testConnection };
