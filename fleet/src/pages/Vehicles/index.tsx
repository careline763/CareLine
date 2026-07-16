import { useEffect, useState } from 'react';
import { Car, Plus, Search } from 'lucide-react';
import FleetLayout from '../../components/FleetLayout';
import toast from 'react-hot-toast';

interface Vehicle { id: number; type: string; model: string; plate_number: string; owner: string; last_washed?: string }

const MOCK: Vehicle[] = [
  { id:1, type:'SUV', model:'Toyota Fortuner', plate_number:'DL 01 AB 1234', owner:'Rahul Sharma', last_washed:'2026-06-22' },
  { id:2, type:'Sedan', model:'Honda City', plate_number:'DL 02 CD 5678', owner:'Priya Singh', last_washed:'2026-06-20' },
  { id:3, type:'SUV', model:'Hyundai Creta', plate_number:'DL 03 EF 9012', owner:'Vikram Yadav' },
  { id:4, type:'Hatchback', model:'Maruti Swift', plate_number:'DL 04 GH 3456', owner:'Neha Verma', last_washed:'2026-06-24' },
  { id:5, type:'Sedan', model:'Tata Nexon', plate_number:'DL 05 IJ 7890', owner:'Amit Kumar' },
  { id:6, type:'SUV', model:'Kia Seltos', plate_number:'DL 06 KL 2345', owner:'Sunita Rao', last_washed:'2026-06-21' },
];

const TYPE_COLOR: Record<string, string> = {
  SUV: 'bg-indigo-50 text-indigo-700',
  Sedan: 'bg-sky-50 text-sky-700',
  Hatchback: 'bg-emerald-50 text-emerald-700',
};

const EMPTY = { type:'Sedan', model:'', plate_number:'', owner:'' };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { setTimeout(() => { setVehicles(MOCK); setLoading(false); }, 400); }, []);

  const filtered = vehicles.filter(v =>
    !search || v.model.toLowerCase().includes(search.toLowerCase()) || v.plate_number.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.model || !form.plate_number || !form.owner) { toast.error('Fill all fields'); return; }
    setVehicles(prev => [...prev, { id: Date.now(), ...form }]);
    toast.success('Vehicle added to fleet');
    setShowAdd(false); setForm(EMPTY);
  };

  return (
    <FleetLayout title="Fleet Vehicles">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by model or plate…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus size={15}/> Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Vehicle','Plate','Type','Owner','Last Washed'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Car size={14} className="text-slate-500"/>
                      </div>
                      <span className="font-medium text-gray-900">{v.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700 text-xs">{v.plate_number}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[v.type] ?? 'bg-gray-50 text-gray-500'}`}>{v.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{v.owner}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{v.last_washed ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Add Vehicle to Fleet</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Vehicle Type</label>
                <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>
              {[['Model','model','text','Toyota Fortuner'],['Plate Number','plate_number','text','DL 01 AB 1234'],['Assigned Driver','owner','text','John Doe']].map(([label,key,type,ph])=>(
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                  <input type={type} placeholder={ph} value={(form as Record<string,string>)[key]}
                    onChange={e => setForm(p => ({...p,[key]:e.target.value}))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setShowAdd(false); setForm(EMPTY); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAdd}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FleetLayout>
  );
}
