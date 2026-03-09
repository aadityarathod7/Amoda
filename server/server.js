import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Dynamic sitemap
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const products = await Product.find({ isActive: true }).select('_id updatedAt').lean();
    const BASE = process.env.CLIENT_URL || 'https://amodacandles.com';
    const staticPages = ['', '/shop', '/about', '/contact', '/faq', '/shipping'];
    const urls = [
      ...staticPages.map((p) => `<url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq></url>`),
      ...products.map((p) => `<url><loc>${BASE}/products/${p._id}</loc><lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
    ];
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
  } catch {
    res.status(500).send('Error generating sitemap');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
