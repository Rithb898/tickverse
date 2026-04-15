const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const mockMovies = [
  {
    id: 1,
    tmdb_id: 83533,
    title: "Avatar: Fire and Ash",
    poster_path: `${TMDB_IMAGE_BASE}/cf7hE1ifY4UNbS25tGnaTyyDrI2.jpg`,
    overview:
      "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Navi tribe led by the ruthless Varang. Jakes family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
    release_date: "2025-12-17",
    rating: 7.371,
  },
  {
    id: 2,
    tmdb_id: 1582770,
    title: "Dhurandhar The Revenge",
    poster_path: `${TMDB_IMAGE_BASE}/ov8vrRLZGoXHpYjSY9Vpv1tHJX7.jpg`,
    overview: "As rival gangs, corrupt officials and a ruthless Major Iqbal close in, Hamza's mission for his country spirals into a bloody personal war where the line between patriot and monster disappears in the streets of Lyari.",
    release_date: "2023-12-22",
    rating: 6.9,
  },
  {
    id: 3,
    tmdb_id: 866398,
    title: "Project Hail Mary",
    poster_path: `${TMDB_IMAGE_BASE}/yihdXomYb5kTeSivtFndMy5iDmf.jpg`,
    overview:
      "Science teacher Ryland Grace wakes up on a spaceship light years from home with no recollection of who he is or how he got there. As his memory returns, he begins to uncover his mission: solve the riddle of the mysterious substance causing the sun to die out. He must call on his scientific knowledge and unorthodox ideas to save everything on Earth from extinction… but an unexpected friendship means he may not have to do it alone.",
    release_date: "2026-03-15",
    rating: 8.2,
  },
  {
    id: 4,
    tmdb_id: 848538,
    title: "Dhurandhar",
    poster_path: `${TMDB_IMAGE_BASE}/snBOuXDdhmTvlzMUvP9Em3Pp1u1.jpg`,
    overview: "A mysterious traveler slips into the heart of Karachi's underbelly and rises through its ranks with lethal precision, only to tear the notorious ISI-Underworld nexus apart from within.",
    release_date: "2025-05-12",
    rating: 7.024,
  },
  {
    id: 5,
    tmdb_id: 940551,
    title: "Migration",
    poster_path: `${TMDB_IMAGE_BASE}/ldfCF9RhR40mppkzmftxapaHeTo.jpg`,
    overview: "A family of ducks embarks on the adventure of a lifetime.",
    release_date: "2023-12-22",
    rating: 7.3,
  },
];

const mockShowtimes = [
  {
    id: 1,
    movie_id: 1,
    screen_number: 1,
    show_time: new Date(Date.now() + 3600000 * 2).toISOString(),
  },
  {
    id: 2,
    movie_id: 1,
    screen_number: 1,
    show_time: new Date(Date.now() + 3600000 * 6).toISOString(),
  },
  {
    id: 3,
    movie_id: 1,
    screen_number: 2,
    show_time: new Date(Date.now() + 3600000 * 10).toISOString(),
  },
  {
    id: 4,
    movie_id: 2,
    screen_number: 3,
    show_time: new Date(Date.now() + 3600000 * 3).toISOString(),
  },
  {
    id: 5,
    movie_id: 2,
    screen_number: 3,
    show_time: new Date(Date.now() + 3600000 * 7).toISOString(),
  },
  {
    id: 6,
    movie_id: 3,
    screen_number: 4,
    show_time: new Date(Date.now() + 3600000 * 4).toISOString(),
  },
  {
    id: 7,
    movie_id: 3,
    screen_number: 4,
    show_time: new Date(Date.now() + 3600000 * 8).toISOString(),
  },
  {
    id: 8,
    movie_id: 4,
    screen_number: 1,
    show_time: new Date(Date.now() + 3600000 * 5).toISOString(),
  },
  {
    id: 9,
    movie_id: 5,
    screen_number: 2,
    show_time: new Date(Date.now() + 3600000 * 3).toISOString(),
  },
  {
    id: 10,
    movie_id: 6,
    screen_number: 3,
    show_time: new Date(Date.now() + 3600000 * 4).toISOString(),
  },
  {
    id: 11,
    movie_id: 7,
    screen_number: 4,
    show_time: new Date(Date.now() + 3600000 * 5).toISOString(),
  },
  {
    id: 12,
    movie_id: 8,
    screen_number: 1,
    show_time: new Date(Date.now() + 3600000 * 6).toISOString(),
  },
];

export const fetchPopularMovies = async () => mockMovies;

export const searchMovies = async (query) => {
  const lowerQuery = query.toLowerCase();
  return mockMovies.filter((m) => m.title.toLowerCase().includes(lowerQuery));
};

export const fetchMovieDetails = async (movieId) => {
  const movie = mockMovies.find(
    (m) => m.id === parseInt(movieId) || m.tmdb_id === parseInt(movieId),
  );
  if (!movie) return null;
  return {
    ...movie,
    backdrop_path: movie.poster_path?.replace("/w500", "/original"),
    runtime: 120 + Math.floor(Math.random() * 40),
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
    ],
  };
};

export const fetchShowtimes = async (movieId) => {
  return mockShowtimes.filter(
    (s) =>
      s.movie_id === parseInt(movieId) ||
      s.movie_id ===
        mockMovies.find((m) => m.tmdb_id === parseInt(movieId))?.id,
  );
};
