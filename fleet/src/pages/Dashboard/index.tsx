import { useEffect, useState } from 'react';
import { Car, CalendarCheck, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import FleetLayout from '../../components/FleetLayout';
import { useAuthStore } from '../../store/authStore';

interface Stats {
  vehicles: number; totalBookings: number; pendingInvoices: number;
  monthSpend: number; activeBookings: number; completedThisMonth: number;
}

const MOCK_STATS: Stats = {
  vehicles: 28, totalBookings: 142, pendingInvoices: 2,
  monthSpend: 62400, activeBookings: 3, completedThisMonth: 31,
};

const RECENT_BOOKINGS = [
  { id: 201, vehicle: 'DL 01 AB 1234 (SUV)', status: 'completed', date: '2026-06-24', amount: 899 },
  { id: 202, vehicle: 'DL 02 CD 5678 (Sedan)', status: 'en_route', date: '2026-06-24', amount: 649 },
  { id: 203, vehicle: 'DL 03 EF 9012 (Hatchback)', status: 'confirmed', date: '2026-06-25', amount: 449 },
  { id: 204, vehicle: 'DL 04 GH 3456 (SUV)', status: 'completed', date: '2026-06-23', amount: 899 },
];

const STATUS_BADGE: Record<string, string> = {
  completed:  'bg-emerald-50 text-emerald-700',
  en_route:   'bg-blue-50 text-blue-700',
  confirmed:  'bg-amber-50 text-amber-700',
  started:    'bg-indigo-50 text-indigo-700',
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => { setTimeout(() => setStats(MOCK_STATS), 300); }, []);

  return (
    <FleetLayout title="Dashboard">
      <p className="text-sm text-gray-500 mb-6">Welcome back, <span className="font-semibold text-gray-900">{user?.name ?? 'Fleet Manager'}</span></p>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Car, label: 'Fleet Vehicles', value: stats.vehicles, color: 'text-indigo-600 bg-indigo-50' },
            { icon: CalendarCheck, label: 'Total Bookings', value: stats.totalBookings, color: 'text-sky-600 bg-sky-50' },
            { icon: CheckCircle, label: 'Done This Month', value: stats.completedThisMonth, color: 'text-emerald-600 bg-emerald-50' },
            { icon: Clock, label: 'Active Now', value: stats.activeBookings, color: 'text-amber-600 bg-amber-50' },
            { icon: FileText, label: 'Pending Invoices', value: stats.pendingInvoices, color: 'text-red-600 bg-red-50' },
            { icon: TrendingUp, label: 'Month Spend', value: `₹${stats.monthSpend.toLocaleString('en-IN')}`, color: 'text-violet-600 bg-violet-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18}/></div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_BOOKINGS.map(b => (
            <div key={b.id} className="px-5 py-3.5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{b.vehicle}</p>
                <p className="text-xs text-gray-400">{b.date}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_BADGE[b.status] ?? 'bg-gray-50 text-gray-500'}`}>
                {b.status.replace('_', ' ')}
              </span>
              <span className="text-sm font-semibold text-gray-800">₹{b.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </FleetLayout>
  );
}
