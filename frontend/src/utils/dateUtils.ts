import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  getDate
} from 'date-fns';
import { ko } from 'date-fns/locale';
import type { CareRecord } from '@/types/care';

/**
 * 달력에 표시할 날짜 정보 타입
 */
export interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayNumber: number;
}

/**
 * 특정 월의 달력 데이터를 생성합니다. (이전달/다음달 일부 포함 가능)
 */
export const buildCalendarDays = (currentMonth: Date): CalendarDay[] => {
  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));
  const today = new Date();

  return eachDayOfInterval({ start, end }).map(date => ({
    date,
    dateString: format(date, 'yyyy-MM-dd'),
    isCurrentMonth: isSameMonth(date, currentMonth),
    isToday: isSameDay(date, today),
    dayNumber: getDate(date),
  }));
};

/**
 * 케어기록을 날짜별 마커로 가공합니다.
 */
export const buildMarkersByDate = (records: CareRecord[], currentMonth: Date) => {
  const markers: Record<string, { medical: boolean; expense: boolean }> = {};

  records.forEach(record => {
    const recordDate = parseISO(record.recordDate);

    // 현재 보고 있는 월의 데이터만 마킹 (필요 시 전체 마킹 가능)
    if (isSameMonth(recordDate, currentMonth)) {
      const dateKey = record.recordDate; // YYYY-MM-DD
      if (!markers[dateKey]) {
        markers[dateKey] = { medical: false, expense: false };
      }
      if (record.recordType === 'MEDICAL') markers[dateKey].medical = true;
      if (record.recordType === 'EXPENSE') markers[dateKey].expense = true;
    }
  });

  return markers;
};

/**
 * 달력 상단 월 레이블을 생성합니다. (예: 2024년 3월)
 */
export const getMonthLabel = (date: Date): string => {
  return format(date, 'yyyy년 M월', { locale: ko });
};

/**
 * 월을 이동합니다.
 */
export const moveMonth = (date: Date, offset: number): Date => {
  return offset > 0 ? addMonths(date, offset) : subMonths(date, Math.abs(offset));
};
