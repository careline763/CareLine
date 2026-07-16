import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareWarning, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

type ComplaintStatus = 'open' | 'investigating' | 'resolved' | 'refunded';

interface Complaint {
  id: number; booking_id: number; type: string;
  description: string; status: ComplaintStatus;
  resolution?: string; refund_amount?: number;
  created_at: string;
}

const STATUS = {
  open:          { icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-100',    label: 'Open' },
  investigating: { icon: Clock,         color: 'text-amber-500 bg-amber-50 border-amber-100', label: 'Investigating' },
  resolved:      { icon: CheckCircle,   color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Resolved' },
  refunded:      { icon: CheckCircle,   color: 'text-purple-600 bg-purple-50 border-purple-100', label: 'Refunded' },
};

const MOCK: Complaint[] = [
  { id: 1, booking_id: 1802, type: 'Service Quality', description: 'The car was not cleaned properly. Windows still dirty.', status: 'investigating', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 2, booking_id: 1780, type: 'Partner Behaviour', description: 'Partner was rude and did not follow instructions.', status: 'resolved', resolution: 'We have warned the partner and issued goodwill credit.', created_at: new Date(Date.now() - 259200000).toISOString() },
];

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => { setComplaints(MOCK); setLoading(false); }, 300); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track complaint status and resolutions</p>
        </div>
        <Link to="/complaints/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquareWarning size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No complaints filed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map(c => {
            const { icon: Icon, color, label } = STATUS[c.status];
            return (
              <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{c.type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Booking #{c.booking_id} · {new Date(c.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${color}`}>
                    <Icon size={11} />
                    {label}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                {c.resolution && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-emerald-700 mb-1">Resolution</p>
                    <p className="text-xs text-emerald-600">{c.resolution}</p>
                  </div>
                )}
                {c.refund_amount && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
                    <CheckCircle size={12} /> ₹{c.refund_amount} refunded to wallet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
