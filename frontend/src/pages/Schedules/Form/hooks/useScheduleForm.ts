import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleApi } from '@/api/scheduleApi';
import { dogApi } from '@/api/dogApi';
import { fileApi } from '@/api/fileApi';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { ScheduleType } from '@/types/schedule';
import type { Dog } from '@/types/dog';

export const useScheduleForm = (id?: string) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const [dogs, setDogs] = useState<Dog[]>([]);
  
  // 1. 도메인 'SCHEDULE' 지정
  const fileUploader = useFileUpload('SCHEDULE');

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
        console.log(`Loading schedule detail for ID: ${id}`);
        
        const [data, files] = await Promise.all([
          scheduleApi.getScheduleDetail(Number(id)),
          fileApi.getFiles('SCHEDULE', Number(id)).catch(err => {
            console.warn('Files not found or error loading files:', err);
            return [];
          })
        ]);

        console.log('Loaded schedule data:', data);
        console.log('Loaded schedule files:', files);

        setFormData({
          dogId: data.dogId.toString(),
          title: data.title,
          scheduleDate: data.scheduleDate.split('T')[0],
          scheduleTime: data.scheduleDate.split('T')[1].substring(0, 5),
          scheduleTypeCode: data.scheduleTypeCode,
          memo: data.memo || '',
          symptomTags: data.symptomTags || []
        });

        // 기존 첨부파일 로드
        if (files && files.length > 0) {
          fileUploader.setInitialFiles(files);
        }

      } catch (err) {
        console.error('Failed to load schedule:', err);
        alert('일정 정보를 불러오는데 실패했습니다.');
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

      // 1. 로컬 파일 먼저 업로드 (CareRecord와 동일 로직)
      let uploadedFileIds: number[] = [];
      if (fileUploader.localFiles.length > 0) {
        const uploadedFiles = await fileUploader.upload();
        if (uploadedFiles) {
          uploadedFileIds = uploadedFiles.map(f => f.id);
        }
      }

      // 2. 최종 파일 ID 목록 생성 (기존 유지 파일 + 새로 업로드된 파일)
      const combinedFileIds = [...fileUploader.existingFileIds, ...uploadedFileIds];

      const payload = {
        dogId: Number(formData.dogId),
        title: formData.title.trim(),
        scheduleDate: `${formData.scheduleDate}T${formData.scheduleTime}:00`,
        scheduleTypeCode: formData.scheduleTypeCode,
        memo: formData.memo.trim() || undefined,
        symptomTags: formData.symptomTags,
        fileIds: combinedFileIds.length > 0 ? combinedFileIds : undefined
      };

      if (id) {
        await scheduleApi.updateSchedule(Number(id), payload);
        alert('일정이 성공적으로 수정되었습니다! ✨');
      } else {
        await scheduleApi.createSchedule(payload);
        alert('일정이 성공적으로 저장되었습니다! ✨');
      }
      
      navigate('/schedules');
    } catch (err: any) {
      console.error('Save Error:', err);
      alert(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    dogs,
    fileUploader,
    handleSave,
    isLoading,
    isFetching
  };
};
