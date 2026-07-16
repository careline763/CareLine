import { useEffect, useState } from 'react';
import { Zap, Plus, Edit2, TrendingUp, Clock, Calendar, Droplets, Car } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

interface PricingRule {
  id: number; name: string; type: string;
  multiplier: number; config_json: Record<string, unknown>;
  is_active: boolean; created_at: string;
}

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  peak_hour:    { icon: Clock,     label: 'Peak Hour',    color: 'text-amber-500',  bg: 'bg-amber-50' },
  weekend:      { icon: Calendar,  label: 'Weekend',      color: 'text-indigo-500', bg: 'bg-indigo-50' },
  demand:       { icon: TrendingUp,label: 'High Demand',  color: 'text-red-500',    bg: 'bg-red-50' },
  waterless:    { icon: Droplets,  label: 'Waterless',    color: 'text-sky-500',    bg: 'bg-sky-50' },
  vehicle_type: { icon: Car,       label: 'Vehicle Type', color: 'text-purple-500', bg: 'bg-purple-50' },
};

const MOCK: PricingRule[] = [
  { id: 1, name: 'Peak Morning',   type: 'peak_hour',  multiplier: 1.20, config_json: { hours: [7,8,9] },         is_active: true,  created_at: '' },
  { id: 2, name: 'Peak Evening',   type: 'peak_hour',  multiplier: 1.20, config_json: { hours: [17,18,19] },      is_active: true,  created_at: '' },
  { id: 3, name: 'Weekend Surge',  type: 'weekend',    multiplier: 1.10, config_json: { days: [0,6] },            is_active: true,  created_at: '' },
  { id: 4, name: 'High Demand',    type: 'demand',     multiplier: 1.15, config_json: { threshold: 5 },           is_active: true,  created_at: '' },
  { id: 5, name: 'Waterless Plan', type: 'waterless',  multiplier: 1.05, config_json: {},                         is_active: true,  created_at: '' },
];

const EMPTY = { id: undefined as number | undefined, name: '', type: 'peak_hour', multiplier: 1.1, config_json: '{}', is_active: true };

export default function Pricing() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof EMPTY | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setTimeout(() => { setRules(MOCK); setLoading(false); }, 300); }, []);

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (r: PricingRule) => setEditing({ ...r, config_json: JSON.stringify(r.config_json, null, 2) });

  const save = async () => {
    if (!editing?.name || !editing.multiplier) { toast.error('Fill required fields'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    const parsed = JSON.parse(editing.config_json || '{}');
    if (editing.id) {
      setRules(prev => prev.map(r => r.id === editing.id ? { ...r, ...editing, config_json: parsed, multiplier: editing.multiplier } : r));
    } else {
      setRules(prev => [...prev, { ...editing, id: Date.now(), config_json: parsed, created_at: new Date().toISOString() }]);
    }
    toast.success('Rule saved');
    setEditing(null);
    setSaving(false);
  };

  const toggle = (id: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));
  };

  const maxMult = Math.max(...rules.map(r => r.multiplier), 1);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Zap size={20} className="text-amber-500" /> Dynamic Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">Configure surge multipliers — applied automatically at booking time</p>
        </div>
        <Button onClick={openNew}><Plus size={15} /> Add Rule</Button>
      </div>

      {/* Explanation */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <p className="font-semibold mb-1">How it works</p>
        <p>When a customer books, the system checks all active rules against the scheduled time, day, and pincode. The highest matching multiplier is applied to the base plan price. Multiple rules compound only if they produce the same type.</p>
      </div>

      {/* Rules list */}
      {loading ? <Loader /> : (
        <div className="space-y-3">
          {rules.map(rule => {
            const meta = TYPE_META[rule.type] ?? TYPE_META.peak_hour;
            const Icon = meta.icon;
            const pct = Math.round((rule.multiplier - 1) * 100);
            const barWidth = `${((rule.multiplier - 1) / (maxMult - 1)) * 100}%`;
            return (
              <div key={rule.id} className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-opacity ${rule.is_active ? 'border-gray-100 shadow-sm' : 'border-gray-100 opacity-50'}`}>
                <div className={`w-10 h-10 ${meta.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{rule.name}</p>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded capitalize ${meta.bg} ${meta.color}`}>{meta.label}</span>
                    {!rule.is_active && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Inactive</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 bg-gray-100 rounded-full flex-1 max-w-[160px] overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: barWidth }} />
                    </div>
                    <span className="text-sm font-bold text-amber-600">+{pct}%</span>
                    <span className="text-xs text-gray-400">(×{rule.multiplier})</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {JSON.stringify(rule.config_json) !== '{}' ? JSON.stringify(rule.config_json) : 'No config'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(rule)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><Edit2 size={14} /></button>
                  <button
                    onClick={() => toggle(rule.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${rule.is_active ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                  >{rule.is_active ? 'Disable' : 'Enable'}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Rule' : 'New Pricing Rule'}>
        {editing && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Rule Name</label>
              <input value={editing.name} onChange={e => setEditing(f => f && ({ ...f, name: e.target.value }))} placeholder="e.g. Morning Peak" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Type</label>
                <select value={editing.type} onChange={e => setEditing(f => f && ({ ...f, type: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Multiplier (e.g. 1.20)</label>
                <input type="number" step="0.01" min="1" max="3" value={editing.multiplier}
                  onChange={e => setEditing(f => f && ({ ...f, multiplier: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Config JSON</label>
              <textarea value={editing.config_json} onChange={e => setEditing(f => f && ({ ...f, config_json: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder='{"hours": [7,8,9]}' />
              <p className="text-xs text-gray-400 mt-1">peak_hour → {`{"hours": [7,8]}`} · weekend → {`{"days": [0,6]}`} · demand → {`{"threshold": 5}`}</p>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={editing.is_active} onChange={e => setEditing(f => f && ({ ...f, is_active: e.target.checked }))} className="rounded" />
              Active
            </label>
            <Button fullWidth onClick={save} loading={saving}>Save Rule</Button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
