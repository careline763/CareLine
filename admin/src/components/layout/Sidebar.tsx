import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, CreditCard, Tag, MapPin, Settings, LogOut, Car, BarChart3, Bell, UserCircle, Gift, MessageSquareWarning, Zap, BellRing } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/partners', icon: Users, label: 'Partners' },
  { to: '/users', icon: UserCircle, label: 'Users' },
  { to: '/referrals', icon: Gift, label: 'Referrals' },
  { to: '/subscriptions', icon: Bell, label: 'Subscriptions' },
  // { to: '/societies', icon: Building2, label: 'Societies' }, // B2B — disabled, B2C only
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/plans', icon: CreditCard, label: 'Plans' },
  { to: '/pricing', icon: Zap, label: 'Pricing' },
  // { to: '/fleet', icon: Truck, label: 'Fleet (B2B)' }, // B2B — disabled, B2C only
  { to: '/notifications', icon: BellRing, label: 'Notifications' },
  { to: '/coupons', icon: Tag, label: 'Coupons' },
  { to: '/service-areas', icon: MapPin, label: 'Service Areas' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="w-60 bg-gray-900 flex flex-col min-h-screen flex-shrink-0">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Car size={22} className="text-indigo-400" />
          <span>SparkWash</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
