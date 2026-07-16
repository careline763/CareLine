import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Phone, Camera, CheckCircle, Navigation, Radio, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AppShell from '../../components/layout/AppShell';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { useGPS } from '../../hooks/useGPS';
import type { Job, JobStatus } from '../../types';

const MOCK: Job = {
  id: 1842, user_id: 1, address: 'B-204, Sunrise Apartments, Andheri West', pincode: '400053',
  scheduled_at: new Date(Date.now() + 3600000).toISOString(), status: 'assigned', total_amount: 1499,
  customer: { name: 'Priya Sharma', phone: '9876543210' },
  vehicle: { type: 'sedan', model: 'Honda City', plate_number: 'MH02AB1234' },
  plan: { id: 3, name: 'Monthly Pro', type: 'monthly', includes_json: ['Exterior wash', 'Tyre dressing', 'Dashboard polish', 'Window cleaning'] },
};

const STATUS_FLOW: Record<JobStatus, { next: JobStatus | null; label: string; gradient: string }> = {
  confirmed:  { next: 'assigned',  label: 'Acknowledge Job',      gradient: 'from-blue-500 to-blue-600' },
  assigned:   { next: 'en_route',  label: '🚗  Start Journey',    gradient: 'from-indigo-500 to-indigo-600' },
  en_route:   { next: 'started',   label: '📍  Arrived — Start Wash', gradient: 'from-amber-500 to-orange-500' },
  started:    { next: 'completed', label: '✅  Mark as Completed', gradient: 'from-emerald-500 to-emerald-600' },
  completed:  { next: null,        label: 'Completed',            gradient: 'from-gray-400 to-gray-500' },
  cancelled:  { next: null,        label: 'Cancelled',            gradient: 'from-gray-400 to-gray-500' },
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const gpsActive = job?.status === 'en_route' || job?.status === 'started';
  useGPS(job?.id ?? null, gpsActive);

  useEffect(() => {
    setTimeout(() => { setJob({ ...MOCK, id: Number(id) }); setLoading(false); }, 400);
  }, [id]);

  const handlePhoto = async (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (type === 'before') setBeforePhoto(ev.target?.result as string);
      else setAfterPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    try {
      const fd = new FormData();
      fd.append(type === 'before' ? 'before_photo' : 'after_photo', file);
      const { data } = await (await import('../../services/api')).default.post(
        `/uploads/booking/${job!.id}/photos`, fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Photo uploaded');
      if (type === 'before' && data.data?.before_photo_url) setBeforePhoto(data.data.before_photo_url);
      if (type === 'after' && data.data?.after_photo_url) setAfterPhoto(data.data.after_photo_url);
    } catch { toast.error('Photo upload failed'); }
  };

  const advance = async () => {
    if (!job) return;
    const flow = STATUS_FLOW[job.status];
    if (!flow.next) return;
    if (flow.next === 'completed' && !afterPhoto) { toast.error('Upload after photo before completing'); return; }
    setUpdating(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setJob(prev => prev ? { ...prev, status: flow.next! } : prev);
      toast.success('Status updated!');
      if (flow.next === 'completed') { toast.success('Job completed! Great work. 🎉'); setTimeout(() => navigate('/jobs'), 1200); }
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(false); }
  };

  if (loading) return <AppShell title="Job Detail" back><div className="mt-20"><Loader /></div></AppShell>;
  if (!job) return <AppShell title="Job Detail" back><p className="text-center mt-20 text-gray-400">Job not found</p></AppShell>;

  const flow = STATUS_FLOW[job.status];

  return (
    <AppShell title={`Job #${job.id}`} back>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer card */}
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-4 border border-sky-100">
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider mb-2">Customer</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-base">
                  {job.customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{job.customer.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">+91 {job.customer.phone}</p>
                </div>
              </div>
              <a
                href={`tel:+91${job.customer.phone}`}
                className="flex items-center gap-1.5 bg-sky-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm shadow-sky-200"
              >
                <Phone size={13} /> Call
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Car size={22} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{job.vehicle.model}</p>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{job.vehicle.plate_number} · <span className="capitalize">{job.vehicle.type}</span></p>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-sky-500" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {new Date(job.scheduled_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Location</p>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-sky-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 leading-snug">{job.address}</p>
                <p className="text-xs text-gray-400 mt-0.5">Pincode {job.pincode}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
                target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 flex-shrink-0"
              >
                <Navigation size={14} />
              </a>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Plan · {job.plan.name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {job.plan.includes_json.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-emerald-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
          {(job.status === 'started' || job.status === 'completed') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Job Photos</p>
              <div className="grid grid-cols-2 gap-3">
                {(['before', 'after'] as const).map(type => {
                  const photo = type === 'before' ? beforePhoto : afterPhoto;
                  const ref = type === 'before' ? beforeRef : afterRef;
                  return (
                    <div key={type}>
                      <p className="text-xs font-semibold text-gray-500 mb-2 capitalize">{type}</p>
                      {photo ? (
                        <div className="relative">
                          <img src={photo} alt={type} className="w-full h-40 object-cover rounded-xl" />
                          <div className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full p-0.5">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => ref.current?.click()}
                          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-sky-300 hover:text-sky-400 transition-colors bg-gray-50"
                        >
                          <Camera size={22} />
                          <span className="text-xs font-semibold">Take photo</span>
                        </button>
                      )}
                      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handlePhoto(type, e)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar column */}
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* Status + GPS + Amount */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={job.status} />
                {gpsActive && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <Radio size={9} className="animate-pulse" /> GPS LIVE
                  </span>
                )}
              </div>
            </div>
            <p className="text-3xl font-extrabold text-sky-600 mt-3">₹{job.total_amount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total job amount</p>
          </div>

          {/* Action button */}
          {flow.next && (
            <button
              onClick={advance}
              disabled={updating}
              className={`w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r ${flow.gradient} shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2`}
            >
              {updating ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating…</span>
              ) : (
                <span className="flex items-center gap-1">{flow.label} <ChevronRight size={18} /></span>
              )}
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
