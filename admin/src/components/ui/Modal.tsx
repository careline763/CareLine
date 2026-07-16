import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }: { open:boolean; onClose:()=>void; title?:string; children:React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 rounded-lg p-1"><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
