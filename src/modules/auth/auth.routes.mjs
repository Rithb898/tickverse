import { Router } from 'express';
import { register, login, getCurrentUser } from './auth.controller.mjs';
import { requireAuth } from '../../lib/auth.mjs';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getCurrentUser);

export default router;