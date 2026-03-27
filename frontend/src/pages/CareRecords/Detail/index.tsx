import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useCareRecordDetail } from './hooks/useCareRecordDetail';
import { CareRecordDetailHeader } from './components/CareRecordDetailHeader';
import { CareRecordInfoSections } from './components/CareRecordInfoSections';
import { CareRecordAttachmentGallery } from './components/CareRecordAttachmentGallery';

const CareRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { record, files, isLoading, error } = useCareRecordDetail(id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    // 실제 삭제 API 연동 자리
    console.log('Deleting record:', id);
    setIsDeleteModalOpen(false);
    navigate('/care-records');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#FF6B00] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm w-full p-12 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <span className="text-5xl mb-6 block grayscale opacity-20">📄</span>
          <h2 className="text-[22px] font-black text-[#2D2D2D] mb-3 tracking-tight">기록을 찾을 수 없습니다.</h2>
          <p className="text-stone-500 font-medium mb-10 leading-relaxed text-sm px-4 break-keep">
            삭제된 기록이거나 <br /> 잘못된 접근입니다.
          </p>
          <button 
            onClick={() => navigate('/care-records')}
            className="w-full h-[56px] bg-[#FF6B00] text-white rounded-[16px] font-black text-[15px] shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F9] pb-32">
      {/* 
        App-like Narrow Container: 
        Max-width 760px prevents the "PC Blog Layout" text spreading out too far, 
        giving a focused, native mobile/tablet application feel.
      */}
      <PageLayout title="" maxWidth="max-w-[760px]">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pt-6 lg:pt-8 pb-16 space-y-8 lg:space-y-10">
          
          {/* Header Block */}
          <CareRecordDetailHeader 
            record={record} 
            onDelete={() => setIsDeleteModalOpen(true)} 
          />

          {/* Data Widgets (Grid Cards) */}
          <section>
            <CareRecordInfoSections record={record} />
          </section>

          {/* Diary Note Card */}
          <section className="bg-white rounded-[28px] lg:rounded-[36px] p-8 lg:p-10 shadow-sm border border-stone-200/60 min-h-[220px]">
            <h3 className="flex items-center gap-2.5 text-[15px] font-black text-[#2D2D2D] mb-6 tracking-widest uppercase">
              <span className="text-[18px]">📝</span> Diary Note 
            </h3>
            <div className="text-[16px] md:text-[17px] leading-[1.9] md:leading-[2.1] text-stone-700 font-medium whitespace-pre-wrap word-break-keep-all text-justify">
              {record.note ? record.note : (
                <span className="text-stone-400 italic font-light tracking-tight">작성된 메모가 없습니다. 증상이나 특별한 관찰 사항을 기록해보세요.</span>
              )}
            </div>
          </section>

          {/* Attachment Gallery Card */}
          {files && files.length > 0 && (
             <section className="bg-white rounded-[28px] lg:rounded-[36px] p-8 lg:p-10 shadow-sm border border-stone-200/60">
              <CareRecordAttachmentGallery files={files} />
            </section>
          )}

        </div>
      </PageLayout>

      {/* Delete Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title="기록 영구 삭제"
        description="이 동물 차트 기록 공간을 완전히 지우시겠습니까? 포함된 사진과 처방 데이터 모두 복구할 수 없습니다."
        confirmText="영구 삭제합니다"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default CareRecordDetailPage;
