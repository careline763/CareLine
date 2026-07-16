import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function Card({ children, className = '', onClick, selected }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-luxuryDark-card rounded-sm border p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-luxuryGold/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-luxuryGold/10' : ''
      } ${selected ? 'border-luxuryGold ring-2 ring-luxuryGold/20' : 'border-luxuryDark-border/60'} ${className}`}
    >
      {children}
    </div>
  );
}
