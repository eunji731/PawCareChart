import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) => {
  const base = "font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-amber-500 text-white border border-transparent hover:bg-amber-600 rounded-[10px]",
    outline: "bg-orange-50 text-stone-600 border border-orange-200 hover:bg-white hover:text-amber-700 rounded-[10px]",
    ghost: "bg-transparent text-stone-500 border border-transparent hover:bg-orange-50 hover:text-stone-800 rounded-xl shadow-none",
    icon: "bg-orange-50 text-amber-600 border border-orange-100 hover:bg-amber-100 hover:text-amber-700 rounded-[6px] shadow-sm"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-[11px]",
    md: "px-3 py-1.5 text-[12px]",
    lg: "px-4 py-2.5 text-[14px]"
  };

  const isIcon = variant === 'icon';

  return (
    <button className={`${base} ${variants[variant]} ${isIcon ? 'w-[26px] h-[26px] p-0' : sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
