import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

interface CheckItem { id: number; label: string; note?: string; done: boolean; }

const STEPS: CheckItem[] = [
  { id: 1, label: 'Pre-inspection — check for scratches or dents', note: 'Document any pre-existing damage', done: false },
  { id: 2, label: 'Rinse wheels and wheel arches', done: false },
  { id: 3, label: 'Apply exterior foam / waterless solution', done: false },
  { id: 4, label: 'Wipe panels with microfiber cloth (top to bottom)', note: 'Use clean cloth for each panel', done: false },
  { id: 5, label: 'Clean windows and mirrors', done: false },
  { id: 6, label: 'Polish door handles and trim', done: false },
  { id: 7, label: 'Tyre dressing (if in plan)', done: false },
  { id: 8, label: 'Interior — vacuum seats and floor mats', done: false },
  { id: 9, label: 'Wipe dashboard, console, and cup holders', done: false },
  { id: 10, label: 'Final visual check — no missed spots', done: false },
  { id: 11, label: 'Photograph car (after photo) for record', done: false },
];

export default function Checklist() {
  const [items, setItems] = useState<CheckItem[]>(STEPS);

  const toggle = (id: number) => setItems(prev => prev.map(it => it.id === id ? { ...it, done: !it.done } : it));

  const completed = items.filter(i => i.done).length;
  const pct = Math.round((completed / items.length) * 100);

  const handleSubmit = () => {
    if (completed < items.length) { toast.error(`${items.length - completed} items still unchecked`); return; }
    toast.success('Checklist submitted!');
  };

  return (
    <AppShell title="Cleaning Checklist">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-10">
        {/* Progress */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3.5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">{completed} / {items.length} completed</p>
            <p className="text-sm font-bold text-sky-500">{pct}%</p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full text-left bg-white rounded-2xl border p-4 flex items-start gap-3 transition-all active:scale-[0.99] ${item.done ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 shadow-sm'}`}
            >
              <span className="flex-shrink-0 mt-0.5">
                {item.done
                  ? <CheckCircle size={22} className="text-emerald-500" />
                  : <Circle size={22} className="text-gray-300" />
                }
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 w-5">{idx + 1}</span>
                  <p className={`text-sm font-semibold ${item.done ? 'text-emerald-700 line-through' : 'text-gray-800'}`}>{item.label}</p>
                </div>
                {item.note && <p className="text-xs text-gray-400 mt-1 ml-7">{item.note}</p>}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 md:max-w-xs md:ml-auto">
          <Button fullWidth size="lg" onClick={handleSubmit} disabled={completed === 0}>
            Submit Checklist ({completed}/{items.length})
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
