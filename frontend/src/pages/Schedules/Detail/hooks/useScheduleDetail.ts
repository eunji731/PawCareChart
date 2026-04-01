import { useState, useEffect, useCallback } from 'react';
import { scheduleApi } from '@/api/scheduleApi';
import { fileApi } from '@/api/fileApi'; // 추가
import type { Schedule } from '@/types/schedule';
import type { FileItem } from '@/types/file'; // 추가

export const useScheduleDetail = (id?: string) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]); // 추가
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      
      const [scheduleData, scheduleFiles] = await Promise.all([
        scheduleApi.getScheduleDetail(Number(id)),
        fileApi.getFiles('SCHEDULE', Number(id))
      ]);

      setSchedule(scheduleData);
      setFiles(scheduleFiles);
    } catch (err: any) {
      console.error('Failed to fetch schedule detail:', err);
      setError('일정 정보를 불러오는데 실패했습니다.');
      
      // 403/404 시 Mock 데이터 폴백 (개발용)
      if (!err.response || err.response.status === 403 || err.response.status === 404) {
        const mock: Schedule = {
          id: Number(id),
          dogId: 1,
          dogName: '봉봉',
          title: '튼튼동물병원 피부염 재진',
          scheduleDate: '2026-04-04T14:00:00',
          scheduleTypeCode: 'MEDICAL',
          isCompleted: false,
          memo: '지난번 약 먹고 구토한 증상 원장님께 꼭 여쭤보기. \n사료 바꾼 것도 말씀드려야 함.',
          symptomTags: ['피부염', '구토', '가려움'],
          dDay: 3
        };
        setSchedule(mock);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { schedule, files, isLoading, error, refetch: fetchDetail }; // files 추가
};
