import { NavLink } from 'react-router-dom';
import { Car, RefreshCw, Bell, MessageSquareWarning, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/authStore';

const links = [
  { to: '/bookings', icon: Car, label: 'My Bookings' },
  { to: '/subscriptions', icon: RefreshCw, label: 'Subscriptions' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function AccountSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="lg:col-span-1 lg:sticky lg:top-20">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? 'User'}</p>
            <p className="text-xs text-gray-400 truncate">+91 {user?.phone ?? '—'}</p>
          </div>
        </div>

        <nav className="p-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Log Out
          </button>
        </nav>
      </div>
    </aside>
  );
}
