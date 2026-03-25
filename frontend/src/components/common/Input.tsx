import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="text-[12px] font-extrabold text-stone-500 ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-xl border transition-all outline-none
          bg-white/50 focus:bg-white text-[14px] font-medium
          ${error 
            ? 'border-red-300 focus:border-red-400 ring-red-50' 
            : 'border-orange-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-50 shadow-sm'}
          text-stone-800 placeholder:text-stone-300
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="text-[11px] text-red-500 ml-1 font-bold">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-400 ml-1 font-medium">{helperText}</p>
      ) : null}
    </div>
  );
};
