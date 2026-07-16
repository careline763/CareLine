import { useEffect, useState } from 'react';
import { Building2, Plus, Users, MapPin, Phone, Power, Eye } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { Society } from '../../types';
import toast from 'react-hot-toast';

const MOCK: Society[] = [
  { id: 1, name: 'Sunrise Heights', address: 'Off Link Road, Andheri West', pincode: '400053', contact_name: 'Mr. Patel (Secretary)', contact_phone: '9876540001', total_units: 120, active_units: 87, billing_email: 'secretary@sunriseheights.in', is_active: true, created_at: new Date(Date.now() - 7776000000).toISOString() },
  { id: 2, name: 'Sea View Towers', address: 'Band Stand, Bandra West', pincode: '400050', contact_name: 'Mrs. Mehta (Manager)', contact_phone: '9876540002', total_units: 200, active_units: 142, billing_email: 'mgr@seaview.co.in', is_active: true, created_at: new Date(Date.now() - 5184000000).toISOString() },
  { id: 3, name: 'Lokhandwala Complex', address: 'Oshiwara, Andheri West', pincode: '400053', contact_name: 'Mr. Sharma (RWA)', contact_phone: '9876540003', total_units: 350, active_units: 0, billing_email: undefined, is_active: false, created_at: new Date(Date.now() - 2592000000).toISOString() },
];

const EMPTY = { name: '', address: '', pincode: '', contact_name: '', contact_phone: '', total_units: 50, billing_email: '' };

export default function Societies() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Society | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setTimeout(() => { setSocieties(MOCK); setLoading(false); }, 300); }, []);

  const totalUnits = societies.reduce((s, x) => s + x.total_units, 0);
  const activeUnits = societies.reduce((s, x) => s + x.active_units, 0);

  const save = async () => {
    if (!form.name || !form.address || !form.pincode || !form.contact_name || !form.contact_phone) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const newSociety: Society = {
      ...form, id: Date.now(), active_units: 0, is_active: true,
      created_at: new Date().toISOString(), billing_email: form.billing_email || undefined,
    };
    setSocieties(prev => [newSociety, ...prev]);
    toast.success('Society added');
    setShowCreate(false);
    setForm(EMPTY);
    setSaving(false);
  };

  const toggle = async (s: Society) => {
    setSocieties(prev => prev.map(x => x.id === s.id ? { ...x, is_active: !x.is_active } : x));
    toast.success(s.is_active ? 'Society deactivated' : 'Society activated');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Societies / RWAs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage apartment and housing society partnerships</p>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus size={16} /> Add Society</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Societies', value: societies.length, icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Total Units', value: totalUnits, icon: Users, color: 'text-sky-500', bg: 'bg-sky-50' },
          { label: 'Active Subscriptions', value: activeUnits, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? <div className="py-8"><Loader /></div> : societies.map(s => (
          <div key={s.id} className={`bg-white border rounded-xl p-5 ${s.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 size={18} className="text-indigo-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{s.name}</p>
                  <Badge label={s.is_active ? 'active' : 'paused'} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelected(s)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-500"><Eye size={15} /></button>
                <button onClick={() => toggle(s)} className={`p-1.5 rounded-lg ${s.is_active ? 'hover:bg-red-50 text-red-400' : 'hover:bg-emerald-50 text-emerald-500'}`}>
                  <Power size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                <span>{s.address}, {s.pincode}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone size={14} className="text-gray-400" />
                <span>{s.contact_name} · {s.contact_phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-50">
              <div>
                <p className="text-lg font-bold text-gray-900">{s.active_units} <span className="text-sm font-normal text-gray-400">/ {s.total_units}</span></p>
                <p className="text-xs text-gray-400">Units subscribed</p>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.total_units > 0 ? (s.active_units / s.total_units) * 100 : 0}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{s.total_units > 0 ? Math.round((s.active_units / s.total_units) * 100) : 0}% occupancy</p>
              </div>
              {s.billing_email && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Billing</p>
                  <p className="text-xs font-medium text-gray-600">{s.billing_email}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Society">
        <div className="space-y-3">
          {[
            { label: 'Society Name *', key: 'name', placeholder: 'e.g. Sunrise Heights' },
            { label: 'Full Address *', key: 'address', placeholder: 'Street, Area, City' },
            { label: 'Pincode *', key: 'pincode', placeholder: '400053' },
            { label: 'Contact Person *', key: 'contact_name', placeholder: 'Mr. Patel (Secretary)' },
            { label: 'Contact Phone *', key: 'contact_phone', placeholder: '9876543210' },
            { label: 'Billing Email', key: 'billing_email', placeholder: 'billing@society.com' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
              <input
                value={(form as Record<string, string | number>)[key] as string}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Total Units</label>
            <input type="number" value={form.total_units} onChange={e => setForm(f => ({ ...f, total_units: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <Button fullWidth onClick={save} loading={saving}>Save Society</Button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Total Units</p>
                <p className="text-xl font-bold">{selected.total_units}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Active Subs</p>
                <p className="text-xl font-bold text-emerald-600">{selected.active_units}</p>
              </div>
            </div>
            {[
              ['Address', selected.address],
              ['Pincode', selected.pincode],
              ['Contact', `${selected.contact_name} · ${selected.contact_phone}`],
              ['Billing Email', selected.billing_email ?? '—'],
              ['Added', new Date(selected.created_at).toLocaleDateString('en-IN')],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">{k}</span>
                <span className="text-gray-700 font-medium text-right max-w-[60%]">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
