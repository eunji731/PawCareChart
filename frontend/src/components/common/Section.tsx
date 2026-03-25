import React from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, description, children, rightElement, className = '' }) => {
  return (
    <section className={`bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden ${className}`}>
      {(title || rightElement) && (
        <div className="px-6 py-4 border-b border-orange-50 flex items-center justify-between bg-[#FFFBF7]">
          <div>
            {title && <h3 className="text-[15px] font-extrabold text-stone-800 tracking-tight">{title}</h3>}
            {description && <p className="text-[11px] text-stone-400 mt-0.5 font-medium">{description}</p>}
          </div>
          {rightElement}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </section>
  );
};
