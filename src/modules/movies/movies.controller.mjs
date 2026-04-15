import pool from "../../lib/db.mjs";

export const getMovies = async (req, res) => {
  try {
    const dbMovies = await pool.query("SELECT * FROM movies ORDER BY id DESC");
    res.json({ movies: dbMovies.rows });
  } catch (error) {
    console.error("Get movies error:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

export const searchMoviesController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Search query is required" });
    const result = await pool.query(
      "SELECT * FROM movies WHERE title ILIKE $1",
      [`%${q}%`],
    );
    res.json({ movies: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to search movies" });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM movies WHERE id = $1 OR tmdb_id = $1",
      [req.params.id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Movie not found" });
    res.json({ movie: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};

export const getShowtimes = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const movieResult = await pool.query(
      "SELECT id FROM movies WHERE id = $1 OR tmdb_id = $1",
      [movieId],
    );
    if (movieResult.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const dbId = movieResult.rows[0].id;

    const showtimesResult = await pool.query(
      `
      SELECT s.*, m.title, m.poster_path, m.rating, m.tmdb_id
      FROM showtimes s 
      JOIN movies m ON s.movie_id = m.id
      WHERE m.id = $1 AND s.show_time > NOW() 
      ORDER BY s.show_time ASC
    `,
      [dbId],
    );

    if (showtimesResult.rows.length === 0) {
      const now = new Date();
      for (let h of [10, 14, 18, 21]) {
        const showTime = new Date(now);
        showTime.setDate(now.getDate() + 1);
        showTime.setHours(h, 0, 0, 0);
        await pool.query(
          "INSERT INTO showtimes (movie_id, screen_number, show_time) VALUES ($1, $2, $3)",
          [dbId, Math.floor(Math.random() * 4) + 1, showTime],
        );
      }

      const newResult = await pool.query(
        `
        SELECT s.*, m.title, m.poster_path, m.rating, m.tmdb_id
        FROM showtimes s 
        JOIN movies m ON s.movie_id = m.id
        WHERE m.id = $1 AND s.show_time > NOW() 
        ORDER BY s.show_time ASC
      `,
        [dbId],
      );

      return res.json({ showtimes: newResult.rows });
    }

    res.json({ showtimes: showtimesResult.rows });
  } catch (error) {
    console.error("Get showtimes error:", error);
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
};

export const getShowtimeDetails = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT s.*, m.title, m.poster_path, m.overview, m.rating, m.tmdb_id
      FROM showtimes s JOIN movies m ON s.movie_id = m.id WHERE s.id = $1
    `,
      [req.params.showtimeId],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Showtime not found" });
    res.json({ showtime: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch showtime details" });
  }
};
