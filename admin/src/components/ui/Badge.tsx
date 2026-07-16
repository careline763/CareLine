const colors: Record<string,string> = {
  active:'bg-emerald-100 text-emerald-700', approved:'bg-emerald-100 text-emerald-700',
  completed:'bg-emerald-100 text-emerald-700', paid:'bg-emerald-100 text-emerald-700',
  pending:'bg-yellow-100 text-yellow-700', pending_payment:'bg-yellow-100 text-yellow-700',
  confirmed:'bg-blue-100 text-blue-700', assigned:'bg-indigo-100 text-indigo-700',
  en_route:'bg-purple-100 text-purple-700', started:'bg-orange-100 text-orange-700',
  paused:'bg-gray-100 text-gray-600',
  cancelled:'bg-red-100 text-red-600', rejected:'bg-red-100 text-red-600',
  one_time:'bg-gray-100 text-gray-600', weekly:'bg-blue-100 text-blue-700',
  monthly:'bg-indigo-100 text-indigo-700', society:'bg-purple-100 text-purple-700',
};

export default function Badge({ label }: { label?: string }) {
  const text = label ?? '';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[text] ?? 'bg-gray-100 text-gray-600'}`}>
      {text.replace(/_/g,' ')}
    </span>
  );
}
