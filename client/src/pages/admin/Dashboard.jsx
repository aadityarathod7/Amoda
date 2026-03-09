import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { fetchDashboard } from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import { DashboardStatSkeleton } from '../../components/Skeletons';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`rounded-candle p-5 ${color} flex items-center gap-4`}>
    <div className="text-3xl">{icon}</div>
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
                <StatCard label="Total Products" value={data?.totalProducts} icon="🕯️" color="bg-primary/10 text-secondary" />
                <StatCard label="In Stock" value={data?.inStockCount} icon="✅" color="bg-green-50 text-green-800" />
                <StatCard label="Out of Stock" value={data?.outOfStockCount} icon="⚠️" color="bg-red-50 text-red-800" />
                <StatCard label="Inquiries" value={data?.totalInquiries} icon="💬" color="bg-blue-50 text-blue-800" />
              </>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { to: '/admin/products', label: 'Manage Products', desc: 'Add, edit, or remove candles', icon: '🕯️' },
              { to: '/admin/stock', label: 'Update Stock', desc: 'Quick inventory management', icon: '📦' },
              { to: '/admin/inquiries', label: 'View Inquiries', desc: 'Customer messages', icon: '💬' },
            ].map(({ to, label, desc, icon }) => (
              <Link
                key={to}
                to={to}
                className="bg-white rounded-candle shadow-card p-5 hover:shadow-warm transition-shadow group"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-sans font-medium text-text-dark group-hover:text-primary transition-colors">{label}</p>
                <p className="font-sans text-xs text-secondary mt-1">{desc}</p>
              </Link>
            ))}
          </div>

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
