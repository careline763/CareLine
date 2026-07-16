import { useEffect, useState } from 'react';
import { Users, CalendarCheck, DollarSign, Bell, UserCheck, AlertCircle, TrendingUp, Car } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/ui/StatCard';
import Loader from '../../components/ui/Loader';
import type { DashboardStats } from '../../types';

const MOCK: DashboardStats = {
  totalBookings: 1842, todayBookings: 34, totalRevenue: 2748500, monthRevenue: 312400,
  activeSubscriptions: 287, totalPartners: 64, pendingPartners: 8, totalCustomers: 1130,
  revenueByDay: [
    {date:'Jun 18',amount:9800},{date:'Jun 19',amount:14200},{date:'Jun 20',amount:11500},
    {date:'Jun 21',amount:18900},{date:'Jun 22',amount:13400},{date:'Jun 23',amount:21000},{date:'Jun 24',amount:16200},
  ],
  bookingsByStatus: [
    {status:'completed',count:1102},{status:'confirmed',count:312},{status:'assigned',count:198},
    {status:'cancelled',count:130},{status:'pending_payment',count:100},
  ],
};

const PIE_COLORS = ['#10b981','#6366f1','#8b5cf6','#ef4444','#f59e0b'];

const RECENT_BOOKINGS = [
  {id:1842,customer:'Priya Sharma',amount:1499,status:'assigned',time:'10 min ago'},
  {id:1841,customer:'Rahul Verma',amount:249,status:'completed',time:'22 min ago'},
  {id:1840,customer:'Anjali Singh',amount:799,status:'confirmed',time:'45 min ago'},
  {id:1839,customer:'Amit Patel',amount:1499,status:'en_route',time:'1 hr ago'},
  {id:1838,customer:'Neha Gupta',amount:249,status:'completed',time:'2 hr ago'},
];

const STATUS_DOT: Record<string,string> = {
  completed:'bg-emerald-500',confirmed:'bg-blue-500',assigned:'bg-indigo-500',
  en_route:'bg-purple-500',cancelled:'bg-red-500',pending_payment:'bg-yellow-500',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => { setTimeout(() => setStats(MOCK), 400); }, []);

  if (!stats) return <AdminLayout title="Dashboard"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<CalendarCheck size={18}/>} change="+12%" color="indigo"/>
        <StatCard title="Today's Bookings" value={stats.todayBookings} icon={<Car size={18}/>} change="+5%" color="blue"/>
        <StatCard title="Monthly Revenue" value={`₹${(stats.monthRevenue/1000).toFixed(0)}k`} icon={<DollarSign size={18}/>} change="+8%" color="emerald"/>
        <StatCard title="Active Subscriptions" value={stats.activeSubscriptions} icon={<Bell size={18}/>} change="+3%" color="purple"/>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={<Users size={18}/>} color="blue"/>
        <StatCard title="Total Partners" value={stats.totalPartners} icon={<UserCheck size={18}/>} color="emerald"/>
        <StatCard title="Pending Verifications" value={stats.pendingPartners} icon={<AlertCircle size={18}/>} color="amber"/>
        <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue/100000).toFixed(1)}L`} icon={<TrendingUp size={18}/>} color="indigo"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Revenue – Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.revenueByDay}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="date" tick={{fontSize:11}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString('en-IN')}`, 'Revenue']}/>
              <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="url(#rev)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Bookings by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.bookingsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {stats.bookingsByStatus.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Legend formatter={(v:string)=>v.replace(/_/g,' ')} iconSize={8} wrapperStyle={{fontSize:11}}/>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
          <a href="/bookings" className="text-xs text-indigo-600 hover:underline font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-medium">ID</th>
                <th className="text-left pb-2 font-medium">Customer</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">Status</th>
                <th className="text-left pb-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map(b => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-400 font-mono">#{b.id}</td>
                  <td className="py-2.5 font-medium text-gray-900">{b.customer}</td>
                  <td className="py-2.5 text-gray-700">₹{b.amount}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}/>
                      <span className="capitalize text-xs text-gray-600">{b.status.replace(/_/g,' ')}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
