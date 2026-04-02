import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/common/Button';
import { Section } from '@/components/common/Section';
import { FileUploader } from '@/components/common/FileUploader';
import { useCareRecordForm } from './hooks/useCareRecordForm';
import { CommonInfoForm } from './components/CommonInfoForm';
import { MedicalForm } from './components/MedicalForm';
import { ExpenseForm } from './components/ExpenseForm';
import { ConfirmModal } from '@/components/common/ConfirmModal';

const CareRecordFormPage = () => {
  const { id } = useParams(); // 수정 모드 대비
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    recordType, setRecordType,
    commonData, setCommonData,
    medicalData, setMedicalData,
    expenseData, setExpenseData,
    fileUploader,
    handleSave,
    isLoading,
    isFetching
  } = useCareRecordForm(id);

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#FCFAF8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#FF6B00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      <PageLayout title="" maxWidth="max-w-[1000px]">
        {/* 1. HERO HEADER */}
        <header className="pt-12 pb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-stone-100 mb-12">
          <div className="space-y-4">
            <h1 className="text-[48px] lg:text-[56px] font-black text-[#2D2D2D] leading-[0.95] tracking-tight">
              {isEdit ? 'Update' : 'New'} <span className="text-[#FF6B00]">Record.</span>
            </h1>
            <p className="text-[17px] text-stone-400 font-medium max-w-xl">
              반려견의 건강 활동과 지출 내역을 기록하여 소중한 데이터로 보관하세요.
            </p>
          </div>
          <div className="flex gap-3 pb-1">
            <Button variant="ghost" onClick={() => navigate(-1)} className="px-6 font-bold text-stone-400">취소</Button>
            <Button onClick={handleSave} disabled={isLoading || isFetching} className="px-10 h-[64px] text-[16px] shadow-2xl">
              {isLoading ? (isEdit ? '수정 중...' : '저장 중...') : (isEdit ? '기록 수정하기' : '기록 완료하기')}
            </Button>
          </div>
        </header>

        <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* 2. 공통 정보 영역 */}
          <CommonInfoForm data={commonData} onChange={setCommonData} />

          {/* 3. 기록 유형 선택 (중앙 탭) */}
          <div className="flex justify-center -my-4 relative z-10">
            <div className="flex p-2 bg-[#F5F5F5] rounded-[24px] shadow-inner w-full max-w-sm border border-white">
              {(['MEDICAL', 'EXPENSE'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRecordType(type)}
                  className={`flex-1 py-3.5 rounded-[18px] text-[14px] font-black transition-all duration-500 active:scale-95 ${recordType === type
                    ? 'bg-white text-[#FF6B00] shadow-[0_8px_20px_rgba(0,0,0,0.06)]'
                    : 'text-stone-400 hover:text-stone-600'
                    }`}
                >
                  {type === 'MEDICAL' ? '병원 방문' : '지출 내역'}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 유형별 상세 폼 */}
          <div className="transition-all duration-500">
            {recordType === 'MEDICAL' ? (
              <MedicalForm data={medicalData} onChange={setMedicalData} />
            ) : (
              <ExpenseForm data={expenseData} onChange={setExpenseData} />
            )}
          </div>

          {/* 5. 파일 업로드 영역 */}
          <Section title="첨부파일" description="이미지, 처방전, 영수증 등을 자유롭게 첨부하세요.">
            <div className="pt-2">
              <FileUploader
                variant="grid"
                mode="multiple"
                maxCount={10}
                fileInfos={fileUploader.fileInfos} // displayUrls 대신 fileInfos 사용
                onFileSelect={(files) => fileUploader.handleSelect(files, 10)}
                onFileDelete={fileUploader.handleDelete}
                loading={fileUploader.isUploading}
              />
            </div>
          </Section>

          {/* 하단 중복 액션 (사용자 편의) */}
          <div className="pt-10 flex justify-center">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={isLoading || isFetching}
              className="w-full max-w-sm h-[64px] text-[17px] shadow-2xl"
            >
              {isLoading ? (isEdit ? '수정 중...' : '저장 중...') : (isEdit ? '기록 수정 완료' : '기록 저장 및 완료')}
            </Button>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default CareRecordFormPage;
