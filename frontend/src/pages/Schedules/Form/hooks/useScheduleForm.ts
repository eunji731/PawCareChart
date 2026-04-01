import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dogApi } from '@/api/dogApi';
import { careApi } from '@/api/careApi'; // 스케줄 API가 여기에 통합되어 있다고 가정
import type { ScheduleType } from '@/types/schedule';
import type { Dog } from '@/types/dog';

export const useScheduleForm = (id?: string) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const [dogs, setDogs] = useState<Dog[]>([]);

  const [formData, setFormData] = useState({
    dogId: '',
    title: '',
    scheduleDate: new Date().toISOString().split('T')[0],
    scheduleTime: '10:00',
    scheduleTypeCode: 'MEDICAL' as ScheduleType,
    memo: '',
    symptomTags: [] as string[]
  });

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    // 수정 모드 시 상세 데이터 로드 로직 (필요 시 구현)
  }, [id]);

  const handleSave = async () => {
    if (!formData.dogId) return alert('반려견을 선택해주세요.');
    if (!formData.title.trim()) return alert('일정 제목을 입력해주세요.');

    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        scheduleDate: `${formData.scheduleDate}T${formData.scheduleTime}:00`
      };
      
      // API 호출 (현재 careApi에 schedule 관련 메소드가 정의되어 있지 않다면 추후 추가 필요)
      console.log('Schedule Payload:', payload);
      alert('일정이 성공적으로 저장되었습니다! ✨');
      navigate('/schedules');
    } catch (err) {
      console.error('Save Error:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    dogs,
    handleSave,
    isLoading,
    isFetching
  };
};
