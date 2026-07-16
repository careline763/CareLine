import { NavLink } from 'react-router-dom';
import { Briefcase, IndianRupee, User, ClipboardCheck, Bell } from 'lucide-react';

const links = [
  { to: '/jobs',          icon: Briefcase,      label: 'Jobs' },
  { to: '/checklist',     icon: ClipboardCheck, label: 'Checklist' },
  { to: '/earnings',      icon: IndianRupee,    label: 'Earnings' },
  { to: '/notifications', icon: Bell,           label: 'Alerts' },
  { to: '/profile',       icon: User,           label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40">
      <div className="mx-3 mb-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 flex px-2 py-1.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 rounded-xl transition-all ${
                isActive ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
