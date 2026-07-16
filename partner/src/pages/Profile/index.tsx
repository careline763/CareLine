import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, LogOut, ChevronRight, Star, Car, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import AppShell from '../../components/layout/AppShell';
import { useAuthStore } from '../../store/authStore';

const TIER_CONFIG = {
  Platinum: { color: 'text-sky-500',    bg: 'bg-sky-50 border-sky-200',       bar: 'bg-sky-400',    label: '🏆 Platinum' },
  Gold:     { color: 'text-amber-500',  bg: 'bg-amber-50 border-amber-200',   bar: 'bg-amber-400',  label: '🥇 Gold' },
  Silver:   { color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200',     bar: 'bg-gray-400',   label: '🥈 Silver' },
  Bronze:   { color: 'text-orange-400', bg: 'bg-orange-50 border-orange-200', bar: 'bg-orange-400', label: '🥉 Bronze' },
};

function getTier(score: number): keyof typeof TIER_CONFIG {
  if (score >= 85) return 'Platinum';
  if (score >= 70) return 'Gold';
  if (score >= 50) return 'Silver';
  return 'Bronze';
}

export default function Profile() {
  const { user, partner, logout } = useAuthStore();
  const navigate = useNavigate();
  const [available, setAvailable] = useState(partner?.is_available ?? true);
  const [toggling, setToggling] = useState(false);

  const toggleAvailability = async () => {
    setToggling(true);
    await new Promise(r => setTimeout(r, 400));
    setAvailable(prev => !prev);
    toast.success(available ? 'You are now Offline' : 'You are now Online');
    setToggling(false);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'P';
  const verified = partner?.verified ?? false;
  const score = 72;
  const tier = getTier(score);
  const cfg = TIER_CONFIG[tier];

  return (
    <AppShell title="My Profile">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-10">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 rounded-3xl px-5 py-6 md:px-8 md:py-8 text-center md:text-left overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative md:flex md:items-center md:gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white mx-auto md:mx-0 mb-3 md:mb-0 ring-4 ring-white/30 flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">{user?.name ?? 'Partner'}</h1>
              <p className="text-sky-100 text-sm mt-0.5">+91 {user?.phone ?? '—'}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                {verified
                  ? <><ShieldCheck size={13} className="text-emerald-300" /><span className="text-xs text-emerald-300 font-bold">Verified Partner</span></>
                  : <><ShieldAlert size={13} className="text-amber-300" /><span className="text-xs text-amber-300 font-bold">Pending Verification</span></>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Availability toggle */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${available ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Availability</p>
                  <p className="text-xs text-gray-400 mt-0.5">{available ? 'Receiving new jobs' : 'Currently offline'}</p>
                </div>
              </div>
              <button
                onClick={toggleAvailability}
                disabled={toggling}
                className={`relative w-13 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${available ? 'bg-emerald-500 focus:ring-emerald-300' : 'bg-gray-200 focus:ring-gray-300'}`}
                style={{ width: 52 }}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${available ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Car,        label: 'Jobs Done',  value: partner?.total_jobs ?? 0,              color: 'text-sky-500',   bg: 'bg-sky-50' },
                { icon: Star,       label: 'Rating',     value: partner?.rating?.toFixed(1) ?? '—',    color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: ShieldCheck,label: 'Status',     value: partner?.status ?? 'active',           color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={17} className={color} />
                  </div>
                  <p className="text-base font-extrabold text-gray-900 capitalize">{value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Quality score */}
            <div className={`bg-white rounded-2xl border shadow-sm p-4 ${cfg.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className={cfg.color} />
                  <p className="font-bold text-gray-900">Quality Score</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/70 ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className={`text-4xl font-extrabold ${cfg.color}`}>{score}</span>
                <span className="text-gray-400 text-sm mb-1">/ 100</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">Score updates after each completed job</p>
            </div>
          </div>

          {/* Side column */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Menu */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => navigate('/verification')}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={17} className="text-sky-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Documents & Verification</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 border border-red-100 rounded-2xl px-4 py-4 flex items-center gap-3 hover:bg-red-100 active:bg-red-100 transition-colors"
            >
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                <LogOut size={17} className="text-red-500" />
              </div>
              <span className="text-sm font-bold text-red-500">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
