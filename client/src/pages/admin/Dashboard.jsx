import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { fetchDashboard } from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import { DashboardStatSkeleton } from '../../components/Skeletons';
import { Flame, CheckCircle, AlertCircle, MessageSquare, Package, Eye, TrendingUp, TriangleAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className={`rounded-candle p-5 ${color} flex items-center gap-4`}>
    <div><Icon size={32} /></div>
    <div>
      <p className="font-sans text-sm opacity-70">{label}</p>
      <p className="font-serif text-3xl font-bold">{value ?? '—'}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Dashboard — Amoda Admin</title></Helmet>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="font-serif text-2xl text-text-dark">Dashboard</h1>
            <p className="font-sans text-sm text-secondary mt-1">Overview of your store</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <DashboardStatSkeleton key={i} />)
            ) : (
              <>
                <StatCard label="Total Products" value={data?.totalProducts} icon={Flame} color="bg-primary/10 text-secondary" />
                <StatCard label="In Stock" value={data?.inStockCount} icon={CheckCircle} color="bg-green-50 text-green-800" />
                <StatCard label="Out of Stock" value={data?.outOfStockCount} icon={AlertCircle} color="bg-red-50 text-red-800" />
                <StatCard label="Inquiries" value={data?.totalInquiries} icon={MessageSquare} color="bg-blue-50 text-blue-800" />
              </>
            )}
          </div>

          {/* Low stock alert */}
          {!loading && data?.lowStock?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-candle p-4 mb-6 flex items-start gap-3">
              <TriangleAlert size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-medium text-yellow-800 mb-1">
                  Low Stock Warning — {data.lowStock.length} product{data.lowStock.length > 1 ? 's' : ''} running low
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.lowStock.map((p) => (
                    <Link key={p._id} to="/admin/stock" className="font-sans text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-full transition-colors">
                      {p.name} ({p.stockQuantity} left)
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { to: '/admin/products', label: 'Manage Products', desc: 'Add, edit, or remove candles', icon: Flame },
              { to: '/admin/stock', label: 'Update Stock', desc: 'Quick inventory management', icon: Package },
              { to: '/admin/inquiries', label: 'View Inquiries', desc: 'Customer messages', icon: MessageSquare },
            ].map(({ to, label, desc, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="bg-white rounded-candle shadow-card p-5 hover:shadow-warm transition-shadow group"
              >
                <div className="mb-2"><Icon size={24} /></div>
                <p className="font-sans font-medium text-text-dark group-hover:text-primary transition-colors">{label}</p>
                <p className="font-sans text-xs text-secondary mt-1">{desc}</p>
              </Link>
            ))}
          </div>

          {/* Analytics — Most Viewed & Most Ordered */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Most Viewed */}
            <div className="bg-white rounded-candle shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-blue-500" />
                <h2 className="font-serif text-lg text-text-dark">Most Viewed</h2>
              </div>
              {data?.mostViewed?.length > 0 ? (
                <ul className="space-y-3">
                  {data.mostViewed.map((p, i) => (
                    <li key={p._id} className="flex items-center gap-3">
                      <span className="font-sans text-xs text-secondary/50 w-4">{i + 1}</span>
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <span className="font-sans text-sm text-text-dark flex-1 truncate">{p.name}</span>
                      <span className="font-sans text-xs text-blue-600 font-semibold">{p.views} views</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-sm text-secondary/50">No data yet</p>
              )}
            </div>

            {/* Most Ordered */}
            <div className="bg-white rounded-candle shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary" />
                <h2 className="font-serif text-lg text-text-dark">Most Selling</h2>
              </div>
              {data?.mostOrdered?.length > 0 ? (
                <ul className="space-y-3">
                  {data.mostOrdered.map((p, i) => (
                    <li key={p._id} className="flex items-center gap-3">
                      <span className="font-sans text-xs text-secondary/50 w-4">{i + 1}</span>
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <span className="font-sans text-sm text-text-dark flex-1 truncate">{p.name}</span>
                      <span className="font-sans text-xs text-primary font-semibold">{p.orderCount} orders</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-sm text-secondary/50">No orders recorded yet</p>
              )}
            </div>
          </div>

          {/* Views bar chart */}
          {!loading && data?.mostViewed?.some((p) => p.views > 0) && (
            <div className="bg-white rounded-candle shadow-card p-5 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-blue-500" />
                <h2 className="font-serif text-lg text-text-dark">Product Views — Top 5</h2>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.mostViewed} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'sans-serif' }} tickFormatter={(v) => v.length > 14 ? v.slice(0, 14) + '…' : v} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(v) => [`${v} views`, 'Views']}
                    contentStyle={{ fontFamily: 'sans-serif', fontSize: 12, borderRadius: 8 }}
                  />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                    {data.mostViewed.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#d4a574' : '#e8c9a0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent inquiries */}
          {data?.recentInquiries?.length > 0 && (
            <div>
              <h2 className="font-serif text-xl text-text-dark mb-4">Recent Inquiries</h2>
              <div className="bg-white rounded-candle shadow-card divide-y divide-accent">
                {data.recentInquiries.map((inq) => (
                  <div key={inq._id} className="p-4 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${inq.isRead ? 'bg-accent' : 'bg-primary'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-sm font-medium text-text-dark">{inq.name}</p>
                      <p className="font-sans text-xs text-secondary truncate">{inq.message}</p>
                    </div>
                    <span className="font-sans text-xs text-secondary/50 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/admin/inquiries" className="font-sans text-sm text-primary mt-3 inline-block hover:underline">
                View all inquiries →
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
