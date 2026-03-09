import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  incrementOrderCount,
  getAllProducts,
  uploadImages,
} from '../controllers/productController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Admin (protected)
router.get('/admin/all', protect, getAllProducts);
router.post('/admin', protect, createProduct);
router.put('/admin/:id', protect, updateProduct);
router.delete('/admin/:id', protect, deleteProduct);
router.patch('/admin/:id/stock', protect, updateStock);
router.patch('/admin/:id/order', protect, incrementOrderCount);
router.post('/admin/upload', protect, upload.array('images', 5), uploadImages);

export default router;
