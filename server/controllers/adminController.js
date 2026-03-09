import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import ContactInquiry from '../models/ContactInquiry.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/admin/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(admin._id);

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ message: 'Login successful', token });
};

// POST /api/admin/logout
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  const [totalProducts, totalInquiries, inStockCount, outOfStockCount, recentInquiries] =
    await Promise.all([
      Product.countDocuments({ isActive: true }),
      ContactInquiry.countDocuments(),
      Product.countDocuments({ stockQuantity: { $gt: 0 }, isActive: true }),
      Product.countDocuments({ stockQuantity: 0, isActive: true }),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({ totalProducts, totalInquiries, inStockCount, outOfStockCount, recentInquiries });
};
