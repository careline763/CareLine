import { useEffect, useState } from 'react';
import { Bell, Send, Users, UserCheck, Globe, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

type Target = 'all' | 'customers' | 'partners';

const TARGET_OPTIONS: { value: Target; icon: typeof Users; label: string; desc: string }[] = [
  { value: 'all',       icon: Globe,      label: 'Everyone',        desc: 'All registered users' },
  { value: 'customers', icon: Users,      label: 'Customers Only',  desc: 'All customer accounts' },
  { value: 'partners',  icon: UserCheck,  label: 'Partners Only',   desc: 'All partner accounts' },
];

interface SentLog { id: number; title: string; target: string; sent_to: number; sent_at: string }

const MOCK_LOG: SentLog[] = [
  { id: 1, title: '🎉 Monsoon Special — 20% Off!', target: 'customers', sent_to: 1243, sent_at: '2026-06-20T10:00:00' },
  { id: 2, title: 'Bonus payout this Sunday!',      target: 'partners',  sent_to: 89,   sent_at: '2026-06-18T09:00:00' },
  { id: 3, title: 'App maintenance — 2AM tonight',  target: 'all',       sent_to: 1332, sent_at: '2026-06-15T18:00:00' },
];

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [body, setBody]   = useState('');
  const [target, setTarget] = useState<Target>('customers');
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<SentLog[]>([]);

  useEffect(() => { setLogs(MOCK_LOG); }, []);

  const send = async () => {
    if (!title.trim() || !body.trim()) { toast.error('Fill title and message'); return; }
    setSending(true);
    try {
      const { data } = await api.post('/notifications/broadcast', { title, body, target });
      const sentTo: number = data.data?.sent_to ?? 0;
      toast.success(`Sent to ${sentTo} users`);
      setLogs(prev => [{ id: Date.now(), title, target, sent_to: sentTo, sent_at: new Date().toISOString() }, ...prev]);
      setTitle(''); setBody('');
    } catch {
      toast.error('Broadcast failed');
    } finally { setSending(false); }
  };

  return (
    <AdminLayout title="Push Notifications & Alerts">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={18} className="text-indigo-500"/>
            <h2 className="font-semibold text-gray-900">Broadcast Message</h2>
          </div>

          {/* Target selector */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {TARGET_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTarget(opt.value)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-colors ${
                  target === opt.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <opt.icon size={18}/>
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-gray-400 leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-5">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Notification Title *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Monsoon Special — 20% Off!"
                maxLength={80}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-right text-xs text-gray-300 mt-0.5">{title.length}/80</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Message Body *</label>
              <textarea
                value={body} onChange={e => setBody(e.target.value)}
                placeholder="Write your notification message here…"
                rows={4} maxLength={200}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <p className="text-right text-xs text-gray-300 mt-0.5">{body.length}/200</p>
            </div>
          </div>

          {/* Preview */}
          {(title || body) && (
            <div className="bg-gray-900 rounded-xl p-4 mb-5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Preview</p>
              <div className="bg-gray-800 rounded-lg p-3 flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">SW</div>
                <div>
                  <p className="text-xs font-bold text-white">{title || 'Title'}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{body || 'Message body…'}</p>
                </div>
              </div>
            </div>
          )}

          <Button fullWidth onClick={send} disabled={sending || !title || !body}>
            <Send size={15}/> {sending ? 'Sending…' : 'Send Notification'}
          </Button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Sends in-app + web push notification. SMS is not triggered for broadcasts.
          </p>
        </div>

        {/* Log */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500"/> Sent History
          </h2>
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-medium text-gray-900 text-sm leading-snug">{log.title}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    log.target === 'all' ? 'bg-purple-50 text-purple-700' :
                    log.target === 'partners' ? 'bg-sky-50 text-sky-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {log.target}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Users size={11}/>{log.sent_to} recipients</span>
                  <span className="ml-auto">{new Date(log.sent_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No broadcasts sent yet</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
