import { useEffect, useState } from 'react';
import { CalendarCheck, Search, Plus, Car, MapPin } from 'lucide-react';
import FleetLayout from '../../components/FleetLayout';
import toast from 'react-hot-toast';

interface FleetBooking {
  id: number; vehicle: string; vehicleType: string;
  address: string; scheduled_at: string;
  status: string; amount: number; partner?: string;
}

const MOCK: FleetBooking[] = [
  { id:201, vehicle:'Toyota Fortuner (DL 01 AB 1234)', vehicleType:'SUV', address:'Connaught Place, New Delhi', scheduled_at:'2026-06-24T07:00', status:'completed', amount:899, partner:'Rajan Kumar' },
  { id:202, vehicle:'Honda City (DL 02 CD 5678)', vehicleType:'Sedan', address:'Karol Bagh, New Delhi', scheduled_at:'2026-06-24T08:00', status:'en_route', amount:649, partner:'Suresh Verma' },
  { id:203, vehicle:'Hyundai Creta (DL 03 EF 9012)', vehicleType:'SUV', address:'Lajpat Nagar, New Delhi', scheduled_at:'2026-06-25T09:00', status:'confirmed', amount:899 },
  { id:204, vehicle:'Maruti Swift (DL 04 GH 3456)', vehicleType:'Hatchback', address:'Dwarka, New Delhi', scheduled_at:'2026-06-23T10:00', status:'completed', amount:449, partner:'Manoj Singh' },
  { id:205, vehicle:'Tata Nexon (DL 05 IJ 7890)', vehicleType:'Sedan', address:'Vasant Kunj, New Delhi', scheduled_at:'2026-06-26T07:00', status:'confirmed', amount:649 },
];

const STATUS_BADGE: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  en_route:  'bg-blue-50 text-blue-700',
  confirmed: 'bg-amber-50 text-amber-700',
  started:   'bg-indigo-50 text-indigo-700',
  cancelled: 'bg-red-50 text-red-600',
};

export default function Bookings() {
  const [bookings, setBookings] = useState<FleetBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { setTimeout(() => { setBookings(MOCK); setLoading(false); }, 400); }, []);

  const filtered = bookings.filter(b => {
    const ms = !search || b.vehicle.toLowerCase().includes(search.toLowerCase()) || b.address.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' || b.status === filter;
    return ms && mf;
  });

  const totalAmount = filtered.reduce((s, b) => s + b.amount, 0);

  return (
    <FleetLayout title="Fleet Bookings">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by vehicle or location…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white">
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="en_route">En Route</option>
          <option value="started">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={() => toast.info('Book via Customer App')}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus size={15}/> New Booking
        </button>
      </div>

      {filtered.length > 0 && (
        <div className="text-xs text-gray-400 mb-3 font-medium">
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''} · Total ₹{totalAmount.toLocaleString('en-IN')}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Car size={16} className="text-slate-500"/>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.vehicle}</p>
                    <p className="text-xs text-gray-400">{b.vehicleType}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ${STATUS_BADGE[b.status] ?? 'bg-gray-50 text-gray-500'}`}>
                  {b.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={11}/>{b.address}</span>
                <span className="ml-auto flex items-center gap-1"><CalendarCheck size={11}/>{new Date(b.scheduled_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</span>
              </div>
              {b.partner && (
                <p className="text-xs text-gray-400 mt-1.5">Partner: <span className="font-medium text-gray-700">{b.partner}</span></p>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">Booking #{b.id}</span>
                <span className="text-sm font-bold text-gray-900">₹{b.amount}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center gap-3 text-gray-400">
              <CalendarCheck size={36} className="opacity-30"/>
              <p className="text-sm">No bookings match your filter</p>
            </div>
          )}
        </div>
      )}
    </FleetLayout>
  );
}
