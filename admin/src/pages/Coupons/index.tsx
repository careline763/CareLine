import { useEffect, useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import type { Coupon } from '../../types';
import toast from 'react-hot-toast';

const INITIAL: Coupon[] = [
  {id:1,code:'FIRST50',discount_type:'percent',value:50,valid_till:new Date(Date.now()+2592000000).toISOString(),max_uses:500,used_count:134,is_active:true},
  {id:2,code:'FLAT100',discount_type:'flat',value:100,valid_till:new Date(Date.now()+1296000000).toISOString(),max_uses:200,used_count:89,is_active:true},
  {id:3,code:'MONSOON25',discount_type:'percent',value:25,valid_till:new Date(Date.now()+5184000000).toISOString(),max_uses:1000,used_count:42,is_active:true},
  {id:4,code:'EXPIRED10',discount_type:'percent',value:10,valid_till:new Date(Date.now()-86400000).toISOString(),max_uses:100,used_count:100,is_active:false},
];

const EMPTY = { code:'', discount_type:'flat' as const, value:0, valid_till:'', max_uses:100, min_order_amount:0, max_discount:0, first_booking_only:false, is_active:true };

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(()=>{ setTimeout(()=>{ setCoupons(INITIAL); setLoading(false); },300); },[]);

  const save = () => {
    if (!form.code || !form.value || !form.valid_till) return toast.error('Fill all required fields');
    setCoupons(prev=>[{...form,id:Date.now(),used_count:0},  ...prev]);
    toast.success('Coupon created');
    setModal(false);
    setForm(EMPTY);
  };

  const remove = (id: number) => { setCoupons(prev=>prev.filter(c=>c.id!==id)); toast.success('Coupon deleted'); };
  const copy = (code: string) => { navigator.clipboard.writeText(code); toast.success('Copied!'); };
  const toggle = (id: number) => setCoupons(prev=>prev.map(c=>c.id===id?{...c,is_active:!c.is_active}:c));

  const isExpired = (d: string) => new Date(d) < new Date();

  return (
    <AdminLayout title="Coupons">
      <div className="flex justify-end mb-5">
        <Button onClick={()=>setModal(true)}><Plus size={15}/>New Coupon</Button>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Code','Type','Value','Valid Till','Usage','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {coupons.map(c=>(
                <tr key={c.id} className={`border-b border-gray-50 last:border-0 ${!c.is_active||isExpired(c.valid_till)?'opacity-50':''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{c.code}</code>
                      <button onClick={()=>copy(c.code)} className="text-gray-300 hover:text-gray-600"><Copy size={12}/></button>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge label={c.discount_type}/></td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{c.discount_type==='percent'?`${c.value}%`:`₹${c.value}`}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <span className={isExpired(c.valid_till)?'text-red-500 font-medium':''}>
                      {new Date(c.valid_till).toLocaleDateString('en-IN',{dateStyle:'medium'})}
                      {isExpired(c.valid_till)?' (Expired)':''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-16">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{width:`${Math.min(100,(c.used_count/c.max_uses)*100)}%`}}/>
                      </div>
                      <span className="text-xs text-gray-400">{c.used_count}/{c.max_uses}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge label={c.is_active&&!isExpired(c.valid_till)?'active':'paused'}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={()=>toggle(c.id)}>{c.is_active?'Disable':'Enable'}</Button>
                      <Button size="sm" variant="danger" onClick={()=>remove(c.id)}><Trash2 size={11}/></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title="New Coupon">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Coupon Code *</label>
            <input value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="SAVE50"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select value={form.discount_type} onChange={e=>setForm(f=>({...f,discount_type:e.target.value as 'flat'|'percent'}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="flat">Flat (₹)</option>
                <option value="percent">Percent (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Value *</label>
              <input type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:Number(e.target.value)}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Valid Till *</label>
              <input type="date" value={form.valid_till} onChange={e=>setForm(f=>({...f,valid_till:e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Uses</label>
              <input type="number" value={form.max_uses} onChange={e=>setForm(f=>({...f,max_uses:Number(e.target.value)}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Order (₹)</label>
              <input type="number" value={form.min_order_amount} onChange={e=>setForm(f=>({...f,min_order_amount:Number(e.target.value)}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="0 = no min"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Discount (₹)</label>
              <input type="number" value={form.max_discount} onChange={e=>setForm(f=>({...f,max_discount:Number(e.target.value)}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="0 = no cap"/>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.first_booking_only} onChange={e=>setForm(f=>({...f,first_booking_only:e.target.checked}))} className="rounded" />
            First booking only
          </label>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={()=>setModal(false)}>Cancel</Button>
            <Button fullWidth onClick={save}>Create Coupon</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
