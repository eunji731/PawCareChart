import React from 'react';

interface TabListProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className = '' }: TabListProps) => {
  return (
    <div className={`flex gap-4 text-[13px] font-extrabold ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`pb-2 border-b-[3px] transition-colors ${
            activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
