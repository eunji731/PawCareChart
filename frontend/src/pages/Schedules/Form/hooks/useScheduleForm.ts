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

        if (data) {
          const datePart = data.scheduleDate ? data.scheduleDate.split('T')[0] : new Date().toISOString().split('T')[0];
          const timePart = data.scheduleDate && data.scheduleDate.includes('T') 
            ? data.scheduleDate.split('T')[1].substring(0, 5) 
            : '10:00';

          setFormData({
            dogId: data.dogId?.toString() || '',
            title: data.title || '',
            scheduleDate: datePart,
            scheduleTime: timePart,
            scheduleTypeCode: data.scheduleTypeCode || 'MEDICAL',
            memo: data.memo || '',
            symptomTags: data.symptomTags || []
          });

          // 기존 첨부파일 로드
          if (files && files.length > 0) {
            fileUploader.setInitialFiles(files);
          }
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

      // 1. 로컬 파일 먼저 업로드
      let uploadedFileIds: number[] = [];
      if (fileUploader.localFiles.length > 0) {
        try {
          const uploadedFiles = await fileUploader.upload();
          if (uploadedFiles) {
            uploadedFileIds = uploadedFiles.map(f => f.id);
          }
        } catch (uploadErr: any) {
          console.error('File Upload Error:', uploadErr);
          throw new Error(uploadErr.response?.data?.message || '파일 업로드 중 오류가 발생했습니다. 허용되지 않는 파일 형식이거나 용량이 너무 큽니다.');
        }
      }

      // 2. 최종 파일 ID 목록 생성
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
      // 구체적인 에러 메시지가 있으면 보여주고, 없으면 기본 메시지 출력
      alert(err.message || err.response?.data?.message || '저장 중 오류가 발생했습니다.');
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
