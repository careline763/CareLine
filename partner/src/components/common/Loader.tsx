import { Loader2 } from 'lucide-react';
export default function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="animate-spin text-sky-500" size={28} />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
