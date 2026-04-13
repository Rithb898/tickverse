const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const mockMovies = [
  { tmdb_id: 693134, title: 'Dhurandhar', poster_path: `${TMDB_IMAGE_BASE}/1E5baA8FvxHe7QddB3HvfHEJ7Gz.jpg`, overview: 'A high-octane action thriller about revenge and redemption.', release_date: '2025-01-15', rating: 8.5 },
  { tmdb_id: 572802, title: 'Aquaman and the Lost Kingdom', poster_path: `${TMDB_IMAGE_BASE}/7lTnXOy0gN8pJTPs2Rnge06glw.jpg`, overview: 'Black Manta seeks revenge on Aquaman for his fathers death.', release_date: '2023-12-22', rating: 6.9 },
  { tmdb_id: 866398, title: 'The Beekeeper', poster_path: `${TMDB_IMAGE_BASE}/A7EByudX9eOaZzlr3PAr2zOSUHe.jpg`, overview: 'One mans brutal campaign for vengeance takes on national stakes.', release_date: '2024-01-12', rating: 7.4 },
  { tmdb_id: 848538, title: 'Argylle', poster_path: `${TMDB_IMAGE_BASE}/95VlSEfLMqeX36UVgYH5J2bK1rA.jpg`, overview: 'A reclusive author discovers her spy novels are coming true.', release_date: '2024-02-02', rating: 6.3 },
  { tmdb_id: 940551, title: 'Migration', poster_path: `${TMDB_IMAGE_BASE}/ldfCF9RhR40mppkzmftxapaHeTo.jpg`, overview: 'A family of ducks embarks on the adventure of a lifetime.', release_date: '2023-12-22', rating: 7.3 },
  { tmdb_id: 787699, title: 'Wonka', poster_path: `${TMDB_IMAGE_BASE}/qhb1qOilipbBq6SCuW7AyP3nI3b.jpg`, overview: 'The story of how the worlds greatest inventor became Willy Wonka.', release_date: '2023-12-15', rating: 7.2 },
  { tmdb_id: 912649, title: 'Venom: The Last Dance', poster_path: `${TMDB_IMAGE_BASE}/aosm8NMQ3FdmoTw3MC4MPujK4M1.jpg`, overview: 'Eddie and Venom are on the run from both worlds.', release_date: '2024-10-25', rating: 6.8 },
  { tmdb_id: 573435, title: 'Bad Boys: Ride or Die', poster_path: `${TMDB_IMAGE_BASE}/qv0qDNAkfGhQshZfVd11hWC9vJW.jpg`, overview: 'Detectives Mike Lowrey and Marcus Burnett are back in action.', release_date: '2024-06-07', rating: 7.1 }
];

export const fetchPopularMovies = async () => mockMovies;

export const searchMovies = async (query) => {
  const lowerQuery = query.toLowerCase();
  return mockMovies.filter(m => m.title.toLowerCase().includes(lowerQuery));
};

export const fetchMovieDetails = async (movieId) => {
  const movie = mockMovies.find(m => m.tmdb_id === parseInt(movieId));
  if (!movie) return null;
  return { ...movie, backdrop_path: movie.poster_path?.replace('/w500', '/original'), runtime: 120 + Math.floor(Math.random() * 40), genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }] };
};