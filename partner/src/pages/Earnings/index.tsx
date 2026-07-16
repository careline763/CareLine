import { useEffect, useState } from 'react';
import { TrendingUp, IndianRupee, Briefcase, Star, ArrowUpRight } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Loader from '../../components/common/Loader';
import type { EarningDay } from '../../types';

const MOCK_DAYS: EarningDay[] = [
  { date: '2026-06-24', jobs: 4, amount: 1996 },
  { date: '2026-06-23', jobs: 5, amount: 2495 },
  { date: '2026-06-22', jobs: 3, amount: 1497 },
  { date: '2026-06-21', jobs: 6, amount: 2994 },
  { date: '2026-06-20', jobs: 4, amount: 1996 },
  { date: '2026-06-19', jobs: 5, amount: 2495 },
  { date: '2026-06-18', jobs: 3, amount: 1497 },
];

function fmt(date: string) {
  const d = new Date(date + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function Earnings() {
  const [days, setDays] = useState<EarningDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => { setDays(MOCK_DAYS); setLoading(false); }, 400); }, []);

  const todayEarnings = days[0]?.amount ?? 0;
  const weeklyTotal = days.reduce((s, d) => s + d.amount, 0);
  const totalJobs = days.reduce((s, d) => s + d.jobs, 0);
  const avg = totalJobs > 0 ? Math.round(weeklyTotal / totalJobs) : 0;
  const maxAmount = Math.max(...days.map(d => d.amount), 1);

  return (
    <AppShell title="Earnings">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-10 space-y-5">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl px-5 py-6 md:px-8 md:py-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">Today's Earnings</p>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-emerald-200 text-xl font-bold self-start mt-1">₹</span>
            <span className="text-5xl font-extrabold text-white tracking-tight">{todayEarnings.toLocaleString('en-IN')}</span>
            <span className="flex items-center gap-0.5 text-xs text-emerald-200 font-semibold mb-1 ml-1">
              <ArrowUpRight size={12} /> Today
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 md:max-w-lg">
            {[
              { icon: TrendingUp, label: '7-Day Total', value: `₹${weeklyTotal.toLocaleString('en-IN')}` },
              { icon: Briefcase,  label: 'Total Jobs',  value: totalJobs },
              { icon: Star,       label: 'Avg / Job',   value: `₹${avg}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/15 backdrop-blur rounded-2xl p-3 md:p-4 text-center">
                <Icon size={14} className="text-emerald-100 mx-auto mb-1" />
                <p className="text-base md:text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] md:text-xs text-emerald-100 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 items-start">
          {/* Bar chart card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Last 7 Days</p>
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {[...days].reverse().map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: 96 }}>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-700"
                      style={{ height: `${(d.amount / maxAmount) * 96}px`, minHeight: 4 }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 truncate w-full text-center font-medium">
                    {fmt(d.date).slice(0, 3)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily breakdown */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Daily Breakdown</p>
            {loading ? (
              <div className="flex justify-center py-8"><Loader /></div>
            ) : (
              <>
                {/* Mobile: card list */}
                <div className="space-y-2 md:hidden">
                  {days.map((d, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <IndianRupee size={16} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{fmt(d.date)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{d.jobs} job{d.jobs !== 1 ? 's' : ''} completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-gray-900">₹{d.amount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-emerald-500 font-semibold">₹{d.jobs > 0 ? Math.round(d.amount / d.jobs) : 0}/job</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: table */}
                <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Day</th>
                        <th className="text-left font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Jobs</th>
                        <th className="text-right font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Avg / Job</th>
                        <th className="text-right font-semibold text-gray-400 text-xs uppercase tracking-wider px-4 py-3">Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((d, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-gray-900">{fmt(d.date)}</td>
                          <td className="px-4 py-3.5 text-gray-500">{d.jobs} job{d.jobs !== 1 ? 's' : ''}</td>
                          <td className="px-4 py-3.5 text-right text-emerald-600 font-semibold">₹{d.jobs > 0 ? Math.round(d.amount / d.jobs) : 0}</td>
                          <td className="px-4 py-3.5 text-right font-extrabold text-gray-900">₹{d.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
