import { useEffect, useState } from 'react';
import { Plus, Pencil, Droplets } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { ServiceArea } from '../../types';
import toast from 'react-hot-toast';

const INITIAL: ServiceArea[] = [
  {id:1,pincode:'400001',city:'Mumbai',is_active:true,is_waterless_zone:false},
  {id:2,pincode:'400053',city:'Mumbai - Andheri',is_active:true,is_waterless_zone:false},
  {id:3,pincode:'110001',city:'Delhi',is_active:true,is_waterless_zone:false},
  {id:4,pincode:'560001',city:'Bengaluru',is_active:true,is_waterless_zone:false},
  {id:5,pincode:'500001',city:'Hyderabad',is_active:true,is_waterless_zone:true},
  {id:6,pincode:'600001',city:'Chennai',is_active:true,is_waterless_zone:false},
  {id:7,pincode:'411001',city:'Pune',is_active:false,is_waterless_zone:false},
];

const EMPTY: Partial<ServiceArea> = { pincode:'', city:'', is_active:true, is_waterless_zone:false };

export default function ServiceAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<ServiceArea>>(EMPTY);
  const [search, setSearch] = useState('');

  useEffect(()=>{ setTimeout(()=>{ setAreas(INITIAL); setLoading(false); },300); },[]);

  const save = () => {
    if (!editing.pincode || !editing.city) return toast.error('Pincode and city required');
    if (editing.id) {
      setAreas(prev=>prev.map(a=>a.id===editing.id?{...a,...editing} as ServiceArea:a));
      toast.success('Area updated');
    } else {
      if (areas.find(a=>a.pincode===editing.pincode)) return toast.error('Pincode already exists');
      setAreas(prev=>[...prev,{...editing,id:Date.now()} as ServiceArea]);
      toast.success('Area added');
    }
    setModal(false);
  };

  const toggle = (id: number) => {
    setAreas(prev=>prev.map(a=>a.id===id?{...a,is_active:!a.is_active}:a));
    toast.success('Status updated');
  };

  const filtered = !search ? areas : areas.filter(a=>a.pincode.includes(search)||a.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Service Areas">
      <div className="flex gap-3 justify-between mb-5">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pincode or city…"
          className="flex-1 max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
        <Button onClick={()=>{ setEditing(EMPTY); setModal(true); }}><Plus size={15}/>Add Area</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">{areas.filter(a=>a.is_active).length}</div>
          <div className="text-xs text-emerald-600">Active Zones</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{areas.filter(a=>a.is_waterless_zone).length}</div>
          <div className="text-xs text-blue-600">Waterless Zones</div>
        </div>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Pincode','City','Waterless Zone','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{a.pincode}</td>
                  <td className="px-4 py-3 text-gray-700">{a.city}</td>
                  <td className="px-4 py-3">
                    {a.is_waterless_zone ? (
                      <span className="flex items-center gap-1 text-blue-600 text-xs font-medium"><Droplets size={12}/>Yes</span>
                    ) : <span className="text-gray-300 text-xs">No</span>}
                  </td>
                  <td className="px-4 py-3"><Badge label={a.is_active?'active':'paused'}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" onClick={()=>{ setEditing(a); setModal(true); }}><Pencil size={11}/></Button>
                      <Button size="sm" variant="ghost" onClick={()=>toggle(a.id)}>{a.is_active?'Disable':'Enable'}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title={editing.id?'Edit Area':'Add Service Area'}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pincode *</label>
            <input maxLength={6} value={editing.pincode??''} onChange={e=>setEditing(p=>({...p,pincode:e.target.value.replace(/\D/g,'')}))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="400001"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">City *</label>
            <input value={editing.city??''} onChange={e=>setEditing(p=>({...p,city:e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Mumbai"/>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={!!editing.is_active} onChange={e=>setEditing(p=>({...p,is_active:e.target.checked}))}/>
              Active
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={!!editing.is_waterless_zone} onChange={e=>setEditing(p=>({...p,is_waterless_zone:e.target.checked}))}/>
              Waterless Zone
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={()=>setModal(false)}>Cancel</Button>
            <Button fullWidth onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
