import React from 'react';
import { calculateDDay } from '@/utils/dateUtils';
import type { Schedule } from '@/types/schedule';

interface ScheduleDetailHeaderProps {
  schedule: Schedule;
}

export const ScheduleDetailHeader: React.FC<ScheduleDetailHeaderProps> = ({ schedule }) => {
  const dDay = calculateDDay(schedule.scheduleDate);
  const dDayLabel = dDay === 0 ? 'Day' : dDay > 0 ? `-${dDay}` : `+${Math.abs(dDay)}`;
  const isPast = dDay < 0;

  const location = schedule.location || (schedule as any).location_info; // 스네이크 케이스 방어 코드

  return (
    <header className="pb-2">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg uppercase border
            ${isPast ? 'border-stone-200 text-stone-400 bg-white' : 'border-[#FF6B00]/30 text-[#FF6B00] bg-[#FF6B00]/5'}`}>
            {schedule.scheduleTypeCode}
          </span>
          <span className="text-[13px] font-black text-stone-400 tabular-nums ml-1 tracking-widest">
            {new Date(schedule.scheduleDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }).replace(/\. /g, '.').replace(/\.$/, '')}
          </span>
        </div>
        
        <h1 className="text-[36px] md:text-[44px] font-black text-[#2D2D2D] leading-[1.2] lg:leading-[1.1] tracking-tight word-break-keep-all pr-4">
          {schedule.title}<span className="text-[#FF6B00]">.</span>
        </h1>

        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
              <span className="text-[12px]">🐕</span>
            </div>
            <span className="text-[15px] font-black text-[#2D2D2D] tracking-tight">{schedule.dogName}</span>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-white text-[11px] font-black tracking-widest uppercase shadow-sm
            ${isPast ? 'bg-stone-400' : 'bg-red-500 shadow-red-500/20'}
          `}>
            D{dDayLabel}
          </div>
        </div>
      </div>
    </header>
  );
};
