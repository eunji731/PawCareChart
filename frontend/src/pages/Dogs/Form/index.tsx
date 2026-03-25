import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/common/Section';
import { Input } from '@/components/common/Input';
import { FormActions } from '@/components/common/FormActions';
import { ImageUpload } from '@/pages/Dogs/Form/components/ImageUpload';
import { useDogForm } from '@/pages/Dogs/Form/hooks/useDogForm';
import { ConfirmModal } from '@/components/common/ConfirmModal';

const DogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    isLoading,
    isFetching,
    previewImage,
    handleImageChange,
    handleSave,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleConfirmDelete,
    isEdit
  } = useDogForm(id);

  if (isFetching) {
    return (
      <PageLayout title="로딩 중..." description="데이터를 불러오고 있습니다.">
        <div className="py-20 text-center font-black text-stone-400">잠시만 기다려주세요... 🦴</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={isEdit ? '반려견 정보 수정' : '새 반려견 등록'} 
      description={isEdit ? '소중한 가족의 정보를 업데이트합니다.' : '새로운 가족을 멍케어차트에 등록해주세요.'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <Section className="flex justify-center py-10">
          <ImageUpload 
            imageUrl={previewImage || formData.profileImageUrl} 
            onChange={handleImageChange} 
          />
        </Section>

        <Section title="기본 프로필">
          <div className="space-y-5">
            <Input label="이름 *" placeholder="예: 초코, 뭉치" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input label="견종" placeholder="예: 푸들, 말티즈, 믹스" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="생년월일" type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
              <Input label="몸무게 (kg)" type="number" step="0.01" placeholder="0.00" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
            </div>
          </div>
        </Section>

        <FormActions 
          onCancel={() => navigate(-1)} 
          onSave={handleSave} 
          onDelete={isEdit ? () => setIsDeleteModalOpen(true) : undefined}
          isSubmitting={isLoading} 
          saveLabel={isEdit ? '수정 완료' : '등록하기'} 
        />
      </div>

      {/* 공통 컴포넌트 재사용 */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title={`${formData.name} 삭제`}
        description={`정말로 정보를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
        confirmText="삭제하기"
        variant="danger"
        loading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </PageLayout>
  );
};

export default DogFormPage;
