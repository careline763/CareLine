import { useEffect, useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, Gift, TrendingUp, Users } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

type RewardStatus = 'pending' | 'approved' | 'rejected' | 'paid';

interface Referral {
  id: number;
  referrer: { id: number; name: string; phone: string };
  referred: { id: number; name: string; phone: string };
  reward_status: RewardStatus;
  reward_amount: number;
  referred_first_booking: boolean;
  created_at: string;
}

const MOCK_REFERRALS: Referral[] = [
  { id: 1, referrer: { id: 1, name: 'Priya Sharma', phone: '9876543210' }, referred: { id: 9, name: 'Divya Mehta', phone: '9111222333' }, reward_status: 'pending', reward_amount: 100, referred_first_booking: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, referrer: { id: 4, name: 'Amit Patel', phone: '9765432100' }, referred: { id: 10, name: 'Sanjay Rao', phone: '9222333444' }, reward_status: 'approved', reward_amount: 100, referred_first_booking: true, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 3, referrer: { id: 6, name: 'Suresh Iyer', phone: '9234567890' }, referred: { id: 11, name: 'Meena Pillai', phone: '9333444555' }, reward_status: 'paid', reward_amount: 100, referred_first_booking: true, created_at: new Date(Date.now() - 604800000).toISOString() },
  { id: 4, referrer: { id: 1, name: 'Priya Sharma', phone: '9876543210' }, referred: { id: 12, name: 'Arjun Nair', phone: '9444555666' }, reward_status: 'pending', reward_amount: 100, referred_first_booking: false, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 5, referrer: { id: 3, name: 'Anjali Singh', phone: '9988776655' }, referred: { id: 13, name: 'Rohit Joshi', phone: '9555666777' }, reward_status: 'rejected', reward_amount: 100, referred_first_booking: false, created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 6, referrer: { id: 2, name: 'Rahul Verma', phone: '9123456789' }, referred: { id: 14, name: 'Pooja Das', phone: '9666777888' }, reward_status: 'paid', reward_amount: 100, referred_first_booking: true, created_at: new Date(Date.now() - 1209600000).toISOString() },
  { id: 7, referrer: { id: 4, name: 'Amit Patel', phone: '9765432100' }, referred: { id: 15, name: 'Vikram Bose', phone: '9777888999' }, reward_status: 'approved', reward_amount: 100, referred_first_booking: true, created_at: new Date(Date.now() - 518400000).toISOString() },
];

const STATUS_ICON: Record<RewardStatus, React.ReactNode> = {
  pending: <Clock size={14} className="text-yellow-500" />,
  approved: <CheckCircle size={14} className="text-blue-500" />,
  paid: <CheckCircle size={14} className="text-emerald-500" />,
  rejected: <XCircle size={14} className="text-red-500" />,
};

export default function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Referral | null>(null);

  useEffect(() => {
    setTimeout(() => { setReferrals(MOCK_REFERRALS); setLoading(false); }, 400);
  }, []);

  const updateStatus = (id: number, status: RewardStatus) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, reward_status: status } : r));
    toast.success(`Referral ${status}`);
    setSelected(null);
  };

  const filtered = referrals.filter(r => {
    const matchSearch = !search ||
      r.referrer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.referred?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.referrer?.phone?.includes(search) ||
      r.referred?.phone?.includes(search);
    const matchStatus = statusFilter === 'all' || r.reward_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.reward_status === 'pending').length,
    paid: referrals.filter(r => r.reward_status === 'paid').length,
    totalPaid: referrals.filter(r => r.reward_status === 'paid').reduce((s, r) => s + r.reward_amount, 0),
  };

  return (
    <AdminLayout title="Referrals">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Referrals', value: stats.total, icon: <Users size={18} />, cls: 'bg-indigo-50 text-indigo-600' },
          { label: 'Pending Approval', value: stats.pending, icon: <Clock size={18} />, cls: 'bg-amber-50 text-amber-600' },
          { label: 'Rewards Paid', value: stats.paid, icon: <Gift size={18} />, cls: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Paid Out', value: `₹${stats.totalPaid.toLocaleString('en-IN')}`, icon: <TrendingUp size={18} />, cls: 'bg-purple-50 text-purple-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.cls} mb-3`}>
              {c.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Pending banner */}
      {stats.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2 text-amber-800 text-sm">
          <Clock size={15} />
          <strong>{stats.pending}</strong> referral{stats.pending > 1 ? 's' : ''} waiting for reward approval
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by referrer or referred name/phone…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">{filtered.length} referrals</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#', 'Referrer', 'Referred', 'First Booking', 'Reward', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{r.id}</td>

                    {/* Referrer */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{r.referrer?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{r.referrer?.phone ?? '—'}</p>
                    </td>

                    {/* Referred */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{r.referred?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{r.referred?.phone ?? '—'}</p>
                    </td>

                    {/* First booking done? */}
                    <td className="px-4 py-3">
                      {r.referred_first_booking
                        ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium"><CheckCircle size={12} /> Done</span>
                        : <span className="flex items-center gap-1 text-gray-400 text-xs"><Clock size={12} /> Pending</span>}
                    </td>

                    {/* Reward amount */}
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{r.reward_amount}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {STATUS_ICON[r.reward_status]}
                        <Badge label={r.reward_status} />
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {r.reward_status === 'pending' && r.referred_first_booking && (
                          <>
                            <Button size="sm" variant="success" onClick={() => updateStatus(r.id, 'approved')}>
                              <CheckCircle size={12} /> Approve
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => updateStatus(r.id, 'rejected')}>
                              <XCircle size={12} /> Reject
                            </Button>
                          </>
                        )}
                        {r.reward_status === 'approved' && (
                          <Button size="sm" variant="primary" onClick={() => updateStatus(r.id, 'paid')}>
                            <Gift size={12} /> Mark Paid
                          </Button>
                        )}
                        {(r.reward_status === 'paid' || r.reward_status === 'rejected') && (
                          <Button size="sm" variant="ghost" onClick={() => setSelected(r)}>
                            View
                          </Button>
                        )}
                        {r.reward_status === 'pending' && !r.referred_first_booking && (
                          <span className="text-xs text-gray-400 italic px-2">Awaiting first booking</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Referral #${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Referrer */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">Referrer</p>
                <p className="font-bold text-gray-900">{selected.referrer.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selected.referrer.phone}</p>
              </div>
              {/* Referred */}
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide mb-2">Referred</p>
                <p className="font-bold text-gray-900">{selected.referred.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selected.referred.phone}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {[
                ['Reward Amount', `₹${selected.reward_amount}`],
                ['Reward Status', selected.reward_status],
                ['First Booking Done', selected.referred_first_booking ? 'Yes ✓' : 'Not yet'],
                ['Referral Date', new Date(selected.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900 capitalize">{String(v)}</span>
                </div>
              ))}
            </div>

            {selected.reward_status === 'approved' && (
              <Button fullWidth variant="primary" onClick={() => updateStatus(selected.id, 'paid')}>
                <Gift size={14} /> Mark Reward as Paid
              </Button>
            )}
            <Button fullWidth variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
