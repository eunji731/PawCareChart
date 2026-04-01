import React from 'react';
import type { Schedule } from '@/types/schedule';

interface ScheduleDetailInfoProps {
  schedule: Schedule;
  onToggleComplete: () => void;
}

export const ScheduleDetailInfo: React.FC<ScheduleDetailInfoProps> = ({ schedule, onToggleComplete }) => {
  const isPast = new Date(schedule.scheduleDate) < new Date();

  const typeIcon = {
    MEDICAL: '🏥',
    GROOMING: '✂️',
    MEDICATION: '💊',
    CHECKUP: '🩺',
    ETC: '📅'
  }[schedule.scheduleTypeCode];

  return (
    <div className="flex flex-col gap-4">
      {/* 1. 상단 KPI 카드 */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-3 lg:gap-4">
        
        {/* Time Card */}
        <div className="bg-[#FF6B00] rounded-[24px] p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-lg shadow-[#FF6B00]/20">
          <span className="text-white/70 text-[11px] font-black uppercase tracking-widest opacity-90">Reserved Time</span>
          <div className="mt-0 md:mt-4 flex items-end">
            <span className="text-white text-[24px] md:text-[32px] font-black tracking-tighter tabular-nums leading-none">
              {new Date(schedule.scheduleDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Type Card */}
        <div className="bg-white rounded-[24px] p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-sm border border-stone-200/60">
          <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">일정 유형</span>
          <div className="mt-0 md:mt-4 flex items-center gap-2 text-[#2D2D2D] text-[16px] md:text-[20px] font-black tracking-tight leading-snug">
            <span>{typeIcon}</span>
            <span>{schedule.scheduleTypeCode}</span>
          </div>
        </div>

        {/* Completion Status Card */}
        <div className={`rounded-[24px] p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-sm border transition-all cursor-pointer group
          ${schedule.isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-stone-200/60'}`}
          onClick={onToggleComplete}
        >
          <span className={`text-[11px] font-black uppercase tracking-widest ${schedule.isCompleted ? 'text-emerald-600' : 'text-stone-400'}`}>
            수행 상태
          </span>
          <div className="mt-0 md:mt-4 flex items-center gap-2">
            <span className={`text-[16px] md:text-[20px] font-black tracking-tight ${schedule.isCompleted ? 'text-emerald-600' : 'text-stone-300'}`}>
              {schedule.isCompleted ? '완료됨 ✅' : '예정됨 ⏳'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 증상 태그 (심플 스타일) */}
      {schedule.symptomTags && schedule.symptomTags.length > 0 && (
        <div className="px-2 py-1">
          <div className="flex flex-wrap gap-2">
            {schedule.symptomTags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[12px] font-bold flex items-center gap-1"
              >
                <span className="text-[#FF6B00]">#</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
