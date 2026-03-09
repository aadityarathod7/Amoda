import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { fetchPublicSettings, updateSettings } from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminSettings() {
  const [form, setForm] = useState({
    whatsappNumber: '',
    instagramUsername: '',
    heroTagline: '',
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPublicSettings()
      .then((r) => setForm(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-accent rounded-candle px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors';

  return (
    <>
      <Helmet><title>Settings — Amoda Admin</title></Helmet>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-text-dark">Settings</h1>
            <p className="font-sans text-sm text-secondary">Manage site-wide configuration</p>
          </div>

          {loading ? (
            <div className="space-y-4 max-w-lg">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-candle" />)}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
              <div>
                <label className="block font-sans text-sm text-secondary mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  value={form.whatsappNumber}
                  onChange={set('whatsappNumber')}
                  className={inputCls}
                  placeholder="91XXXXXXXXXX (with country code, no +)"
                />
                <p className="font-sans text-xs text-secondary/50 mt-1">
                  Example: 919876543210 (91 for India + 10-digit number)
                </p>
              </div>

              <div>
                <label className="block font-sans text-sm text-secondary mb-1.5">
                  Instagram Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-sm text-secondary/60">@</span>
                  <input
                    value={form.instagramUsername}
                    onChange={set('instagramUsername')}
                    className={`${inputCls} pl-8`}
                    placeholder="amoda.candles"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm text-secondary mb-1.5">
                  Hero Tagline
                </label>
                <input
                  value={form.heroTagline}
                  onChange={set('heroTagline')}
                  className={inputCls}
                  placeholder="Handcrafted with love, scented with soul"
                />
                <p className="font-sans text-xs text-secondary/50 mt-1">
                  Displayed on the homepage hero section
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-candle p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.maintenanceMode}
                    onChange={set('maintenanceMode')}
                    className="accent-red-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-sans text-sm font-medium text-red-800">Maintenance Mode</p>
                    <p className="font-sans text-xs text-red-600">
                      Hides the storefront from customers (admin panel still accessible)
                    </p>
                  </div>
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
