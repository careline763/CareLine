import { Loader2 } from 'lucide-react';

interface Props {
  text?: string;
  fullPage?: boolean;
}

export default function Loader({ text = 'Loading...', fullPage }: Props) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-luxuryDark-base/95 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-luxuryGold" size={40} />
          <p className="text-gray-400 text-sm tracking-wider">{text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
      <Loader2 className="animate-spin text-luxuryGold" size={24} />
      <span className="text-sm tracking-wider">{text}</span>
    </div>
  );
}
