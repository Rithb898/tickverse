import pool from '../../lib/db.mjs';
import { fetchPopularMovies, searchMovies, fetchMovieDetails, fetchShowtimes } from './movies.service.mjs';

export const getMovies = async (req, res) => {
  try {
    const movies = await fetchPopularMovies();
    
    for (const movie of movies) {
      await pool.query(`
        INSERT INTO movies (tmdb_id, title, poster_path, overview, release_date, rating)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (tmdb_id) DO UPDATE SET title = $2, poster_path = $3, rating = $6
      `, [movie.tmdb_id, movie.title, movie.poster_path, movie.overview, movie.release_date, movie.rating]);
    }
    
    res.json({ movies });
  } catch (error) {
    console.error('Get movies error:', error);
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
    const movieId = req.params.movieId;
    
    const movieResult = await pool.query('SELECT id FROM movies WHERE id = $1 OR tmdb_id = $1', [movieId]);
    if (movieResult.rowCount === 0) {
      const serviceShowtimes = await fetchShowtimes(movieId);
      return res.json({ showtimes: serviceShowtimes });
    }
    
    const dbId = movieResult.rows[0].id;
    
    const showtimesResult = await pool.query(`
      SELECT s.*, m.title, m.poster_path, m.rating, m.tmdb_id
      FROM showtimes s 
      JOIN movies m ON s.movie_id = m.id
      WHERE m.id = $1 AND s.show_time > NOW() 
      ORDER BY s.show_time ASC
    `, [dbId]);
    
    if (showtimesResult.rows.length === 0) {
      const defaultShowtimes = await fetchShowtimes(dbId);
      return res.json({ showtimes: defaultShowtimes });
    }
    
    res.json({ showtimes: showtimesResult.rows });
  } catch (error) {
    console.error('Get showtimes error:', error);
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