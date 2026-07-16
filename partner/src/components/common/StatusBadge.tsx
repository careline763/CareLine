import type { JobStatus } from '../../types';

const config: Record<JobStatus, { label: string; cls: string; dot: string }> = {
  confirmed:  { label: 'Confirmed',   cls: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',     dot: 'bg-blue-400' },
  assigned:   { label: 'Assigned',    cls: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200', dot: 'bg-indigo-400' },
  en_route:   { label: 'En Route',    cls: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200', dot: 'bg-violet-400 animate-pulse' },
  started:    { label: 'In Progress', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',   dot: 'bg-amber-400 animate-pulse' },
  completed:  { label: 'Completed',   cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-400' },
  cancelled:  { label: 'Cancelled',   cls: 'bg-red-50 text-red-600 ring-1 ring-red-200',         dot: 'bg-red-400' },
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  const { label, cls, dot } = config[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
