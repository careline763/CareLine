import AdminLayout from '../../components/layout/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const monthlyRevenue = [
  {month:'Jan',revenue:180000,bookings:420},{month:'Feb',revenue:215000,bookings:510},
  {month:'Mar',revenue:198000,bookings:470},{month:'Apr',revenue:240000,bookings:580},
  {month:'May',revenue:275000,bookings:650},{month:'Jun',revenue:312000,bookings:730},
];

const cityData = [
  {city:'Mumbai',bookings:312,revenue:145000},{city:'Delhi',bookings:198,revenue:89000},
  {city:'Bengaluru',bookings:176,revenue:82000},{city:'Hyderabad',bookings:98,revenue:44000},
  {city:'Chennai',bookings:74,revenue:34000},
];

const topPartners = [
  {name:'Suresh Verma',jobs:312,rating:4.8,revenue:82000},
  {name:'Manoj Singh',jobs:198,rating:4.5,revenue:52000},
  {name:'Ravi Kumar',jobs:176,rating:4.7,revenue:46000},
  {name:'Arun Sharma',jobs:134,rating:4.4,revenue:35000},
  {name:'Deepak Nair',jobs:112,rating:4.6,revenue:29000},
];

export default function Analytics() {
  return (
    <AdminLayout title="Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Monthly Revenue (₹)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{fontSize:11}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString('en-IN')}`, 'Revenue']}/>
              <Bar dataKey="revenue" fill="#6366f1" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{fontSize:11}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:11}} tickLine={false} axisLine={false}/>
              <Tooltip/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} dot={{r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Bookings by City</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:11}} tickLine={false} axisLine={false}/>
              <YAxis type="category" dataKey="city" tick={{fontSize:11}} tickLine={false} axisLine={false} width={70}/>
              <Tooltip/>
              <Bar dataKey="bookings" fill="#8b5cf6" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Partners by Jobs</h2>
          <div className="space-y-3">
            {topPartners.map((p,i)=>(
              <div key={p.name} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i===0?'bg-amber-400 text-white':i===1?'bg-gray-300 text-gray-700':i===2?'bg-orange-400 text-white':'bg-gray-100 text-gray-500'}`}>{i+1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    <span className="text-xs text-gray-400">⭐ {p.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 bg-gray-100 rounded-full h-1">
                      <div className="bg-indigo-500 h-1 rounded-full" style={{width:`${(p.jobs/topPartners[0].jobs)*100}%`}}/>
                    </div>
                    <span className="text-xs text-gray-400">{p.jobs} jobs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
