import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

// Public
export const fetchProducts = (params) => api.get('/products', { params });
export const fetchFeaturedProducts = () => api.get('/products/featured');
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const fetchPublicSettings = () => api.get('/settings/public');
export const submitContact = (data) => api.post('/contact', data);

// Admin
export const adminLogin = (data) => api.post('/admin/login', data);
export const adminLogout = () => api.post('/admin/logout');
export const fetchDashboard = () => api.get('/admin/dashboard');
export const fetchAllProducts = (params) => api.get('/products/admin/all', { params });
export const createProduct = (data) => api.post('/products/admin', data);
export const updateProduct = (id, data) => api.put(`/products/admin/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/admin/${id}`);
export const updateStock = (id, qty) =>
  api.patch(`/products/admin/${id}/stock`, { stockQuantity: qty });
export const incrementOrderCount = (id) =>
  api.patch(`/products/admin/${id}/order`);
export const uploadImages = (formData) =>
  api.post('/products/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const fetchInquiries = (params) => api.get('/contact/admin', { params });
export const updateInquiry = (id, data) => api.patch(`/contact/admin/${id}`, data);
export const deleteInquiry = (id) => api.delete(`/contact/admin/${id}`);
export const updateSettings = (data) => api.put('/settings/admin', data);

export default api;
