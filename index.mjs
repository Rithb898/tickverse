import 'dotenv/config';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import pool from './src/lib/db.mjs';
import authRoutes from './src/modules/auth/auth.routes.mjs';
import moviesRoutes from './src/modules/movies/movies.routes.mjs';
import seatsRoutes from './src/modules/seats/seats.routes.mjs';
import bookingsRoutes from './src/modules/bookings/bookings.routes.mjs';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

async function runMigrations() {
  try {
    const migration = readFileSync(__dirname + '/migrations/002_seat_types.sql', 'utf8');
    await pool.query(migration);
    console.log('Migrations applied successfully');
  } catch (error) {
    console.error('Migration error:', error.message);
  }
}

await runMigrations();

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/bookings', bookingsRoutes);

app.get('/seats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seats ORDER BY id');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
});

app.put('/:id/:name', async (req, res) => {
  const { id, name } = req.params;
  const conn = await pool.connect();
  try {
    await conn.query('BEGIN');
    const result = await conn.query('SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE', [id]);
    if (result.rowCount === 0) {
      await conn.query('ROLLBACK');
      return res.json({ error: 'Seat already booked' });
    }
    await conn.query('UPDATE seats SET isbooked = 1, name = $2 WHERE id = $1', [id, name]);
    await conn.query('COMMIT');
    res.json({ success: true });
  } catch {
    await conn.query('ROLLBACK');
    res.status(500).json({ error: 'Booking failed' });
  } finally {
    conn.release();
  }
});

app.listen(port, () => console.log('Server running on port: ' + port));