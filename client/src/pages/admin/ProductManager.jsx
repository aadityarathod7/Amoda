import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  incrementOrderCount,
} from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const EMPTY_FORM = {
  name: '', description: '', price: '', scentCategory: 'floral',
  burnTime: '', waxType: 'soy', weight: '', stockQuantity: '',
  isFeatured: false, isActive: true, images: [],
};

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    try {
      const res = await uploadImages(fd);
      setForm((f) => ({ ...f, images: [...f.images, ...res.data.urls] }));
      toast.success('Images uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images.length) return toast.error('Add at least one image');
    setSaving(true);
    try {
      await onSave({ ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-accent rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-sans text-secondary mb-1">Product Name *</label>
          <input required value={form.name} onChange={set('name')} className={inputCls} placeholder="Rose Petal Bliss" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-sans text-secondary mb-1">Description *</label>
          <textarea required value={form.description} onChange={set('description')} rows={3} className={inputCls} placeholder="Product description..." />
        </div>
        <div>
          <label className="block text-xs font-sans text-secondary mb-1">Price (₹) *</label>
          <input required type="number" min="0" value={form.price} onChange={set('price')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-sans text-secondary mb-1">Stock Quantity *</label>
          <input required type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-sans text-secondary mb-1">Scent Category</label>
          <select value={form.scentCategory} onChange={set('scentCategory')} className={inputCls}>
            {['floral','woody','fruity','fresh','sweet','custom'].map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans text-secondary mb-1">Wax Type</label>
          <select value={form.waxType} onChange={set('waxType')} className={inputCls}>
            {['soy','beeswax','coconut','paraffin','blend'].map((w) => (
              <option key={w} value={w} className="capitalize">{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans text-secondary mb-1">Burn Time *</label>
          <input required value={form.burnTime} onChange={set('burnTime')} className={inputCls} placeholder="45-50 hours" />
        </div>
        <div>
          <label className="block text-xs font-sans text-secondary mb-1">Weight/Size *</label>
          <input required value={form.weight} onChange={set('weight')} className={inputCls} placeholder="200g" />
        </div>
        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} className="accent-primary" />
            <span className="font-sans text-sm text-text-dark">Featured on homepage</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="accent-primary" />
            <span className="font-sans text-sm text-text-dark">Active (visible in shop)</span>
          </label>
        </div>

        {/* Image upload */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-sans text-secondary mb-1">Product Images *</label>
          <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-accent rounded-lg px-4 py-3 hover:border-primary transition-colors w-max">
            <span className="font-sans text-sm text-secondary">{uploading ? 'Uploading...' : '+ Upload Images'}</span>
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
          {form.images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-16 h-16">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchAllProducts({ search, page, limit: 10 })
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    try {
      await createProduct(data);
      toast.success('Product created');
      setShowForm(false);
      load();
    } catch { toast.error('Failed to create product'); }
  };

  const handleUpdate = async (data) => {
    try {
      await updateProduct(editing._id, data);
      toast.success('Product updated');
      setEditing(null);
      load();
    } catch { toast.error('Failed to update product'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      load();
    } catch { toast.error('Failed to delete product'); }
  };

  const handleMarkOrdered = async (id) => {
    try {
      await incrementOrderCount(id);
      toast.success('Order count incremented');
      load();
    } catch { toast.error('Failed to update order count'); }
  };

  const pages = Math.ceil(total / 10);

  return (
    <>
      <Helmet><title>Products — Amoda Admin</title></Helmet>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-2xl text-text-dark">Products</h1>
              <p className="font-sans text-sm text-secondary">{total} total</p>
            </div>
            <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">
              + Add Product
            </button>
          </div>

          {/* Form modal */}
          {(showForm || editing) && (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-text-dark/50 backdrop-blur-sm overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 mt-10 mb-10">
                <h2 className="font-serif text-xl text-text-dark mb-5">
                  {editing ? 'Edit Product' : 'New Product'}
                </h2>
                <ProductForm
                  initial={editing}
                  onSave={editing ? handleUpdate : handleCreate}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              </div>
            </div>
          )}

          {/* Delete confirm */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/50">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="font-serif text-lg text-text-dark mb-2">Delete Product?</h3>
                <p className="font-sans text-sm text-secondary mb-5">
                  This will deactivate "{deleteConfirm.name}". This can be undone by re-activating.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => handleDelete(deleteConfirm._id)} className="btn-primary bg-red-500 hover:bg-red-600 text-sm">Delete</button>
                  <button onClick={() => setDeleteConfirm(null)} className="btn-outline text-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="border border-accent rounded-lg px-4 py-2 text-sm font-sans focus:outline-none focus:border-primary w-64"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-candle shadow-card overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead className="bg-accent/30">
                <tr>
                  {['Product', 'Price', 'Stock', 'Orders', 'Category', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-secondary uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-accent">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-secondary">No products found</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                          <div>
                            <p className="font-medium text-text-dark">{p.name}</p>
                            {p.isFeatured && <span className="text-xs text-primary">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-secondary">₹{p.price}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.stockQuantity === 0 ? 'bg-red-100 text-red-700'
                          : p.stockQuantity < 5 ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                        }`}>
                          {p.stockQuantity === 0 ? 'Out' : p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-secondary">{p.orderCount ?? 0}</td>
                      <td className="px-4 py-3 capitalize text-secondary">{p.scentCategory}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => setEditing(p)} className="text-xs text-primary hover:underline">Edit</button>
                          <button onClick={() => handleMarkOrdered(p._id)} className="text-xs text-green-600 hover:underline" title={`Orders: ${p.orderCount ?? 0}`}>+Order</button>
                          <button onClick={() => setDeleteConfirm(p)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex gap-2 mt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full text-xs font-sans transition-all ${
                    page === p ? 'bg-primary text-white' : 'border border-accent text-secondary hover:border-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
