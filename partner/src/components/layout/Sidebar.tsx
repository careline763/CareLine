import { NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, IndianRupee, User, ClipboardCheck, Bell, Car, Sparkles, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/jobs',          icon: Briefcase,      label: 'Jobs' },
  { to: '/checklist',     icon: ClipboardCheck, label: 'Checklist' },
  { to: '/earnings',      icon: IndianRupee,    label: 'Earnings' },
  { to: '/notifications', icon: Bell,           label: 'Notifications' },
  { to: '/profile',       icon: User,           label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'P';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-dvh sticky top-0 bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-100">
        <div className="relative w-9 h-9 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Car size={18} className="text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-md flex items-center justify-center">
            <Sparkles size={9} className="text-white" />
          </div>
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-gray-900 text-sm tracking-tight">SparkWash</p>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Partner Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name ?? 'Partner'}</p>
            <p className="text-xs text-gray-400 truncate">+91 {user?.phone ?? '—'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
