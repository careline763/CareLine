import { useEffect, useState } from 'react';
import { Eye, CheckCircle, RefreshCw, AlertTriangle, Search } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { Complaint, ComplaintStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUS_COLOR: Record<ComplaintStatus, string> = {
  open: 'red', investigating: 'yellow', resolved: 'green', refunded: 'purple',
};

const TYPE_LABEL: Record<string, string> = {
  service_quality: 'Service Quality', partner_behaviour: 'Partner Behaviour',
  billing: 'Billing', other: 'Other',
};

const MOCK: Complaint[] = [
  { id: 1, booking_id: 1802, user_id: 3, type: 'service_quality', description: 'The car was not cleaned properly. Windows still dirty and there were streaks on the hood.', status: 'open', created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date(Date.now() - 7200000).toISOString(), user: { id: 3, name: 'Anjali Singh', phone: '9988776655', role: 'customer', created_at: '' }, booking: { id: 1802, user_id: 3, vehicle_id: 1, plan_id: 2, address: 'Flat 5, Sea View, Bandra West', pincode: '400050', scheduled_at: new Date(Date.now() - 86400000).toISOString(), status: 'completed', total_amount: 799, created_at: '' } },
  { id: 2, booking_id: 1795, user_id: 1, type: 'billing', description: 'I was charged ₹1499 but the plan clearly shows ₹1299. Requesting a refund of the difference.', status: 'investigating', created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 3600000).toISOString(), user: { id: 1, name: 'Priya Sharma', phone: '9876543210', role: 'customer', created_at: '' }, booking: { id: 1795, user_id: 1, vehicle_id: 2, plan_id: 3, address: 'B-204, Sunrise Apartments', pincode: '400053', scheduled_at: new Date(Date.now() - 172800000).toISOString(), status: 'completed', total_amount: 1499, created_at: '' } },
  { id: 3, booking_id: 1780, user_id: 2, type: 'partner_behaviour', description: 'Partner was rude and did not listen to instructions about not touching the dashboard ornaments.', status: 'resolved', resolution: 'We have warned the partner and issued a ₹100 goodwill credit.', created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date(Date.now() - 172800000).toISOString(), user: { id: 2, name: 'Rahul Verma', phone: '9123456789', role: 'customer', created_at: '' }, booking: { id: 1780, user_id: 2, vehicle_id: 3, plan_id: 1, address: 'C-12, Veera Desai Road', pincode: '400053', scheduled_at: new Date(Date.now() - 345600000).toISOString(), status: 'completed', total_amount: 249, created_at: '' } },
  { id: 4, booking_id: 1760, user_id: 4, type: 'billing', description: 'Duplicate charge on my account. Two payments deducted for the same booking.', status: 'refunded', resolution: 'Verified duplicate charge. Full refund processed.', refund_amount: 1499, created_at: new Date(Date.now() - 604800000).toISOString(), updated_at: new Date(Date.now() - 518400000).toISOString(), user: { id: 4, name: 'Amit Patel', phone: '9765432100', role: 'customer', created_at: '' }, booking: { id: 1760, user_id: 4, vehicle_id: 4, plan_id: 3, address: 'D-7, Lokhandwala', pincode: '400053', scheduled_at: new Date(Date.now() - 691200000).toISOString(), status: 'completed', total_amount: 1499, created_at: '' } },
];

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ComplaintStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [resolveForm, setResolveForm] = useState({ status: 'investigating' as ComplaintStatus, resolution: '', refund_amount: '' });
  const [resolving, setResolving] = useState(false);

  useEffect(() => { setTimeout(() => { setComplaints(MOCK); setLoading(false); }, 300); }, []);

  const filtered = complaints.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter;
    const matchSearch = c.user?.name?.toLowerCase().includes(search.toLowerCase()) || String(c.booking_id).includes(search);
    return matchStatus && matchSearch;
  });

  const stats = {
    open: complaints.filter(c => c.status === 'open').length,
    investigating: complaints.filter(c => c.status === 'investigating').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    refunded: complaints.filter(c => c.status === 'refunded').length,
  };

  const handleResolve = async () => {
    if (!selected) return;
    setResolving(true);
    await new Promise(r => setTimeout(r, 600));
    setComplaints(prev => prev.map(c =>
      c.id === selected.id ? {
        ...c, status: resolveForm.status,
        resolution: resolveForm.resolution || undefined,
        refund_amount: resolveForm.refund_amount ? Number(resolveForm.refund_amount) : undefined,
      } : c
    ));
    toast.success('Complaint updated');
    setSelected(null);
    setResolving(false);
  };

  const openResolve = (c: Complaint) => {
    setSelected(c);
    setResolveForm({ status: c.status, resolution: c.resolution ?? '', refund_amount: String(c.refund_amount ?? '') });
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Complaints</h1>
        <p className="text-sm text-gray-500 mt-1">Review and resolve customer complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open', count: stats.open, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Investigating', count: stats.investigating, icon: RefreshCw, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Resolved', count: stats.resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Refunded', count: stats.refunded, icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or booking #" className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'open', 'investigating', 'resolved', 'refunded'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === s ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? <div className="p-8"><Loader /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Customer', 'Type', 'Booking', 'Status', 'Filed', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{c.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{c.user?.name}</p>
                    <p className="text-xs text-gray-400">{c.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{TYPE_LABEL[c.type]}</td>
                  <td className="px-4 py-3 text-gray-600">#{c.booking_id}</td>
                  <td className="px-4 py-3">
                    <Badge label={c.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openResolve(c)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-500">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resolve Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Complaint #${selected?.id} — ${TYPE_LABEL[selected?.type ?? 'other']}`}>
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-semibold text-gray-700 mb-1">Customer:</p>
              <p className="text-gray-600">{selected.user?.name} · {selected.user?.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-semibold text-gray-700 mb-1">Description:</p>
              <p className="text-gray-600 leading-relaxed">{selected.description}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Update Status</label>
              <select value={resolveForm.status} onChange={e => setResolveForm(f => ({ ...f, status: e.target.value as ComplaintStatus }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Resolution Note</label>
              <textarea value={resolveForm.resolution} onChange={e => setResolveForm(f => ({ ...f, resolution: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Describe the resolution or next steps..." />
            </div>
            {(resolveForm.status === 'refunded') && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Refund Amount (₹)</label>
                <input type="number" value={resolveForm.refund_amount} onChange={e => setResolveForm(f => ({ ...f, refund_amount: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. 500" />
              </div>
            )}
            <Button fullWidth onClick={handleResolve} loading={resolving}>Save Changes</Button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
