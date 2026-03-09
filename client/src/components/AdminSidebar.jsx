import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LayoutDashboard, Flame, Package, MessageSquare, Settings, LogOut } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Flame },
  { to: '/admin/stock', label: 'Stock', icon: Package },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-text-dark min-h-screen flex flex-col py-6 px-4">
      <div className="mb-8">
        <h1 className="font-serif text-xl text-white">Amoda</h1>
        <p className="font-sans text-xs text-accent/50 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-accent/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-accent/50 hover:text-white hover:bg-white/10 transition-all mt-4"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}
