import React from 'react';
import type { CareRecord } from '@/types/care';
import { Card } from '@/components/common/Card';

export const TimelineItem: React.FC<{ record: CareRecord }> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';

  return (
    <div className="group flex gap-8 items-start relative">
      <div className="flex flex-col items-center flex-shrink-0 pt-6 relative z-10">
        <div className={`w-4 h-4 rounded-full border-[3px] border-white shadow-lg transition-all duration-500 group-hover:scale-125 
          ${isMedical ? 'bg-[#FF6B00]' : 'bg-[#FFB380]'}`} 
        />
        <div className="w-px h-32 bg-[#F0F0F0] mt-4 group-last:hidden" />
      </div>

      <Card className="flex-grow p-8 transition-all duration-500 hover:translate-x-3 hover:shadow-[0_30px_80px_rgba(0,0,0,0.04)] border-none ring-1 ring-[#F0F0F0]">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black tracking-[0.2em] px-4 py-1 rounded-md uppercase
                ${isMedical ? 'bg-[#FF6B00] text-white' : 'bg-stone-100 text-stone-500'}`}>
                {record.recordType}
              </span>
              <span className="text-[14px] font-black text-stone-300 tabular-nums">{record.recordDate}</span>
            </div>
            
            <h4 className="text-[24px] lg:text-[28px] font-black text-[#2D2D2D] tracking-tight leading-[1.1]">
              {record.title}
            </h4>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              {isMedical ? (
                <div className="flex items-center gap-3 text-[15px] text-stone-500 font-semibold bg-[#FCFAF8] px-5 py-2 rounded-xl border border-[#F5F5F5]">
                  <span className="text-xl">🏥</span> {record.clinicName || 'Clinic Name'}
                  {record.diagnosis && <span className="text-[#FF6B00] ml-2">/ {record.diagnosis}</span>}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-[15px] text-stone-500 font-semibold bg-[#FCFAF8] px-5 py-2 rounded-xl border border-[#F5F5F5]">
                  <span className="text-xl">🏷️</span> {record.categoryCode}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 min-w-[180px] self-stretch xl:self-auto">
            {record.amount !== undefined && (
              <div className="text-right py-4 px-8 bg-[#FCFAF8] rounded-2xl border border-[#F5F5F5] w-full shadow-inner">
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-1">Amount</p>
                <span className="text-[28px] font-black text-[#2D2D2D] tabular-nums tracking-tighter">
                  {record.amount.toLocaleString()}
                  <span className="text-[16px] ml-1 text-stone-400 font-bold">원</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
