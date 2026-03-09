import express from 'express';
import { login, logout, getDashboard } from '../controllers/adminController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', protect, getDashboard);

export default router;
