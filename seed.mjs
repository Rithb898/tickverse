import pool from './src/lib/db.mjs';

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clean existing data (except seats - handled separately)
    await client.query('TRUNCATE showtimes, movies, bookings RESTART IDENTITY CASCADE');

    // Insert movies
    const movies = [
      { tmdb_id: 693134, title: 'Dhurandhar', poster_path: 'https://image.tmdb.org/t/p/w500/1E5baA8FvxHe7QddB3HvfHEJ7Gz.jpg', rating: 8.5 },
      { tmdb_id: 572802, title: 'Aquaman and the Lost Kingdom', poster_path: 'https://image.tmdb.org/t/p/w500/7lTnXOy0gN8pJTPs2Rnge06glw.jpg', rating: 6.9 },
      { tmdb_id: 866398, title: 'The Beekeeper', poster_path: 'https://image.tmdb.org/t/p/w500/A7EByudX9eOaZzlr3PAr2zOSUHe.jpg', rating: 7.4 },
      { tmdb_id: 848538, title: 'Argylle', poster_path: 'https://image.tmdb.org/t/p/w500/95VlSEfLMqeX36UVgYH5J2bK1rA.jpg', rating: 6.3 },
      { tmdb_id: 940551, title: 'Migration', poster_path: 'https://image.tmdb.org/t/p/w500/ldfCF9RhR40mppkzmftxapaHeTo.jpg', rating: 7.3 },
      { tmdb_id: 787699, title: 'Wonka', poster_path: 'https://image.tmdb.org/t/p/w500/qhb1qOilipbBQ6SCuW7AyP3nI3b.jpg', rating: 7.2 },
      { tmdb_id: 912649, title: 'Venom: The Last Dance', poster_path: 'https://image.tmdb.org/t/p/w500/aosm8NMQ3FdmoTw3MC4MPujK4M1.jpg', rating: 6.8 },
      { tmdb_id: 573435, title: 'Bad Boys: Ride or Die', poster_path: 'https://image.tmdb.org/t/p/w500/qv0qDNAkfGhQshZfVd11hWC9vJW.jpg', rating: 7.1 }
    ];

    for (const movie of movies) {
      await client.query(
        'INSERT INTO movies (tmdb_id, title, poster_path, rating) VALUES ($1, $2, $3, $4)',
        [movie.tmdb_id, movie.title, movie.poster_path, movie.rating]
      );
    }

    // Insert showtimes with relative dates
    const now = new Date();
    const showtimeTemplates = [
      { movie_id: 1, screens: [{ screen: 1, hours: [10, 14, 18] }, { screen: 2, hours: [20] }] },
      { movie_id: 2, screens: [{ screen: 3, hours: [11, 15, 19] }] },
      { movie_id: 3, screens: [{ screen: 4, hours: [12, 16, 20] }] },
      { movie_id: 4, screens: [{ screen: 1, hours: [13, 17, 21] }] },
      { movie_id: 5, screens: [{ screen: 2, hours: [10, 14] }] },
      { movie_id: 6, screens: [{ screen: 3, hours: [11, 15] }] },
      { movie_id: 7, screens: [{ screen: 4, hours: [12, 16] }] },
      { movie_id: 8, screens: [{ screen: 1, hours: [13, 17] }] }
    ];

    for (const template of showtimeTemplates) {
      for (const screenConfig of template.screens) {
        for (const hour of screenConfig.hours) {
          const showTime = new Date(now);
          showTime.setDate(showTime.getDate() + 1);
          showTime.setHours(hour, 0, 0, 0);
          
          await client.query(
            'INSERT INTO showtimes (movie_id, screen_number, show_time) VALUES ($1, $2, $3)',
            [template.movie_id, screenConfig.screen, showTime]
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log('Seed complete');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();