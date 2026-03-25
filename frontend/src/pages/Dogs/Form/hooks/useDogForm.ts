import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dogApi } from '@/api/dogApi';
import { fileApi } from '@/api/fileApi';
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

  // ============ 프로필 사진 상태 (직접 관리) ============
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null); // 서버에 저장된 기존 URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);           // 새로 선택한 파일
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);             // 새 파일의 blob 미리보기

  // FileUploader 컴포넌트에 넘길 displayUrls 계산
  // 우선순위: 새 미리보기 > 기존 서버 URL > 빈 배열
  const profileDisplayUrls: string[] = previewUrl
    ? [previewUrl]
    : existingImageUrl
      ? [existingImageUrl]
      : [];

  // blob URL 메모리 정리
  const revokePreview = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  useEffect(() => {
    return () => revokePreview();
  }, [revokePreview]);

  // ============ FileUploader에 넘길 핸들러 ============

  // 📷 카메라로 파일 선택 완료 시 (FileUploader의 onFileSelect)
  const handleProfileSelect = (files: File[]) => {
    if (files.length === 0) return;
    revokePreview();
    const file = files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setExistingImageUrl(null); // 새 파일 선택하면 기존 URL은 무효화
  };

  // ✕ 사진 삭제 클릭 시 (FileUploader의 onFileDelete)
  const handleProfileDelete = (_index: number) => {
    revokePreview();
    setSelectedFile(null);
    setPreviewUrl(null);
    setExistingImageUrl(null);
  };

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
          // 기존 프로필 이미지 URL 세팅
          if (dogData.profileImageUrl) {
            setExistingImageUrl(dogData.profileImageUrl);
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
      let finalProfileImageUrl: string | null = existingImageUrl; // 기본: 기존 이미지 유지 (삭제했으면 null)

      // 1단계: dog 엔티티 먼저 저장 (신규는 ID 확보 목적)
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
        // apiClient 인터셉터가 껍데기를 까주므로 response.data가 실제 데이터
        const created = (response as any).data || response;
        currentDogId = created.id;
      }

      // 2단계: 새로 선택한 파일이 있으면 업로드
      if (selectedFile) {
        try {
          const uploaded = await fileApi.uploadFiles({
            targetType: 'DOG',
            targetId: currentDogId,
            files: [selectedFile],
          });

          // 업로드 결과에서 URL 추출
          const uploadedFiles = Array.isArray(uploaded) ? uploaded : [];
          if (uploadedFiles.length > 0) {
            finalProfileImageUrl = uploadedFiles[0].fileUrl || null;
          }
        } catch (uploadErr) {
          console.error('파일 업로드 실패:', uploadErr);
          // 업로드 실패해도 나머지 정보는 저장된 상태
        }

        // 3단계: 업로드된 URL로 dog 엔티티 업데이트
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
    // 사진 관련 (FileUploader 컴포넌트에 전달)
    profileDisplayUrls,
    handleProfileSelect,
    handleProfileDelete,
  };
};
