import { Router } from 'express';
import { createBooking, getMyBookings, cancelBooking } from './bookings.controller.mjs';
import { requireAuth } from '../../lib/auth.mjs';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/my', requireAuth, getMyBookings);
router.delete('/:id', requireAuth, cancelBooking);

export default router;