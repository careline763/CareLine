import { useEffect, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import type { Subscription } from '../../types';

const MOCK: Subscription[] = [
  {id:1,user_id:1,plan_id:3,status:'active',next_billing_date:new Date(Date.now()+864000000).toISOString(),missed_credits:0,created_at:new Date(Date.now()-2592000000).toISOString(),user:{id:1,name:'Priya Sharma',phone:'9876543210',role:'customer',created_at:''},plan:{id:3,name:'Monthly Pro',type:'monthly',price:1499,frequency:'Daily',includes_json:[],popular:true,is_active:true}},
  {id:2,user_id:2,plan_id:2,status:'paused',next_billing_date:new Date(Date.now()+432000000).toISOString(),missed_credits:3,created_at:new Date(Date.now()-1728000000).toISOString(),user:{id:2,name:'Rahul Verma',phone:'9123456789',role:'customer',created_at:''},plan:{id:2,name:'Weekly Plan',type:'weekly',price:799,frequency:'4x/month',includes_json:[],popular:false,is_active:true}},
  {id:3,user_id:3,plan_id:3,status:'active',next_billing_date:new Date(Date.now()+1296000000).toISOString(),missed_credits:0,created_at:new Date(Date.now()-5184000000).toISOString(),user:{id:3,name:'Anjali Singh',phone:'9988776655',role:'customer',created_at:''},plan:{id:3,name:'Monthly Pro',type:'monthly',price:1499,frequency:'Daily',includes_json:[],popular:true,is_active:true}},
  {id:4,user_id:4,plan_id:2,status:'cancelled',next_billing_date:new Date(Date.now()-86400000).toISOString(),missed_credits:0,created_at:new Date(Date.now()-7776000000).toISOString(),user:{id:4,name:'Amit Patel',phone:'9765432100',role:'customer',created_at:''},plan:{id:2,name:'Weekly Plan',type:'weekly',price:799,frequency:'4x/month',includes_json:[],popular:false,is_active:true}},
];

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(()=>{ setTimeout(()=>{ setSubs(MOCK); setLoading(false); },400); },[]);

  const filtered = subs.filter(s=>{
    const ms = !search || s.user?.name?.toLowerCase().includes(search.toLowerCase());
    const mf = filter==='all' || s.status===filter;
    return ms && mf;
  });

  const total = subs.filter(s=>s.status==='active').reduce((sum,s)=>sum+(s.plan?.price??0),0);

  return (
    <AdminLayout title="Subscriptions">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {label:'Active',count:subs.filter(s=>s.status==='active').length,cls:'text-emerald-600'},
          {label:'Paused',count:subs.filter(s=>s.status==='paused').length,cls:'text-amber-600'},
          {label:'MRR',count:`₹${total.toLocaleString('en-IN')}`,cls:'text-indigo-600'},
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold ${c.cls}`}>{c.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by customer…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Customer','Plan','Status','Next Billing','Missed Credits','Since'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{s.user?.name}</p>
                    <p className="text-xs text-gray-400">{s.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800">{s.plan?.name}</p>
                    <p className="text-xs text-gray-400">₹{s.plan?.price}/mo</p>
                  </td>
                  <td className="px-4 py-3"><Badge label={s.status}/></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(s.next_billing_date).toLocaleDateString('en-IN',{dateStyle:'medium'})}</td>
                  <td className="px-4 py-3">
                    {s.missed_credits>0 ? (
                      <span className="flex items-center gap-1 text-orange-500 text-xs font-medium"><RefreshCw size={11}/>{s.missed_credits} credits</span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString('en-IN',{dateStyle:'medium'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
