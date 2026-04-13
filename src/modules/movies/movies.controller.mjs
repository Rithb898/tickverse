import pool from '../../lib/db.mjs';
import { fetchPopularMovies, searchMovies, fetchMovieDetails } from './movies.service.mjs';

export const getMovies = async (req, res) => {
  try {
    const movies = await fetchPopularMovies();
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

export const searchMoviesController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query is required' });
    const movies = await searchMovies(q);
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const movie = await fetchMovieDetails(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json({ movie });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

export const getShowtimes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, m.title, m.poster_path, m.rating, m.tmdb_id
      FROM showtimes s JOIN movies m ON s.movie_id = m.id
      WHERE m.tmdb_id = $1 AND s.show_time > NOW() ORDER BY s.show_time ASC
    `, [req.params.movieId]);
    res.json({ showtimes: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch showtimes' });
  }
};

export const getShowtimeDetails = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, m.title, m.poster_path, m.overview, m.rating, m.tmdb_id
      FROM showtimes s JOIN movies m ON s.movie_id = m.id WHERE s.id = $1
    `, [req.params.showtimeId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Showtime not found' });
    res.json({ showtime: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch showtime details' });
  }
};