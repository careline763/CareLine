import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Car, ChevronRight, Calendar, Zap, TrendingUp } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { useAuthStore } from '../../store/authStore';
import type { Job } from '../../types';

type Tab = 'today' | 'upcoming' | 'completed';

const MOCK_JOBS: Job[] = [
  {
    id: 1842, user_id: 1, address: 'B-204, Sunrise Apartments, Andheri West', pincode: '400053',
    scheduled_at: new Date(Date.now() + 3600000).toISOString(), status: 'assigned', total_amount: 1499,
    customer: { name: 'Priya Sharma', phone: '9876543210' },
    vehicle: { type: 'sedan', model: 'Honda City', plate_number: 'MH02AB1234' },
    plan: { id: 3, name: 'Monthly Pro', type: 'monthly', includes_json: ['Exterior wash', 'Dashboard polish'] },
  },
  {
    id: 1843, user_id: 2, address: 'C-12, Veera Desai Road, Andheri West', pincode: '400053',
    scheduled_at: new Date(Date.now() + 7200000).toISOString(), status: 'confirmed', total_amount: 249,
    customer: { name: 'Rahul Verma', phone: '9123456789' },
    vehicle: { type: 'suv', model: 'Hyundai Creta', plate_number: 'MH02CD5678' },
    plan: { id: 1, name: 'One-Time Wash', type: 'one_time', includes_json: ['Exterior wash'] },
  },
  {
    id: 1840, user_id: 3, address: 'Flat 5, Sea View, Bandra West', pincode: '400050',
    scheduled_at: new Date(Date.now() + 86400000 + 3600000).toISOString(), status: 'assigned', total_amount: 799,
    customer: { name: 'Anjali Singh', phone: '9988776655' },
    vehicle: { type: 'hatchback', model: 'Maruti Swift', plate_number: 'MH02EF9012' },
    plan: { id: 2, name: 'Weekly Plan', type: 'weekly', includes_json: ['Exterior wash', 'Tyre dressing'] },
  },
  {
    id: 1835, user_id: 4, address: 'D-7, Lokhandwala, Andheri West', pincode: '400053',
    scheduled_at: new Date(Date.now() - 86400000).toISOString(), status: 'completed', total_amount: 1499,
    customer: { name: 'Amit Patel', phone: '9765432100' },
    vehicle: { type: 'suv', model: 'Tata Nexon', plate_number: 'MH02GH3456' },
    plan: { id: 3, name: 'Monthly Pro', type: 'monthly', includes_json: ['Exterior wash', 'Interior vacuum'] },
  },
];

function isToday(date: string) {
  const d = new Date(date), t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}
function isFuture(date: string) { return new Date(date) > new Date() && !isToday(date); }

const STATUS_ACCENT: Record<string, string> = {
  confirmed: 'border-l-blue-400', assigned: 'border-l-indigo-400',
  en_route: 'border-l-violet-400', started: 'border-l-amber-400',
  completed: 'border-l-emerald-400', cancelled: 'border-l-red-300',
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('today');
  const { user } = useAuthStore();

  useEffect(() => { setTimeout(() => { setJobs(MOCK_JOBS); setLoading(false); }, 400); }, []);

  const filtered = jobs.filter(j => {
    if (tab === 'today') return isToday(j.scheduled_at) || j.status === 'en_route' || j.status === 'started';
    if (tab === 'upcoming') return isFuture(j.scheduled_at) && j.status !== 'completed' && j.status !== 'cancelled';
    return j.status === 'completed' || j.status === 'cancelled';
  });

  const activeJob = jobs.find(j => j.status === 'en_route' || j.status === 'started');
  const todayCount = jobs.filter(j => isToday(j.scheduled_at)).length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const earned = jobs.filter(j => j.status === 'completed').reduce((s, j) => s + j.total_amount, 0);

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell title="Dashboard">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-10 space-y-5">
        {/* Greeting + stats */}
        <div className="relative bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 rounded-3xl px-5 py-6 md:px-8 md:py-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-4 right-4 w-40 h-40 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-300 blur-2xl" />
          </div>
          <p className="text-sky-100 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
            {user?.name?.split(' ')[0] ?? 'Partner'} 👋
          </h1>

          <div className="flex gap-3 mt-5 md:max-w-lg">
            {[
              { icon: Calendar, label: "Today's Jobs", value: todayCount },
              { icon: TrendingUp, label: 'Completed', value: completedCount },
              { icon: Zap, label: 'Earned', value: `₹${earned.toLocaleString('en-IN')}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex-1 bg-white/15 backdrop-blur rounded-2xl p-3 md:p-4 text-center">
                <Icon size={14} className="text-sky-100 mx-auto mb-1" />
                <p className="text-base md:text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] md:text-xs text-sky-100 leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active job banner */}
        {activeJob && (
          <Link to={`/jobs/${activeJob.id}`}
            className="block bg-amber-400 rounded-2xl p-4 shadow-lg shadow-amber-200/60">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Active Job</p>
                </div>
                <p className="font-bold text-amber-950 text-base">{activeJob.customer?.name ?? '—'}</p>
                <p className="text-xs text-amber-800 mt-0.5">{activeJob.address?.split(',')[0]}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={activeJob.status} />
                <ChevronRight size={18} className="text-amber-800" />
              </div>
            </div>
          </Link>
        )}

        {/* Tabs */}
        <div className="inline-flex w-full sm:w-auto bg-white rounded-2xl p-1.5 gap-1 shadow-sm border border-gray-100">
          {(['today', 'upcoming', 'completed'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 sm:flex-none sm:px-6 py-2.5 text-xs font-bold rounded-xl capitalize transition-all ${
                tab === t
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Job list */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No {tab} jobs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className={`block bg-white rounded-2xl border-l-4 ${STATUS_ACCENT[job.status] ?? 'border-l-gray-200'} shadow-sm border border-gray-100 overflow-hidden hover:shadow-md active:scale-[0.99] transition-all`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <StatusBadge status={job.status} />
                        <span className="text-xs text-gray-300 font-mono">#{job.id}</span>
                      </div>
                      <p className="font-bold text-gray-900 text-base">{job.customer?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{job.plan.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sky-600 text-lg">₹{job.total_amount.toLocaleString('en-IN')}</p>
                      <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Car size={12} className="text-sky-400 flex-shrink-0" />
                      <span>{job.vehicle.model} · <span className="font-mono">{job.vehicle.plate_number}</span></span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <MapPin size={12} className="text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{job.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={12} className="text-sky-400 flex-shrink-0" />
                      <span>{new Date(job.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
