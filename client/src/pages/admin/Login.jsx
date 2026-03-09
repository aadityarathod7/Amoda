import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login — Amoda</title></Helmet>
      <div className="min-h-screen bg-text-dark flex items-center justify-center px-4">
        <motion.div
          className="bg-background rounded-2xl shadow-2xl w-full max-w-sm p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-text-dark">Amoda</h1>
            <p className="font-sans text-sm text-secondary mt-1">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-sm text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="admin@amoda.com"
                className="w-full border border-accent rounded-candle px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-sm text-secondary mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                placeholder="••••••••"
                className="w-full border border-accent rounded-candle px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
