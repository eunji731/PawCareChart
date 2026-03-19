import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'amber' | 'stone' | 'red' | 'orange' | 'emerald';
  className?: string;
}

export const Badge = ({ children, color = 'stone', className = '' }: BadgeProps) => {
  const colors = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    stone: "bg-stone-50 text-stone-500 border-stone-200",
    red: "bg-red-50 text-red-600 border-red-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  return (
    <span className={`inline-block px-1.5 py-0.5 rounded-[5px] text-[10px] font-extrabold border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};
