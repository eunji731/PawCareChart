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
          // 기존 프로필 이미지를 공통 훅에 세팅
          photoUploader.setInitialUrls([dogData.profileImageUrl]);
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

      // 현재 유효한 이미지 URL (기존 유지 or 삭제됐으면 null)
      let finalProfileImageUrl: string | null = photoUploader.existingUrls[0] || null;

      // 1단계: dog 엔티티 저장 (신규는 ID 확보 목적)
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
        const response = await dogApi.createDog(dogPayload);
        const created = (response as any).data || response;
        currentDogId = created.id;
      }

      // 2단계: 새로 선택한 파일이 있으면 공통 훅으로 업로드
      if (photoUploader.hasNewFiles) {
        try {
          const uploaded = await photoUploader.upload(currentDogId);
          if (uploaded && uploaded.length > 0) {
            finalProfileImageUrl = uploaded[0].fileUrl || null;
          }
        } catch (uploadErr) {
          console.error('파일 업로드 실패:', uploadErr);
        }

        // 3단계: 업로드 URL로 dog 엔티티 업데이트
        if (finalProfileImageUrl) {
          await dogApi.updateDog(currentDogId, {
            ...dogPayload,
            profileImageUrl: finalProfileImageUrl,
          });
        }
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
