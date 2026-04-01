import { useState, useEffect, useCallback } from 'react';
import { scheduleApi } from '@/api/scheduleApi';
import type { Schedule, ScheduleFilters } from '@/types/schedule';

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ScheduleFilters>({
    type: 'ALL',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await scheduleApi.getSchedules(filters);
      setSchedules(data);
    } catch (err: any) {
      console.error('Failed to fetch schedules:', err);
      
      // 백엔드가 준비되지 않았거나 403/404 에러 시 임시 데이터 노출 (개발용)
      if (err.response?.status === 403 || err.response?.status === 404 || !err.response) {
        console.warn('Backend API not ready or forbidden. Using mock data for development.');
        const mockSchedules: Schedule[] = [
          { id: 1, dogId: 1, dogName: '봉봉', title: '튼튼동물병원 피부염 재진', scheduleDate: '2026-04-04T14:00:00', scheduleTypeCode: 'MEDICAL', isCompleted: false, memo: '약 먹고 구토한 증상 문의', symptomTags: ['피부염', '구토'], dDay: 3 },
          { id: 2, dogId: 1, dogName: '봉봉', title: '멍멍살롱 썸머컷', scheduleDate: '2026-04-15T11:00:00', scheduleTypeCode: 'GROOMING', isCompleted: false, memo: '3mm, 얼굴 가위컷', symptomTags: ['미용'], dDay: 14 },
          { id: 3, dogId: 1, dogName: '봉봉', title: '넥스가드 스펙트라', scheduleDate: '2026-04-21T09:00:00', scheduleTypeCode: 'MEDICATION', isCompleted: false, memo: '심장사상충 예방', symptomTags: [], dDay: 20 }
        ];
        setSchedules(mockSchedules);
      }
    } finally {
      setIsLoading(false); // 어떤 경우에도 로딩은 종료
    }
  }, [filters]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const updateFilter = useCallback((newFilters: Partial<ScheduleFilters>) => {
    setFilters(prev => {
      // 새로운 필터 값이 기존과 다를 때만 업데이트하여 무한 루프 방지
      const isChanged = Object.entries(newFilters).some(([key, value]) => prev[key as keyof ScheduleFilters] !== value);
      if (!isChanged) return prev;
      return { ...prev, ...newFilters };
    });
  }, []);

  return {
    schedules,
    isLoading,
    filters,
    updateFilter,
    refetch: fetchSchedules
  };
};
