import { Link, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User, LogOut, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../features/authStore';
import { subscribeToPush } from '../../services/notifications';
import api from '../../services/api';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    subscribeToPush();
    api.get('/notifications/unread-count')
      .then(({ data }) => setUnread(data.data ?? 0))
      .catch(() => {});
    const interval = setInterval(() => {
      api.get('/notifications/unread-count')
        .then(({ data }) => setUnread(data.data ?? 0))
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/plans', label: 'Plans' },
    { to: '/support', label: 'Support' },
  ];

  return (
    <nav className="bg-luxuryDark-base/90 backdrop-blur-md border-b border-luxuryDark-border/60 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex flex-col items-center group">
            <span className="font-serif text-2xl tracking-widest text-luxuryGold font-semibold group-hover:text-luxuryGold-light transition-colors flex items-center gap-2">
              <Car size={20} className="text-luxuryGold/80" />
              CARELINE
            </span>
            <span className="text-[8px] tracking-[0.4em] text-gray-400 font-semibold uppercase mt-0.5">P R E M I U M &nbsp; C A R E</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-gray-300">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-luxuryGold transition-colors uppercase">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/bookings" className="text-xs text-gray-300 hover:text-luxuryGold font-medium tracking-wider uppercase transition-colors">My Bookings</Link>
                <Link to="/notifications" className="relative text-gray-400 hover:text-luxuryGold transition-colors p-2" onClick={() => setUnread(0)}>
                  <Bell size={20}/>
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-luxuryGold text-black text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-luxuryDark-base">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-xs font-medium text-luxuryGold bg-luxuryDark-card hover:bg-luxuryDark-input px-4 py-2 rounded-sm border border-luxuryDark-border transition-all">
                  <User size={14} /> {user?.name?.split(' ')[0] || 'User'}
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors p-2">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-luxuryGold hover:bg-luxuryGold-light text-black text-xs font-bold tracking-widest px-5 py-2.5 rounded-sm transition-all duration-300 uppercase">
                Login / Sign Up
              </Link>
            )}
          </div>

          <button className="md:hidden text-gray-300 hover:text-luxuryGold" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-luxuryDark-border/80 bg-luxuryDark-base px-4 py-3 space-y-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-gray-300 hover:text-luxuryGold py-2 text-sm font-semibold tracking-wider uppercase transition-colors">
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/bookings" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-luxuryGold py-2 text-sm font-semibold tracking-wider uppercase">My Bookings</Link>
              <Link to="/notifications" onClick={() => { setOpen(false); setUnread(0); }} className="flex items-center gap-2 text-gray-300 hover:text-luxuryGold py-2 text-sm font-semibold tracking-wider uppercase">
                Notifications {unread > 0 && <span className="bg-luxuryGold text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{unread}</span>}
              </Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-luxuryGold py-2 text-sm font-semibold tracking-wider uppercase">Profile</Link>
              <button onClick={handleLogout} className="block text-red-400 hover:text-red-300 py-2 text-sm font-semibold">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block text-luxuryGold hover:text-luxuryGold-light py-2 text-sm font-semibold tracking-wider uppercase">Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
}
