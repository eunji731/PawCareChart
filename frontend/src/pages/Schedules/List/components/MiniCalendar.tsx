import React from 'react';
import type { Schedule } from '@/types/schedule';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  schedules: Schedule[];
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect, schedules }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDots = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySchedules = schedules.filter(s => s.scheduleDate && s.scheduleDate.startsWith(dateStr));

    return daySchedules.map(s => {
      if (s.scheduleTypeCode === 'MEDICAL') return 'bg-[#FF6B00]';
      if (s.scheduleTypeCode === 'GROOMING') return 'bg-blue-400';
      if (s.scheduleTypeCode === 'MEDICATION') return 'bg-green-400';
      return 'bg-stone-300';
    }).slice(0, 3); // 최대 3개까지만 표시
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-8">
        <span className="text-[20px] font-black text-stone-800">
          {selectedDate.toLocaleString('default', { month: 'long' })}
          <span className="text-[14px] font-bold text-stone-300 ml-2">{year}</span>
        </span>
      </div>

      <div className="grid grid-cols-7 gap-y-6">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[11px] font-black text-stone-300 uppercase tracking-tighter">
            {d}
          </div>
        ))}

        {emptyDays.map(d => <div key={`empty-${d}`} />)}

        {days.map(day => {
          const isSelected = selectedDate.getDate() === day;
          const dots = getDots(day);

          return (
            <div
              key={day}
              onClick={() => onDateSelect(new Date(year, month, day))}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-[14px] font-bold transition-all
                ${isSelected
                  ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/30 scale-110'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                {day}
              </div>
              <div className="absolute -bottom-1 flex gap-0.5">
                {dots.map((dotClass, idx) => (
                  <div key={idx} className={`w-1 h-1 rounded-full ${dotClass} ${isSelected ? 'brightness-150' : ''}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
