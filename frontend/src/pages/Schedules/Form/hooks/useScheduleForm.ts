import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleApi } from '@/api/scheduleApi'; // 실제 API 임포트
import { dogApi } from '@/api/dogApi';
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
    const loadDetail = async () => {
      try {
        setIsFetching(true);
        const data = await scheduleApi.getScheduleDetail(Number(id));
        setFormData({
          dogId: data.dogId.toString(),
          title: data.title,
          scheduleDate: data.scheduleDate.split('T')[0],
          scheduleTime: data.scheduleDate.split('T')[1].substring(0, 5),
          scheduleTypeCode: data.scheduleTypeCode,
          memo: data.memo || '',
          symptomTags: data.symptomTags || []
        });
      } catch (err) {
        console.error('Failed to load schedule:', err);
        navigate('/schedules');
      } finally {
        setIsFetching(false);
      }
    };
    loadDetail();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!formData.dogId) return alert('반려견을 선택해주세요.');
    if (!formData.title.trim()) return alert('일정 제목을 입력해주세요.');

    try {
      setIsLoading(true);
      const payload = {
        dogId: Number(formData.dogId),
        title: formData.title.trim(),
        scheduleDate: `${formData.scheduleDate}T${formData.scheduleTime}:00`,
        scheduleTypeCode: formData.scheduleTypeCode,
        memo: formData.memo.trim() || undefined,
        symptomTags: formData.symptomTags
      };

      if (id) {
        await scheduleApi.updateSchedule(Number(id), payload);
      } else {
        await scheduleApi.createSchedule(payload);
      }

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
