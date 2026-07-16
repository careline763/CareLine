import { useEffect, useState } from 'react';
import { FileText, Download, CheckCircle, Clock, Send } from 'lucide-react';
import FleetLayout from '../../components/FleetLayout';
import toast from 'react-hot-toast';

interface Invoice {
  id: number; period_start: string; period_end: string;
  total_amount: number; booking_count: number;
  status: 'draft' | 'sent' | 'paid';
  created_at: string;
}

const MOCK: Invoice[] = [
  { id:1, period_start:'2026-06-01', period_end:'2026-06-30', total_amount:62400, booking_count:31, status:'draft', created_at:'2026-06-24' },
  { id:2, period_start:'2026-05-01', period_end:'2026-05-31', total_amount:57800, booking_count:28, status:'paid', created_at:'2026-05-31' },
  { id:3, period_start:'2026-04-01', period_end:'2026-04-30', total_amount:49200, booking_count:24, status:'paid', created_at:'2026-04-30' },
  { id:4, period_start:'2026-03-01', period_end:'2026-03-31', total_amount:44600, booking_count:22, status:'paid', created_at:'2026-03-31' },
];

const STATUS_META: Record<string, { icon: typeof Clock; label: string; color: string; bg: string }> = {
  draft: { icon: Clock, label: 'Draft', color: 'text-amber-700', bg: 'bg-amber-50' },
  sent:  { icon: Send, label: 'Sent', color: 'text-sky-700', bg: 'bg-sky-50' },
  paid:  { icon: CheckCircle, label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-50' },
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => { setInvoices(MOCK); setLoading(false); }, 400); }, []);

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);
  const totalDue  = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total_amount, 0);

  const formatPeriod = (start: string, end: string) => {
    const s = new Date(start); const e = new Date(end);
    return `${s.toLocaleDateString('en-IN',{month:'short',year:'numeric'})} – ${e.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`;
  };

  return (
    <FleetLayout title="Invoices">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-1">Total Paid (All Time)</p>
          <p className="text-2xl font-bold text-emerald-600">₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-1">Pending / Due</p>
          <p className="text-2xl font-bold text-amber-600">₹{totalDue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => {
            const meta = STATUS_META[inv.status];
            const Icon = meta.icon;
            return (
              <div key={inv.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <FileText size={16} className="text-slate-500"/>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Invoice #{inv.id}</p>
                      <p className="text-xs text-gray-400">{formatPeriod(inv.period_start, inv.period_end)}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${meta.bg} ${meta.color}`}>
                    <Icon size={11}/>{meta.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm border-t border-gray-50 pt-3">
                  <div>
                    <p className="text-xs text-gray-400">Bookings</p>
                    <p className="font-semibold text-gray-900">{inv.booking_count}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{inv.total_amount.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => toast.success(`Invoice #${inv.id} downloading…`)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Download size={12}/> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FleetLayout>
  );
}
