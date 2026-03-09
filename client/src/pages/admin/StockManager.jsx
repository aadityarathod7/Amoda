import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { fetchAllProducts, updateStock } from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const stockColor = (qty) => {
  if (qty === 0) return 'bg-red-100 text-red-700 border-red-200';
  if (qty < 5) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-green-100 text-green-700 border-green-200';
};

export default function StockManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    fetchAllProducts({ limit: 100, sort: 'stock-asc' })
      .then((r) => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (id, qty) => {
    if (qty === '' || isNaN(qty) || Number(qty) < 0) return toast.error('Enter a valid quantity');
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      await updateStock(id, Number(qty));
      toast.success('Stock updated');
      setEditing((e) => { const n = { ...e }; delete n[id]; return n; });
      load();
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving((s) => { const n = { ...s }; delete n[id]; return n; });
    }
  };

  const lowStock = products.filter((p) => p.stockQuantity < 5 && p.isActive);

  return (
    <>
      <Helmet><title>Stock — Amoda Admin</title></Helmet>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-text-dark">Stock Manager</h1>
            <p className="font-sans text-sm text-secondary">Update inventory levels inline</p>
          </div>

          {/* Low stock alerts */}
          {lowStock.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-candle p-4 mb-6">
              <p className="font-sans text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Low Stock Alert ({lowStock.length} products)
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStock.map((p) => (
                  <span key={p._id} className="font-sans text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    {p.name} ({p.stockQuantity === 0 ? 'Out' : p.stockQuantity})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-candle shadow-card overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead className="bg-accent/30">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock Status', 'Update Stock'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-secondary uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-accent">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                          <span className="font-medium text-text-dark">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-secondary">{p.scentCategory}</td>
                      <td className="px-4 py-3 text-secondary">₹{p.price}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stockColor(p.stockQuantity)}`}>
                          {p.stockQuantity === 0 ? 'Out of Stock' : p.stockQuantity < 5 ? `Low (${p.stockQuantity})` : `In Stock (${p.stockQuantity})`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={editing[p._id] ?? p.stockQuantity}
                            onChange={(e) => setEditing((ed) => ({ ...ed, [p._id]: e.target.value }))}
                            className="w-20 border border-accent rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-primary"
                          />
                          {editing[p._id] !== undefined && editing[p._id] !== String(p.stockQuantity) && (
                            <button
                              onClick={() => handleSave(p._id, editing[p._id])}
                              disabled={saving[p._id]}
                              className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                            >
                              {saving[p._id] ? '...' : 'Save'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
