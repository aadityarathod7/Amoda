import express from 'express';
import {
  submitInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} from '../controllers/contactController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/admin', protect, getInquiries);
router.patch('/admin/:id', protect, updateInquiry);
router.delete('/admin/:id', protect, deleteInquiry);

export default router;
