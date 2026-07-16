import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Package, UserCheck, Navigation, CheckCircle, XCircle, Gift, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface Notification {
  id: number; type: string; title: string; body: string;
  data_json: Record<string, unknown> | null;
  read: boolean; created_at: string;
}

const TYPE_META: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  booking_confirmed:    { icon: Package,     color: 'text-blue-600',    bg: 'bg-blue-50' },
  booking_assigned:     { icon: UserCheck,   color: 'text-indigo-600',  bg: 'bg-indigo-50' },
  partner_en_route:     { icon: Navigation,  color: 'text-sky-600',     bg: 'bg-sky-50' },
  booking_completed:    { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  booking_cancelled:    { icon: XCircle,     color: 'text-red-500',     bg: 'bg-red-50' },
  complaint_resolved:   { icon: AlertCircle, color: 'text-amber-600',   bg: 'bg-amber-50' },
  referral_reward:      { icon: Gift,        color: 'text-violet-600',  bg: 'bg-violet-50' },
  broadcast:            { icon: Bell,        color: 'text-gray-600',    bg: 'bg-gray-50' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/notifications');
      setItems(data.data?.items ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all').catch(() => {});
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = items.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-400 mt-0.5">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700">
            <CheckCheck size={15}/> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={40} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(n => {
            const meta = TYPE_META[n.type] ?? TYPE_META.broadcast;
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`w-full text-left flex gap-3.5 p-4 rounded-xl border transition-colors ${
                  n.read ? 'bg-white border-gray-100' : 'bg-blue-50/60 border-blue-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                  <Icon size={16} className={meta.color}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${n.read ? 'text-gray-800' : 'text-gray-900'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-xs text-gray-300 mt-1.5">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
