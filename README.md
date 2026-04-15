# Tickverse - Book My Ticket Platform

A movie ticket booking platform with user authentication and protected booking flow. Built as a follow-up assignment for Chai Aur SQL class.

## Features

- User registration and login with JWT authentication
- Protected booking endpoints (only authenticated users can book seats)
- Duplicate seat booking prevention
- Movie listings with showtimes
- Seat selection with different categories (Normal, Deluxe, Recliner)
- View and cancel user bookings

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+
- PostgreSQL
- pnpm (recommended) or npm

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Rithb898/tickverse.git
   cd tickverse
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   PORT=8080
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_NAME=tickverse
   ```

5. Create PostgreSQL database:
   ```sql
   CREATE DATABASE tickverse;
   ```

6. Run migrations:
   ```bash
   node migrate.mjs
   ```

7. (Optional) Seed mock movie data:
   ```bash
   node seed.mjs
   ```

8. Start the server:
   ```bash
   pnpm dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Movies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/movies` | Get all movies | No |
| GET | `/api/movies/search?q=query` | Search movies | No |
| GET | `/api/movies/:id` | Get movie details | No |
| GET | `/api/movies/:movieId/showtimes` | Get movie showtimes | No |
| GET | `/api/movies/showtime/:showtimeId` | Get showtime details | No |

### Seats

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/seats/:showtimeId` | Get seats for showtime | No |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/my` | Get user's bookings | Yes |
| DELETE | `/api/bookings/:id` | Cancel booking | Yes |

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Movies

```bash
curl http://localhost:8080/api/movies
```

### Create Booking (Protected)

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"seatIds":[1,2],"showtimeId":1}'
```

### Get My Bookings (Protected)

```bash
curl http://localhost:8080/api/bookings/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Cancel Booking (Protected)

```bash
curl -X DELETE http://localhost:8080/api/bookings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

### Users
- `id` - Primary key
- `email` - Unique email
- `password` - Hashed password
- `name` - User name
- `created_at` - Timestamp

### Movies
- `id` - Primary key
- `tmdb_id` - TMDB ID
- `title` - Movie title
- `poster_path` - Poster URL
- `overview` - Description
- `release_date` - Release date
- `rating` - Rating
- `is_active` - Active status

### Showtimes
- `id` - Primary key
- `movie_id` - Foreign key to movies
- `screen_number` - Screen number
- `show_time` - Show datetime

### Seats
- `id` - Primary key
- `row_label` - Row letter (A-H)
- `seat_number` - Seat number (1-10)
- `seat_type_id` - Foreign key to seat_types

### Seat Types
- `id` - Primary key
- `name` - Type name (normal, deluxe, recliner)
- `display_name` - Display name
- `price` - Price in INR
- `color` - UI color

### Bookings
- `id` - Primary key
- `user_id` - Foreign key to users
- `seat_id` - Foreign key to seats
- `showtime_id` - Foreign key to showtimes
- `booking_time` - Timestamp
- Unique constraint on `(seat_id, showtime_id)` prevents duplicate bookings

## Project Structure

```
tickverse/
├── index.mjs              # Main application entry
├── migrate.mjs            # Database migrations
├── seed.mjs               # Seed mock data
├── migrations/
│   ├── 001_init.sql       # Initial schema
│   └── 002_seat_types.sql # Seat types migration
├── src/
│   ├── lib/
│   │   ├── db.mjs         # Database connection
│   │   ├── auth.mjs       # Auth middleware
│   │   └── jwt.mjs        # JWT utilities
│   └── modules/
│       ├── auth/          # Auth routes & controller
│       ├── movies/        # Movies routes & controller
│       ├── seats/         # Seats routes & controller
│       └── bookings/      # Bookings routes & controller
├── .env.example           # Environment variables example
└── package.json
```

## License

ISC
