import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Section } from '../../components/common/Section';
import { Input } from '../../components/common/Input';
import { FormActions } from '../../components/common/FormActions';
import { ImageUpload } from './components/ImageUpload';

export const DogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // DDL dogs 테이블 컬럼 기준 상태
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    birth_date: '',
    weight: '',
    profile_image_url: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 수정 모드일 때 기존 데이터 로드 (더미)
  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: '초코',
        breed: '푸들',
        birth_date: '2020-05-15',
        weight: '4.5',
        profile_image_url: ''
      });
    }
  }, [isEdit]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        // 추후 API 연동 시 file 객체를 따로 보관하거나 URL로 변환
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setFormData(prev => ({ ...prev, profile_image_url: '' }));
    }
  };

  const handleSave = () => {
    console.log('저장 데이터:', formData);
    alert(`${isEdit ? '수정' : '등록'}되었습니다!`);
    navigate('/mypage');
  };

  return (
    <PageLayout 
      title={isEdit ? '반려견 정보 수정' : '새 반려견 등록'} 
      description={isEdit ? '소중한 가족의 정보를 업데이트합니다.' : '새로운 가족을 멍케어차트에 등록해주세요.'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* 1. 프로필 이미지 섹션 */}
        <Section className="flex justify-center py-10">
          <ImageUpload 
            imageUrl={previewImage || formData.profile_image_url} 
            onChange={handleImageChange} 
          />
        </Section>

        {/* 2. 기본 정보 입력 섹션 (DDL 준수) */}
        <Section title="기본 프로필">
          <div className="space-y-5">
            <Input 
              label="이름" 
              placeholder="예: 초코, 뭉치" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="견종" 
              placeholder="예: 푸들, 말티즈, 믹스" 
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="생년월일" 
                type="date" 
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
              />
              <Input 
                label="몸무게 (kg)" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>
          </div>
        </Section>

        <FormActions 
          onCancel={() => navigate(-1)} 
          onSave={handleSave}
          saveLabel={isEdit ? '수정 완료' : '등록하기'}
        />
      </div>
    </PageLayout>
  );
};
