import ContactInquiry from '../models/ContactInquiry.js';

// POST /api/contact
export const submitInquiry = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: 'All fields are required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email address' });

  const inquiry = await ContactInquiry.create({ name, email, message });
  res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
};

// GET /api/admin/inquiries
export const getInquiries = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status === 'unread') filter.isRead = false;
  if (status === 'pending') filter.isReplied = false;

  const skip = (Number(page) - 1) * Number(limit);
  const [inquiries, total] = await Promise.all([
    ContactInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactInquiry.countDocuments(filter),
  ]);

  res.json({ inquiries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// PATCH /api/admin/inquiries/:id
export const updateInquiry = async (req, res) => {
  const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json(inquiry);
};

// DELETE /api/admin/inquiries/:id
export const deleteInquiry = async (req, res) => {
  const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json({ message: 'Inquiry deleted' });
};
