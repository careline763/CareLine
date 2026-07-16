import { useEffect, useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { Booking, BookingStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUSES: BookingStatus[] = ['pending_payment','confirmed','assigned','en_route','started','completed','cancelled'];

const MOCK_BOOKINGS: Booking[] = [
  {id:1842,user_id:1,vehicle_id:1,plan_id:3,address:'B-204, Sunrise Apts, Andheri West',pincode:'400053',scheduled_at:new Date(Date.now()+3600000).toISOString(),status:'assigned',total_amount:1499,created_at:new Date().toISOString(),user:{id:1,name:'Priya Sharma',phone:'9876543210',role:'customer',created_at:''},plan:{id:3,name:'Monthly Pro',type:'monthly',price:1499,frequency:'Daily',includes_json:[],popular:true,is_active:true}},
  {id:1841,user_id:2,vehicle_id:2,plan_id:1,address:'C-12, Green Park, Delhi',pincode:'110001',scheduled_at:new Date(Date.now()-86400000).toISOString(),status:'completed',total_amount:249,created_at:new Date().toISOString(),user:{id:2,name:'Rahul Verma',phone:'9123456789',role:'customer',created_at:''},plan:{id:1,name:'One-Time Wash',type:'one_time',price:249,frequency:'Per visit',includes_json:[],popular:false,is_active:true}},
  {id:1840,user_id:3,vehicle_id:3,plan_id:2,address:'A-5, Koramangala, Bengaluru',pincode:'560001',scheduled_at:new Date(Date.now()+7200000).toISOString(),status:'confirmed',total_amount:799,created_at:new Date().toISOString(),user:{id:3,name:'Anjali Singh',phone:'9988776655',role:'customer',created_at:''},plan:{id:2,name:'Weekly Plan',type:'weekly',price:799,frequency:'4x/month',includes_json:[],popular:false,is_active:true}},
  {id:1839,user_id:4,vehicle_id:4,plan_id:3,address:'102, Banjara Hills, Hyderabad',pincode:'500001',scheduled_at:new Date(Date.now()+1800000).toISOString(),status:'en_route',total_amount:1499,created_at:new Date().toISOString(),user:{id:4,name:'Amit Patel',phone:'9765432100',role:'customer',created_at:''},plan:{id:3,name:'Monthly Pro',type:'monthly',price:1499,frequency:'Daily',includes_json:[],popular:true,is_active:true}},
  {id:1838,user_id:5,vehicle_id:5,plan_id:1,address:'21, T. Nagar, Chennai',pincode:'600001',scheduled_at:new Date(Date.now()-172800000).toISOString(),status:'cancelled',total_amount:249,created_at:new Date().toISOString(),user:{id:5,name:'Neha Gupta',phone:'9345678901',role:'customer',created_at:''}},
];

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<BookingStatus | ''>('');

  useEffect(() => { setTimeout(() => { setBookings(MOCK_BOOKINGS); setLoading(false); }, 400); }, []);

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.user?.name?.toLowerCase().includes(search.toLowerCase()) || String(b.id).includes(search);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusUpdate = async () => {
    if (!selected || !updatingStatus) return;
    setBookings(prev => prev.map(b => b.id === selected.id ? {...b, status: updatingStatus as BookingStatus} : b));
    toast.success('Booking status updated');
    setSelected(null);
    setUpdatingStatus('');
  };

  return (
    <AdminLayout title="Bookings">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by customer or booking ID…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400"/>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            <option value="all">All Statuses</option>
            {STATUSES.map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">{filtered.length} bookings</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['ID','Customer','Plan','Amount','Location','Scheduled','Status',''].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(b=>(
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                    <td className="px-4 py-3 font-mono text-gray-400 text-xs">#{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{b.user?.name}</p>
                      <p className="text-xs text-gray-400">{b.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.plan?.name ?? `Plan #${b.plan_id}`}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">{b.address}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(b.scheduled_at).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'})}</td>
                    <td className="px-4 py-3"><Badge label={b.status}/></td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={()=>{ setSelected(b); setUpdatingStatus(b.status); }}>
                        <Eye size={13}/>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Booking #${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Customer',selected.user?.name],['Phone',selected.user?.phone],['Plan',selected.plan?.name],['Amount',`₹${selected.total_amount}`],['Pincode',selected.pincode],['Scheduled',new Date(selected.scheduled_at).toLocaleString('en-IN')]].map(([k,v])=>(
                <div key={k}><p className="text-xs text-gray-400">{k}</p><p className="font-medium text-gray-900">{v}</p></div>
              ))}
              <div className="col-span-2"><p className="text-xs text-gray-400">Address</p><p className="font-medium text-gray-900">{selected.address}</p></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Update Status</label>
              <select value={updatingStatus} onChange={e=>setUpdatingStatus(e.target.value as BookingStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {STATUSES.map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" fullWidth onClick={()=>setSelected(null)}>Cancel</Button>
              <Button fullWidth onClick={handleStatusUpdate}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
