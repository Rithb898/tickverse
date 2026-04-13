import { Router } from 'express';
import { getSeatsForShowtime } from './seats.controller.mjs';

const router = Router();
router.get('/:showtimeId', getSeatsForShowtime);
export default router;