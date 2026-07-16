import { Loader2 } from 'lucide-react';
export default function Loader({ text='Loading...' }: { text?:string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
      <Loader2 className="animate-spin" size={20}/><span className="text-sm">{text}</span>
    </div>
  );
}
