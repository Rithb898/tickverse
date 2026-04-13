-- Migration: Initial schema for Book My Ticket

-- Seats table (create if not exists - original table from the project)
CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0
);

-- Insert seats if table is empty
INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20)
WHERE NOT EXISTS (SELECT 1 FROM seats LIMIT 1);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table (stores TMDB movie data references)
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(500),
    overview TEXT,
    release_date DATE,
    rating DECIMAL(3,1),
    is_active BOOLEAN DEFAULT true
);

-- Showtimes table
CREATE TABLE IF NOT EXISTS showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    screen_number INTEGER NOT NULL,
    show_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (replaces seat name association)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seat_id INTEGER REFERENCES seats(id) ON DELETE CASCADE,
    showtime_id INTEGER REFERENCES showtimes(id) ON DELETE CASCADE,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(seat_id, showtime_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_showtime_id ON bookings(showtime_id);
CREATE INDEX IF NOT EXISTS idx_showtimes_movie_id ON showtimes(movie_id);

-- Insert sample movies (using TMDB IDs)
INSERT INTO movies (tmdb_id, title, poster_path, overview, release_date, rating) VALUES
(693134, 'Dhurandhar', '/1E5baA8FvxHe7QddB3HvfHEJ7Gz.jpg', 'A high-octane action thriller', '2025-01-15', 8.5),
(572802, 'Aquaman and the Lost Kingdom', '/7lTnXOy0gN8pJTPs2Rnge06glw.jpg', 'Black Manta seeks revenge on Aquaman', '2023-12-22', 6.9),
(866398, 'The Beekeeper', '/A7EByudX9eOaZzlr3PAr2zOSUHe.jpg', 'One mans brutal campaign for vengeance', '2024-01-12', 7.4)
ON CONFLICT (tmdb_id) DO NOTHING;

-- Insert sample showtimes
INSERT INTO showtimes (movie_id, screen_number, show_time) VALUES
(1, 1, '2026-04-14 10:00:00'),
(1, 1, '2026-04-14 14:00:00'),
(1, 1, '2026-04-14 18:00:00'),
(1, 2, '2026-04-14 20:00:00'),
(2, 3, '2026-04-14 11:00:00'),
(2, 3, '2026-04-14 15:00:00'),
(3, 4, '2026-04-14 12:00:00'),
(3, 4, '2026-04-14 16:00:00')
ON CONFLICT DO NOTHING;