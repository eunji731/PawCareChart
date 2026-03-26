import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/common/Section';
import { Input } from '@/components/common/Input';
import { FormActions } from '@/components/common/FormActions';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { FileUploader } from '@/components/common/FileUploader';
import { useDogForm } from '@/pages/Dogs/Form/hooks/useDogForm';

const DogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    isLoading,
    isFetching,
    handleSave,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleConfirmDeleteDog,
    isEdit,
    photoUploader,
  } = useDogForm(id);

  if (isFetching) {
    return (
      <PageLayout title="" maxWidth="max-w-2xl">
        <div className="h-[600px] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-[5px] border-stone-100 border-t-[#FF6B00] rounded-full animate-spin mb-6" />
          <p className="text-stone-300 font-black tracking-widest uppercase text-sm">Retrieving Member</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      <PageLayout title="" maxWidth="max-w-2xl">
        {/* 1. HERO HEADER: 목록 페이지와 통일된 스타일 */}
        <header className="pt-12 pb-24 flex flex-col items-center text-center gap-6">
          <h1 className="text-[48px] lg:text-[56px] font-black text-[#2D2D2D] leading-[0.95] tracking-tight">
            {isEdit ? 'Update' : 'New'} <span className="text-[#FF6B00]">Profile.</span>
          </h1>
          <p className="text-[16px] text-stone-400 font-medium max-w-md word-break-keep-all">
            {isEdit 
              ? '소중한 가족의 정보를 최신 상태로 유지하고 관리하세요.' 
              : '새로운 가족을 멍케어차트의 멤버로 등록하고 기록을 시작하세요.'}
          </p>
        </header>

        <div className="flex flex-col pb-32">
          {/* 2. INTEGRATED PROFILE CARD: 사진이 카드 위에 걸쳐지는 구조 */}
          <Section className="relative mt-16 pt-20 overflow-visible">
            {/* PHOTO UPLOADER OVERLAY */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <FileUploader 
                  variant="profile"
                  mode="single"
                  displayUrls={photoUploader.displayUrls}
                  onFileSelect={(files) => photoUploader.handleSelect(files, 1)}
                  onFileDelete={photoUploader.handleDelete}
                  loading={photoUploader.isLoading}
                  maxCount={1}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-5 bg-[#FF6B00] rounded-full"></span>
                <h4 className="text-[18px] font-black text-[#2D2D2D] tracking-tight">기본 프로필 정보</h4>
              </div>

              <div className="space-y-6">
                <Input 
                  label="이름 *" 
                  placeholder="아이의 이름을 입력하세요" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                
                <Input 
                  label="견종" 
                  placeholder="예: 토이푸들, 말티즈, 믹스견" 
                  value={formData.breed} 
                  onChange={(e) => setFormData({...formData, breed: e.target.value})} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="생년월일" 
                    type="date" 
                    value={formData.birthDate} 
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
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
            </div>
          </Section>

          <FormActions 
            onCancel={() => navigate(-1)} 
            onSave={handleSave} 
            onDelete={isEdit ? () => setIsDeleteModalOpen(true) : undefined}
            isSubmitting={isLoading} 
            saveLabel={isEdit ? '수정 완료하기' : '멤버 등록하기'} 
          />
        </div>

        <ConfirmModal
          open={isDeleteModalOpen}
          title={`${formData.name}의 기록 삭제`}
          description={`정말로 정보를 삭제하시겠습니까?\n한번 삭제된 데이터는 복구할 수 없습니다.`}
          confirmText="삭제하기"
          variant="danger"
          loading={isLoading}
          onConfirm={handleConfirmDeleteDog}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </PageLayout>
    </div>
  );
};

export default DogFormPage;
