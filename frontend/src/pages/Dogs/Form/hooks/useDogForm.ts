import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dogApi } from '@/api/dogApi';
import type { DogCreateRequest, DogUpdateRequest } from '@/types/dog';

export const useDogForm = (id?: string) => {
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    birthDate: '',
    weight: '',
    profileImageUrl: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      const fetchDogData = async () => {
        try {
          setIsFetching(true);
          const data = await dogApi.getDogById(Number(id));
          if (!data) throw new Error('데이터가 없습니다.');
          
          setFormData({
            name: data.name || '',
            breed: data.breed || '',
            birthDate: data.birthDate || '',
            weight: data.weight?.toString() || '',
            profileImageUrl: data.profileImageUrl || ''
          });
          if (data.profileImageUrl) setPreviewImage(data.profileImageUrl);
        } catch (err: any) {
          alert('정보를 불러오지 못했습니다.');
          navigate('/dogs');
        } finally {
          setIsFetching(false);
        }
      };
      fetchDogData();
    }
  }, [id, isEdit, navigate]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setFormData(prev => ({ ...prev, profileImageUrl: '' }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('반려견 이름은 필수입니다! 🐾');
      return;
    }

    const payload: DogCreateRequest | DogUpdateRequest = {
      name: formData.name.trim(),
      breed: formData.breed.trim() || null,
      birthDate: formData.birthDate || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      profileImageUrl: formData.profileImageUrl.trim() || null
    };

    try {
      setIsLoading(true);
      if (isEdit && id) {
        await dogApi.updateDog(Number(id), payload);
        alert('성공적으로 수정되었습니다! ✨');
      } else {
        await dogApi.createDog(payload);
        alert('새로운 가족이 등록되었습니다! 🐶');
      }
      navigate('/dogs');
    } catch (err: any) {
      alert(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    isFetching,
    previewImage,
    handleImageChange,
    handleSave,
    isEdit
  };
};
