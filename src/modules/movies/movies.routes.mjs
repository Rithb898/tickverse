import { Router } from 'express';
import { getMovies, searchMoviesController, getMovieDetails, getShowtimes, getShowtimeDetails } from './movies.controller.mjs';

const router = Router();

router.get('/', getMovies);
router.get('/search', searchMoviesController);
router.get('/:id', getMovieDetails);
router.get('/:movieId/showtimes', getShowtimes);
router.get('/showtime/:showtimeId', getShowtimeDetails);

export default router;