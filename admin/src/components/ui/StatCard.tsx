import React from 'react';

interface Props { title:string; value:string|number; icon:React.ReactNode; change?:string; color?:string; }

export default function StatCard({ title, value, icon, change, color='indigo' }: Props) {
  const bg: Record<string,string> = { indigo:'bg-indigo-50 text-indigo-600', emerald:'bg-emerald-50 text-emerald-600', blue:'bg-blue-50 text-blue-600', amber:'bg-amber-50 text-amber-600', rose:'bg-rose-50 text-rose-600', purple:'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg[color]}`}>{icon}</div>
        {change && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${change.startsWith('+')?'bg-emerald-50 text-emerald-600':'bg-red-50 text-red-500'}`}>{change}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{typeof value==='number'&&value>999?value.toLocaleString('en-IN'):value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{title}</div>
    </div>
  );
}
