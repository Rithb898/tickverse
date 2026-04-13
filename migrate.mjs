import pool from './src/lib/db.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'migrations', '001_init.sql'), 'utf-8');

pool.query(sql)
  .then(() => { console.log('Migration complete'); process.exit(0); })
  .catch((e) => { console.error('Migration failed:', e.message); process.exit(1); });