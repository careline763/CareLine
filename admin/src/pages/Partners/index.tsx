import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Star, Briefcase, Trophy } from 'lucide-react';

const TIER_COLORS: Record<string, string> = {
  Platinum: 'bg-sky-100 text-sky-700',
  Gold:     'bg-amber-100 text-amber-700',
  Silver:   'bg-gray-100 text-gray-600',
  Bronze:   'bg-orange-100 text-orange-700',
};

function getTier(score: number) {
  if (score >= 85) return 'Platinum';
  if (score >= 70) return 'Gold';
  if (score >= 50) return 'Silver';
  return 'Bronze';
}
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import type { Partner } from '../../types';
import toast from 'react-hot-toast';

interface PartnerWithScore extends Partner {
  quality_score?: number; completion_rate?: number;
  on_time_rate?: number; photo_submission_rate?: number;
}

const MOCK: PartnerWithScore[] = [
  {id:1,user_id:10,verification_status:'pending',rating_avg:0,total_jobs:0,is_available:true,created_at:new Date().toISOString(),user:{id:10,name:'Rajan Kumar',phone:'9812345678',role:'partner',created_at:''},quality_score:0},
  {id:2,user_id:11,verification_status:'approved',rating_avg:4.8,total_jobs:312,is_available:true,created_at:new Date(Date.now()-864000000).toISOString(),user:{id:11,name:'Suresh Verma',phone:'9723456789',role:'partner',created_at:''},quality_score:91,completion_rate:97,on_time_rate:88,photo_submission_rate:95},
  {id:3,user_id:12,verification_status:'approved',rating_avg:4.5,total_jobs:198,is_available:false,created_at:new Date(Date.now()-1728000000).toISOString(),user:{id:12,name:'Manoj Singh',phone:'9634567890',role:'partner',created_at:''},quality_score:74,completion_rate:89,on_time_rate:82,photo_submission_rate:70},
  {id:4,user_id:13,verification_status:'pending',rating_avg:0,total_jobs:0,is_available:true,created_at:new Date(Date.now()-86400000).toISOString(),user:{id:13,name:'Vikram Yadav',phone:'9545678901',role:'partner',created_at:''},quality_score:0},
  {id:5,user_id:14,verification_status:'rejected',rating_avg:0,total_jobs:0,is_available:false,created_at:new Date(Date.now()-259200000).toISOString(),user:{id:14,name:'Deepak Sharma',phone:'9456789012',role:'partner',created_at:''},quality_score:0},
];

export default function Partners() {
  const [partners, setPartners] = useState<PartnerWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<PartnerWithScore|null>(null);

  useEffect(() => { setTimeout(()=>{ setPartners(MOCK); setLoading(false); }, 400); }, []);

  const verify = (id: number, status: 'approved'|'rejected') => {
    setPartners(prev => prev.map(p => p.id===id ? {...p, verification_status:status} : p));
    toast.success(`Partner ${status}`);
    setSelected(null);
  };

  const filtered = partners.filter(p => {
    const ms = !search || p.user?.name?.toLowerCase().includes(search.toLowerCase()) || p.user?.phone?.includes(search);
    const mf = filter==='all' || p.verification_status===filter;
    return ms && mf;
  });

  const counts = { pending: partners.filter(p=>p.verification_status==='pending').length, approved: partners.filter(p=>p.verification_status==='approved').length };

  return (
    <AdminLayout title="Partners">
      {counts.pending>0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-amber-700 text-sm">
          <CheckCircle size={15}/> <strong>{counts.pending}</strong> partner{counts.pending>1?'s':''} waiting for verification
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or phone…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Partner','Phone','Status','Rating','Jobs','Quality','Availability','Actions'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{p.user?.name?.charAt(0) ?? '?'}</div>
                      <span className="font-medium text-gray-900">{p.user?.name ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.user?.phone ?? '—'}</td>
                  <td className="px-4 py-3"><Badge label={p.verification_status}/></td>
                  <td className="px-4 py-3">
                    {p.rating_avg>0 ? <span className="flex items-center gap-1 text-amber-500"><Star size={12} className="fill-amber-400"/> {Number(p.rating_avg).toFixed(1)}</span> : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {p.total_jobs>0 ? <span className="flex items-center gap-1 text-gray-600"><Briefcase size={12}/> {p.total_jobs}</span> : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {(p.quality_score ?? 0) > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Trophy size={12} className="text-amber-400" />
                        <span className="font-semibold text-gray-800">{p.quality_score}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${TIER_COLORS[getTier(p.quality_score ?? 0)]}`}>{getTier(p.quality_score ?? 0)}</span>
                      </div>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.is_available?'text-emerald-600':'text-gray-400'}`}>{p.is_available?'Available':'Offline'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {p.verification_status==='pending' && <>
                        <Button size="sm" variant="success" onClick={()=>verify(p.id,'approved')}><CheckCircle size={12}/>Approve</Button>
                        <Button size="sm" variant="danger" onClick={()=>verify(p.id,'rejected')}><XCircle size={12}/>Reject</Button>
                      </>}
                      {p.verification_status!=='pending' && <Button size="sm" variant="ghost" onClick={()=>setSelected(p)}>View</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Partner: ${selected?.user?.name ?? '—'}`}>
        {selected && (
          <div className="space-y-3 text-sm">
            {(selected.quality_score ?? 0) > 0 && (
              <div className={`rounded-xl p-3 mb-2 flex items-center gap-3 ${TIER_COLORS[getTier(selected.quality_score ?? 0)].split(' ')[0]}`}>
                <Trophy size={20} className="text-amber-400" />
                <div>
                  <p className="font-bold text-gray-900">{getTier(selected.quality_score ?? 0)} · {selected.quality_score}/100</p>
                  <div className="h-1.5 bg-white/60 rounded-full mt-1 w-32 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{width:`${selected.quality_score}%`}} />
                  </div>
                </div>
              </div>
            )}
            {[['Name',selected.user?.name ?? '—'],['Phone',selected.user?.phone ?? '—'],['Status',selected.verification_status],['Rating',selected.rating_avg>0?`⭐ ${selected.rating_avg}`:'Not rated yet'],['Total Jobs',selected.total_jobs],['Completion Rate',selected.completion_rate!=null?`${selected.completion_rate}%`:'—'],['On-Time Rate',selected.on_time_rate!=null?`${selected.on_time_rate}%`:'—'],['Photo Rate',selected.photo_submission_rate!=null?`${selected.photo_submission_rate}%`:'—'],['Joined',new Date(selected.created_at).toLocaleDateString('en-IN')]].map(([k,v])=>(
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium text-gray-900 capitalize">{String(v)}</span>
              </div>
            ))}
            {selected.verification_status==='approved' && (
              <Button variant="danger" fullWidth onClick={()=>verify(selected.id,'rejected')} className="mt-3">Revoke Approval</Button>
            )}
            {selected.verification_status==='rejected' && (
              <Button variant="success" fullWidth onClick={()=>verify(selected.id,'approved')} className="mt-3">Approve Partner</Button>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
