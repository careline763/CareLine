import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const [business, setBusiness] = useState({ name:'SparkWash', support_phone:'+91 98765 43210', support_email:'support@sparkwash.in', gst_number:'27AABCU9603R1ZJ' });
  const [ops, setOps] = useState({ booking_advance_hours:2, max_daily_bookings_per_partner:8, auto_assign_enabled:true, waterless_zones_enabled:true });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,800));
    setSaving(false);
    toast.success('Settings saved');
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Business Information</h2>
          <div className="space-y-3">
            {[
              ['Business Name','text',business.name,(v:string)=>setBusiness(b=>({...b,name:v}))],
              ['Support Phone','tel',business.support_phone,(v:string)=>setBusiness(b=>({...b,support_phone:v}))],
              ['Support Email','email',business.support_email,(v:string)=>setBusiness(b=>({...b,support_email:v}))],
              ['GST Number','text',business.gst_number,(v:string)=>setBusiness(b=>({...b,gst_number:v}))],
            ].map(([label,type,val,onChange])=>(
              <div key={String(label)}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <input type={String(type)} value={String(val)} onChange={e=>(onChange as (v:string)=>void)(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Operations</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Booking Advance (hours)</label>
                <input type="number" value={ops.booking_advance_hours} onChange={e=>setOps(o=>({...o,booking_advance_hours:Number(e.target.value)}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Jobs/Partner/Day</label>
                <input type="number" value={ops.max_daily_bookings_per_partner} onChange={e=>setOps(o=>({...o,max_daily_bookings_per_partner:Number(e.target.value)}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              </div>
            </div>
            {[
              ['Auto-assign partners to bookings','auto_assign_enabled',ops.auto_assign_enabled,(v:boolean)=>setOps(o=>({...o,auto_assign_enabled:v}))],
              ['Enable waterless zone detection','waterless_zones_enabled',ops.waterless_zones_enabled,(v:boolean)=>setOps(o=>({...o,waterless_zones_enabled:v}))],
            ].map(([label,key,val,onChange])=>(
              <label key={String(key)} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 cursor-pointer">
                <span className="text-sm text-gray-700">{String(label)}</span>
                <button onClick={()=>(onChange as (v:boolean)=>void)(!val)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${val?'bg-indigo-600':'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${val?'translate-x-5':''}`}/>
                </button>
              </label>
            ))}
          </div>
        </div>

        <Button size="lg" loading={saving} onClick={save}><Save size={15}/>Save All Settings</Button>
      </div>
    </AdminLayout>
  );
}
