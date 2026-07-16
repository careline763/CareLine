import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'white' | 'outlineLight';
type Size = 'sm' | 'md' | 'lg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-luxuryGold hover:bg-luxuryGold-light text-black shadow-lg shadow-luxuryGold/10 hover:shadow-luxuryGold/20 font-bold tracking-wider',
  outline: 'border border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-black font-bold tracking-wider',
  ghost: 'text-gray-300 hover:bg-luxuryDark-card hover:text-luxuryGold',
  danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold',
  accent: 'bg-luxuryGold hover:bg-luxuryGold-light text-black font-bold shadow-lg shadow-luxuryGold/10 tracking-wider',
  white: 'bg-white hover:bg-gray-100 text-black font-bold shadow-sm',
  outlineLight: 'border border-gray-600 text-white hover:border-luxuryGold hover:text-luxuryGold hover:bg-luxuryGold/10',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-8 py-4 text-xs',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  children,
  className = '',
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-bold uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-luxuryGold focus:ring-offset-1 focus:ring-offset-luxuryDark-base disabled:opacity-50 disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
