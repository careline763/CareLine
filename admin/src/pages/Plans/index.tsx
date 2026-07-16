import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { Plan } from '../../types';
import toast from 'react-hot-toast';

const INITIAL: Plan[] = [
  {id:1,name:'One-Time Wash',type:'one_time',price:249,frequency:'Per visit',includes_json:['Exterior wash','Wipe-down','Glass wipe'],popular:false,is_active:true},
  {id:2,name:'Weekly Plan',type:'weekly',price:799,frequency:'4 washes/month',includes_json:['4 exterior washes','Dashboard wipe','Free reschedule'],popular:false,is_active:true},
  {id:3,name:'Monthly Pro',type:'monthly',price:1499,frequency:'Daily wash',includes_json:['Daily exterior wash','Interior vacuum 2x/week','Dashboard polish','Priority assignment'],popular:true,is_active:true},
  {id:4,name:'Society Plan',type:'society',price:12999,frequency:'Up to 20 cars',includes_json:['Bulk pricing','Dedicated team','Single billing'],popular:false,is_active:true},
];

const EMPTY: Partial<Plan> = { name:'', type:'one_time', price:0, frequency:'', includes_json:[], popular:false, is_active:true };

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Plan>>(EMPTY);
  const [includesText, setIncludesText] = useState('');

  useEffect(()=>{ setTimeout(()=>{ setPlans(INITIAL); setLoading(false); },300); },[]);

  const openNew = () => { setEditing(EMPTY); setIncludesText(''); setModal(true); };
  const openEdit = (p: Plan) => { setEditing(p); setIncludesText(p.includes_json.join('\n')); setModal(true); };

  const save = () => {
    const includes = includesText.split('\n').map(s=>s.trim()).filter(Boolean);
    if (!editing.name || !editing.price) return toast.error('Name and price are required');
    if (editing.id) {
      setPlans(prev=>prev.map(p=>p.id===editing.id ? {...p,...editing,includes_json:includes} as Plan : p));
      toast.success('Plan updated');
    } else {
      setPlans(prev=>[...prev,{...editing,includes_json:includes,id:Date.now()} as Plan]);
      toast.success('Plan created');
    }
    setModal(false);
  };

  const remove = (id: number) => {
    setPlans(prev=>prev.filter(p=>p.id!==id));
    toast.success('Plan deleted');
  };

  const toggle = (id: number) => setPlans(prev=>prev.map(p=>p.id===id?{...p,is_active:!p.is_active}:p));

  return (
    <AdminLayout title="Plans">
      <div className="flex justify-end mb-5">
        <Button onClick={openNew}><Plus size={15}/>New Plan</Button>
      </div>

      {loading ? <Loader/> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(p=>(
            <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col ${p.popular?'border-indigo-300 ring-1 ring-indigo-200':'border-gray-100'} ${!p.is_active?'opacity-60':''}`}>
              <div className="flex items-start justify-between mb-3">
                <Badge label={p.type}/>
                {p.popular && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>}
              </div>
              <h3 className="font-bold text-gray-900 mb-0.5">{p.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{p.frequency}</p>
              <div className="text-2xl font-extrabold text-gray-900 mb-3">₹{Number(p.price).toLocaleString('en-IN')}</div>
              <ul className="flex-1 space-y-1 mb-4">
                {p.includes_json.map(item=>(
                  <li key={item} className="flex items-start gap-1.5 text-xs text-gray-500">
                    <CheckCircle size={11} className="text-emerald-500 mt-0.5 flex-shrink-0"/>{item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button size="sm" variant="ghost" onClick={()=>toggle(p.id)} className="flex-1">{p.is_active?'Disable':'Enable'}</Button>
                <Button size="sm" variant="outline" onClick={()=>openEdit(p)}><Pencil size={11}/></Button>
                <Button size="sm" variant="danger" onClick={()=>remove(p.id)}><Trash2 size={11}/></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title={editing.id?'Edit Plan':'New Plan'}>
        <div className="space-y-3">
          {[['Plan Name','text','name'],['Price (₹)','number','price'],['Frequency label','text','frequency']].map(([label,type,key])=>(
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input type={type} value={String((editing as Record<string,unknown>)[key]??'')}
                onChange={e=>setEditing(prev=>({...prev,[key]:type==='number'?Number(e.target.value):e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select value={editing.type} onChange={e=>setEditing(prev=>({...prev,type:e.target.value as Plan['type']}))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {['one_time','weekly','monthly','society'].map(t=><option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">What's included (one per line)</label>
            <textarea rows={4} value={includesText} onChange={e=>setIncludesText(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="popular" checked={!!editing.popular} onChange={e=>setEditing(prev=>({...prev,popular:e.target.checked}))}/>
            <label htmlFor="popular" className="text-sm text-gray-700">Mark as popular</label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={()=>setModal(false)}>Cancel</Button>
            <Button fullWidth onClick={save}>Save Plan</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
