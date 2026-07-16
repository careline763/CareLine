import { useEffect, useState } from 'react';
import { Bell, Briefcase, CheckCircle, IndianRupee, AlertCircle, CheckCheck } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import api from '../../services/api';

interface Notification {
  id: number; type: string; title: string; body: string;
  read: boolean; created_at: string;
}

const TYPE_META: Record<string, { icon: typeof Bell; color: string; bg: string; accent: string }> = {
  booking_assigned:  { icon: Briefcase,   color: 'text-indigo-600', bg: 'bg-indigo-100', accent: 'border-l-indigo-400' },
  booking_completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', accent: 'border-l-emerald-400' },
  booking_cancelled: { icon: AlertCircle, color: 'text-red-500',     bg: 'bg-red-100',    accent: 'border-l-red-400' },
  referral_reward:   { icon: IndianRupee, color: 'text-violet-600', bg: 'bg-violet-100', accent: 'border-l-violet-400' },
  broadcast:         { icon: Bell,        color: 'text-sky-600',    bg: 'bg-sky-100',    accent: 'border-l-sky-400' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const MOCK: Notification[] = [
  { id: 1, type: 'booking_assigned',  title: 'New Job Assigned',       body: 'Honda City wash at Sunrise Apartments — Today 10:00 AM', read: false, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, type: 'booking_completed', title: 'Job Completed',           body: 'Great work! You earned ₹499 for the Maruti Swift wash.',  read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 3, type: 'referral_reward',   title: 'Referral Bonus!',         body: 'You earned ₹50 for referring a new partner.',             read: true,  created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 4, type: 'broadcast',         title: 'SparkWash Update',        body: 'New surge pricing zone added for Andheri West.',          read: true,  created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 5, type: 'booking_cancelled', title: 'Booking Cancelled',       body: 'Job #1839 has been cancelled by the customer.',           read: true,  created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
];

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(({ data }) => setItems(data.data?.items ?? MOCK))
      .catch(() => setItems(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const markRead = (id: number) => {
    api.patch(`/notifications/${id}/read`).catch(() => {});
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAll = () => {
    api.patch('/notifications/read-all').catch(() => {});
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = items.filter(n => !n.read).length;

  return (
    <AppShell title="Notifications">
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-10">
        {/* Header strip */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl px-5 py-4 md:px-6 md:py-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-base">Activity Feed</p>
              <p className="text-sky-100 text-xs mt-0.5">
                {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'You\'re all caught up'}
              </p>
            </div>
            {unread > 0 && (
              <button
                onClick={markAll}
                className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl text-xs text-white font-semibold"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2 pt-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Bell size={28} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-700">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">We'll notify you when something comes up</p>
              </div>
            </div>
          ) : (
            items.map(n => {
              const meta = TYPE_META[n.type] ?? TYPE_META.broadcast;
              const Icon = meta.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={`w-full text-left bg-white rounded-2xl border-l-4 ${meta.accent} shadow-sm border border-gray-100 p-4 flex gap-3 hover:shadow-md active:scale-[0.99] transition-all ${!n.read ? 'ring-1 ring-sky-100' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                    <Icon size={18} className={meta.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold leading-tight ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-gray-300 font-medium mt-1.5">{timeAgo(n.created_at)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
