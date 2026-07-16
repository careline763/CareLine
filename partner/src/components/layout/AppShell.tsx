import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { subscribeToPush } from '../../services/notifications';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface Props { children: React.ReactNode; title?: string; back?: boolean; }

function NotificationBell({ unread, onClick, size = 'md' }: { unread: number; onClick: () => void; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'w-10 h-10' : 'w-9 h-9';
  return (
    <Link
      to="/notifications"
      onClick={onClick}
      className={`relative ${dim} flex items-center justify-center rounded-xl bg-gray-100 md:bg-gray-50 text-gray-500 hover:bg-sky-50 hover:text-sky-500 transition-colors flex-shrink-0`}
    >
      <Bell size={18} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}

export default function AppShell({ children, title, back }: Props) {
  const [unread, setUnread] = useState(0);
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    subscribeToPush();
    api.get('/notifications/unread-count').then(({ data }) => setUnread(data.data ?? 0)).catch(() => {});
    const t = setInterval(() => {
      api.get('/notifications/unread-count').then(({ data }) => setUnread(data.data ?? 0)).catch(() => {});
    }, 60_000);
    return () => clearInterval(t);
  }, [token]);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'P';

  return (
    <div className="md:flex min-h-dvh bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        {title && (
          <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100/80 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-30">
            {back && (
              <button
                onClick={() => history.back()}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
            )}
            <h1 className="flex-1 text-base font-bold text-gray-900 tracking-tight">{title}</h1>
            <NotificationBell unread={unread} onClick={() => setUnread(0)} size="sm" />
          </header>
        )}

        {/* Desktop topbar */}
        <header className="hidden md:flex items-center gap-4 h-16 px-8 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
          {back && (
            <button
              onClick={() => history.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h1>
          <div className="flex-1" />
          <NotificationBell unread={unread} onClick={() => setUnread(0)} />
          <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
        </header>

        <main className="flex-1 pb-28 md:pb-10">{children}</main>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
