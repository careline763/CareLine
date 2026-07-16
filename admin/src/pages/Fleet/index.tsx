import { useEffect, useState } from 'react';
import { Building2, Plus, Users, Car, FileText, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

interface Fleet {
  id: number; name: string; company_name: string;
  billing_email: string; contact_phone: string;
  gstin?: string; is_active: boolean; created_at: string;
  _count: { members: number; vehicles: number; bookings: number };
}

const MOCK: Fleet[] = [
  { id:1, name:'Uber Fleet Delhi', company_name:'Uber India Pvt Ltd', billing_email:'fleet@uber.com', contact_phone:'9911223344', gstin:'07AABCU9603R1ZP', is_active:true, created_at:new Date().toISOString(), _count:{members:12,vehicles:45,bookings:210} },
  { id:2, name:'Ola Corporate', company_name:'ANI Technologies', billing_email:'corp@ola.com', contact_phone:'9822334455', is_active:true, created_at:new Date(Date.now()-2592000000).toISOString(), _count:{members:8,vehicles:30,bookings:95} },
  { id:3, name:'Zomato Delivery Fleet', company_name:'Zomato Ltd', billing_email:'ops@zomato.com', contact_phone:'9733445566', gstin:'07AABCZ1234A1ZA', is_active:false, created_at:new Date(Date.now()-5184000000).toISOString(), _count:{members:4,vehicles:18,bookings:44} },
];

const EMPTY = { name:'', company_name:'', billing_email:'', contact_phone:'', gstin:'' };

export default function Fleet() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Fleet|null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setTimeout(()=>{ setFleets(MOCK); setLoading(false); }, 400); }, []);

  const toggle = (id: number) => {
    setFleets(prev => prev.map(f => f.id===id ? {...f, is_active:!f.is_active} : f));
    toast.success('Fleet status updated');
  };

  const handleCreate = async () => {
    if (!form.name || !form.company_name || !form.billing_email || !form.contact_phone) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    const newFleet: Fleet = {
      id: Date.now(), ...form, is_active: true,
      created_at: new Date().toISOString(), _count: { members:0, vehicles:0, bookings:0 },
    };
    setFleets(prev => [newFleet, ...prev]);
    toast.success('Fleet created');
    setShowCreate(false); setForm(EMPTY); setSaving(false);
  };

  const totalBookings = fleets.reduce((s, f) => s + f._count.bookings, 0);
  const totalVehicles = fleets.reduce((s, f) => s + f._count.vehicles, 0);

  return (
    <AdminLayout title="B2B Fleet Portal">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Building2, label: 'Fleets', value: fleets.length, color: 'text-indigo-600 bg-indigo-50' },
          { icon: Car, label: 'Vehicles', value: totalVehicles, color: 'text-sky-600 bg-sky-50' },
          { icon: TrendingUp, label: 'Bookings', value: totalBookings, color: 'text-emerald-600 bg-emerald-50' },
          { icon: Users, label: 'Managers', value: fleets.reduce((s,f) => s+f._count.members, 0), color: 'text-amber-600 bg-amber-50' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}><Icon size={16}/></div>
            <div><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-bold text-gray-900">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowCreate(true)}><Plus size={15}/> Add Fleet</Button>
      </div>

      {loading ? <Loader/> : (
        <div className="grid gap-4">
          {fleets.map(f => (
            <div key={f.id} className={`bg-white rounded-xl border p-5 transition-opacity ${f.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Building2 size={18} className="text-indigo-600"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.name}</h3>
                    <p className="text-xs text-gray-400">{f.company_name}</p>
                    {f.gstin && <p className="text-xs text-gray-400 font-mono">GSTIN: {f.gstin}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {f.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => toggle(f.id)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    {f.is_active ? <ToggleRight size={22} className="text-indigo-500"/> : <ToggleLeft size={22}/>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
                {[
                  { icon: Users, label: 'Members', value: f._count.members },
                  { icon: Car, label: 'Vehicles', value: f._count.vehicles },
                  { icon: FileText, label: 'Bookings', value: f._count.bookings },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <Icon size={13} className="text-gray-400"/><span className="text-gray-500">{label}:</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                <span>{f.billing_email}</span>
                <span>·</span><span>{f.contact_phone}</span>
                <span className="ml-auto">Added {new Date(f.created_at).toLocaleDateString('en-IN')}</span>
                <Button size="sm" variant="ghost" onClick={() => setSelected(f)}>View Details</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={()=>{ setShowCreate(false); setForm(EMPTY); }} title="Create Fleet">
        <div className="space-y-3">
          {([['Fleet Name*','name','text'],['Company Name*','company_name','text'],['Billing Email*','billing_email','email'],['Contact Phone*','contact_phone','tel'],['GSTIN (optional)','gstin','text']] as [string,string,string][]).map(([label,key,type]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} value={(form as Record<string,string>)[key]}
                onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
          ))}
          <Button fullWidth onClick={handleCreate} disabled={saving}>{saving ? 'Creating…' : 'Create Fleet'}</Button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div className="space-y-3 text-sm">
            {[['Company',selected.company_name],['Email',selected.billing_email],['Phone',selected.contact_phone],['GSTIN',selected.gstin||'—'],['Members',selected._count.members],['Vehicles',selected._count.vehicles],['Total Bookings',selected._count.bookings],['Added',new Date(selected.created_at).toLocaleDateString('en-IN')]].map(([k,v])=>(
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium text-gray-900">{String(v)}</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-2">Manage members and vehicles via API or the fleet portal at port 5177.</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
