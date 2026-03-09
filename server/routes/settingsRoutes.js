import express from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicSettings);
router.put('/admin', protect, updateSettings);

export default router;
