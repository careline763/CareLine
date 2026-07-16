import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

const V: Record<Variant, string> = {
  primary: 'bg-sky-500 active:bg-sky-600 text-white shadow-sm',
  outline: 'border border-gray-300 text-gray-700 active:bg-gray-50',
  ghost: 'text-gray-500 active:bg-gray-100',
  danger: 'bg-red-500 active:bg-red-600 text-white',
  success: 'bg-emerald-500 active:bg-emerald-600 text-white',
};
const S: Record<Size, string> = { sm: 'px-3 py-2 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3.5 text-base' };

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; loading?: boolean; fullWidth?: boolean;
}

export default function Button({ variant = 'primary', size = 'md', loading, fullWidth, children, className = '', disabled, ...p }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${V[variant]} ${S[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading} {...p}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
