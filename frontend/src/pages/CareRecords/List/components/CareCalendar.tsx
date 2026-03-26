import React, { useState, useMemo } from 'react';
import type { CareRecord } from '@/types/care';
import { 
  buildCalendarDays, 
  buildMarkersByDate, 
  getMonthLabel, 
  moveMonth 
} from '@/utils/dateUtils';

interface CareCalendarProps {
  records: CareRecord[];
  selectedDate?: string;
  onDateClick?: (date: string) => void;
}

export const CareCalendar: React.FC<CareCalendarProps> = ({ records, selectedDate, onDateClick }) => {
  // 1. 상태 관리: 현재 보고 있는 월 (date-fns 연산을 위해 Date 객체 유지)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 2. 데이터 가공 (useMemo 최적화)
  
  // 달력에 표시할 날짜 배열 (이전/다음달 일부 포함)
  const calendarDays = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);

  // 현재 월의 기록 마커 집계
  const markersByDate = useMemo(() => buildMarkersByDate(records, currentMonth), [records, currentMonth]);

  // 상단 표시용 레이블 (예: 2024년 3월)
  const monthLabel = getMonthLabel(currentMonth);

  // 3. 핸들러
  const handlePrevMonth = () => setCurrentMonth(prev => moveMonth(prev, -1));
  const handleNextMonth = () => setCurrentMonth(prev => moveMonth(prev, 1));

  return (
    <div className="select-none">
      {/* 캘린더 헤더 */}
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="text-[22px] font-black text-stone-800 tracking-tight">
          {monthLabel}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-orange-50 rounded-xl text-stone-400 hover:text-amber-600 transition-all cursor-pointer border border-transparent hover:border-orange-100"
          >
            ◀
          </button>
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-orange-50 rounded-xl text-stone-400 hover:text-amber-600 transition-all cursor-pointer border border-transparent hover:border-orange-100"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
        {/* 요일 헤더 */}
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div 
            key={d} 
            className={`text-[12px] font-black pb-4 ${
              i === 0 ? 'text-red-300' : i === 6 ? 'text-blue-300' : 'text-stone-300'
            }`}
          >
            {d}
          </div>
        ))}

        {/* 날짜 셀들 */}
        {calendarDays.map((day) => {
          const { dateString, dayNumber, isCurrentMonth, isToday } = day;
          const hasMedical = markersByDate[dateString]?.medical;
          const hasExpense = markersByDate[dateString]?.expense;
          const isSelected = selectedDate === dateString;

          return (
            <div 
              key={dateString} 
              onClick={() => onDateClick?.(dateString)}
              className={`relative group cursor-pointer h-16 flex flex-col items-center justify-center rounded-2xl transition-all
                ${!isCurrentMonth ? 'opacity-20 grayscale' : ''}
                ${isSelected ? 'bg-amber-500 shadow-lg shadow-amber-100' : 'hover:bg-orange-50/50'}
              `}
            >
              <span className={`text-[16px] font-black z-10 transition-colors ${
                isSelected ? 'text-white' : isToday ? 'text-amber-600 underline underline-offset-4 decoration-2' : 'text-stone-700'
              }`}>
                {dayNumber}
              </span>

              {/* 기록 마커 영역 */}
              <div className="flex gap-1 mt-1.5 h-2 items-center justify-center">
                {hasMedical && (
                  <div className={`w-2 h-2 rounded-full shadow-sm ring-2 ${
                    isSelected ? 'bg-white ring-white/20' : 'bg-emerald-400 ring-emerald-50'
                  }`} />
                )}
                {hasExpense && (
                  <div className={`w-2 h-2 rounded-full shadow-sm ring-2 ${
                    isSelected ? 'bg-white ring-white/20' : 'bg-amber-400 ring-amber-50'
                  }`} />
                )}
              </div>

              {/* 호버 시 등록 유도 버튼 (+ 버튼) */}
              {!isSelected && isCurrentMonth && (
                <button className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 rounded-2xl border border-amber-200 transition-opacity text-amber-500 text-xl font-black">
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
