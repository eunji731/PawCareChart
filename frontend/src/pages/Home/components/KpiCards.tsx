import React from 'react';

interface KpiCardsProps {
  data?: {
    totalExpenses: number;
    medicalCount: number;
    activeMedications: number;
  };
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data, isLoading }) => {
  const kpis = [
    {
      label: 'Monthly Expense',
      value: data ? `${data.totalExpenses.toLocaleString()}` : '0',
      unit: '원',
      icon: '💸'
    },
    {
      label: 'Medical Records',
      value: data ? `${data.medicalCount}` : '0',
      unit: '건',
      icon: '🏥'
    },
    {
      label: 'Active Medications',
      value: data ? `${data.activeMedications}` : '0',
      unit: '건',
      icon: '💊',
      description: '이번 달 복용 일정'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 py-4">
      {kpis.map((kpi, index) => (
        <div 
          key={index}
          className="relative flex flex-col items-center md:items-start gap-2 group text-center md:text-left"
        >
          {/* Label Area */}
          <div className="flex items-center gap-2">
            <span className="text-base opacity-60 grayscale group-hover:grayscale-0 transition-all">{kpi.icon}</span>
            <p className="text-[12px] font-black text-stone-500 uppercase tracking-[0.15em]">{kpi.label}</p>
          </div>

          {/* Value Area */}
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-[32px] md:text-[36px] font-black text-[#2D2D2D] tracking-tighter tabular-nums leading-none">
              {isLoading ? (
                <div className="h-9 w-24 bg-stone-50 animate-pulse rounded-md" />
              ) : kpi.value}
            </h3>
            {!isLoading && <span className="text-[15px] md:text-[16px] font-bold text-stone-400">{kpi.unit}</span>}
          </div>

          {/* Description */}
          {kpi.description && !isLoading && (
            <p className="text-[11px] md:text-[12px] font-bold text-stone-400 tracking-tight">{kpi.description}</p>
          )}

          {/* Subtle Accent Line */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-[2px] bg-stone-100 group-hover:w-16 md:group-hover:w-full group-hover:bg-[#FF6B00]/30 transition-all duration-500" />
        </div>
      ))}
    </div>
  );
};
