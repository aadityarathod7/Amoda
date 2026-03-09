import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/products
export const getProducts = async (req, res) => {
  const { category, minPrice, maxPrice, inStock, sort, page = 1, limit = 12, search } = req.query;

  const filter = { isActive: true };
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (category) filter.scentCategory = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (inStock === 'true') filter.stockQuantity = { $gt: 0 };
  if (inStock === 'false') filter.stockQuantity = 0;

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// GET /api/products/featured
export const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(6);
  res.json(products);
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!product || !product.isActive)
    return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// POST /api/admin/products
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// PUT /api/admin/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// DELETE /api/admin/products/:id (soft delete)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

// PATCH /api/admin/products/:id/order — increment orderCount
export const incrementOrderCount = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { orderCount: 1 } },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ orderCount: product.orderCount });
};

// PATCH /api/admin/products/:id/stock
export const updateStock = async (req, res) => {
  const { stockQuantity } = req.body;
  if (stockQuantity === undefined || stockQuantity < 0)
    return res.status(400).json({ message: 'Valid stock quantity required' });

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stockQuantity },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// GET /api/admin/products (all, including inactive)
export const getAllProducts = async (req, res) => {
  const { search, sort, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    'stock-asc': { stockQuantity: 1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// POST /api/admin/upload
export const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: 'No files uploaded' });

  const urls = req.files.map((file) => file.path);
  res.json({ urls });
};
