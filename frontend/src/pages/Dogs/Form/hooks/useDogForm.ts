import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dogApi } from '@/api/dogApi';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { DogCreateRequest } from '@/types/dog';

export const useDogForm = (id?: string) => {
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    birthDate: '',
    weight: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 프로필 사진: 공통 훅 사용 (단일 모드)
  const photoUploader = useFileUpload('DOG');

  // ============ 초기 데이터 로드 ============
  useEffect(() => {
    if (isEdit && id) {
      const initData = async () => {
        try {
          setIsFetching(true);
          const dogData = await dogApi.getDogById(Number(id));
          setFormData({
            name: dogData.name || '',
            breed: dogData.breed || '',
            birthDate: dogData.birthDate || '',
            weight: dogData.weight?.toString() || '',
          });
          // 기존 프로필 이미지를 공통 훅에 세팅 (FileItem 형태의 객체 배열 전달)
          if (dogData.profileImageUrl) {
            photoUploader.setInitialFiles([{
              id: 0, // 프로필 이미지의 경우 단일 URL로 관리되므로 ID는 임시값 0 사용하거나 백엔드 구조에 맞춰 조정
              fileUrl: dogData.profileImageUrl,
              originalFileName: 'profile',
              storedFileName: 'profile',
              fileSize: 0,
              fileType: 'image/jpeg',
              targetType: 'DOG',
              targetId: Number(id),
              createdAt: ''
            }]);
          }
        } catch (err: any) {
          alert('정보를 불러오지 못했습니다.');
          navigate('/dogs');
        } finally {
          setIsFetching(false);
        }
      };
      initData();
    }
  }, [id, isEdit, navigate]);

  // ============ 저장 ============
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('반려견 이름은 필수입니다! 🐾');
      return;
    }

    try {
      setIsLoading(true);
      let currentDogId = Number(id);

      // 1단계: 신규 파일이 있다면 먼저 서버에 업로드하여 URL 확보
      let finalProfileImageUrl: string | null = photoUploader.existingFiles[0]?.fileUrl || null;

      if (photoUploader.hasNewFiles) {
        try {
          // targetId 없이 업로드 수행 (임시 저장 상태)
          const uploaded = await photoUploader.upload(); 
          if (uploaded && uploaded.length > 0) {
            finalProfileImageUrl = uploaded[0].fileUrl || null;
          }
        } catch (uploadErr) {
          console.error('파일 업로드 실패:', uploadErr);
        }
      }

      // 2단계: 본문 저장 (확보된 URL 포함)
      const dogPayload: DogCreateRequest = {
        name: formData.name.trim(),
        breed: formData.breed.trim() || null,
        birthDate: formData.birthDate || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        profileImageUrl: finalProfileImageUrl,
      };

      if (isEdit) {
        await dogApi.updateDog(currentDogId, dogPayload);
      } else {
        await dogApi.createDog(dogPayload);
      }

      alert('성공적으로 저장되었습니다! ✨');
      navigate('/dogs');
    } catch (err: any) {
      alert(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ 반려견 삭제 ============
  const handleConfirmDeleteDog = async () => {
    if (!id || !isEdit) return;
    try {
      setIsLoading(true);
      await dogApi.deleteDog(Number(id));
      alert('삭제되었습니다.');
      navigate('/dogs');
    } catch (err: any) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    isFetching,
    handleSave,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleConfirmDeleteDog,
    isEdit,
    // 사진 관련: 공통 훅의 인터페이스를 그대로 노출
    photoUploader,
  };
};
