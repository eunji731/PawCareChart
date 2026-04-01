import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useScheduleDetail } from './hooks/useScheduleDetail';
import { ScheduleDetailHeader } from './components/ScheduleDetailHeader';
import { ScheduleDetailInfo } from './components/ScheduleDetailInfo';
import { scheduleApi } from '@/api/scheduleApi';

const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schedule, isLoading, error, refetch } = useScheduleDetail(id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await scheduleApi.deleteSchedule(Number(id));
      setIsDeleteModalOpen(false);
      navigate('/schedules');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('일정 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!schedule) return;
    try {
      await scheduleApi.toggleCompletion(schedule.id, !schedule.isCompleted);
      refetch();
    } catch (err) {
      console.error('Toggle complete failed:', err);
    }
  };

  const handleConvertToCareRecord = async () => {
    if (!id) return;
    if (!window.confirm('이 일정을 실제 케어 기록으로 전환하시겠습니까? \n완료된 기록으로 저장됩니다.')) return;
    
    try {
      const response = await scheduleApi.convertToCareRecord(Number(id));
      const careRecordId = response.careRecordId;
      alert('케어 기록으로 성공적으로 전환되었습니다! ✨');
      navigate(`/care-records/${careRecordId}`);
    } catch (err) {
      console.error('Conversion failed:', err);
      alert('기록 전환에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#FF6B00] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm w-full p-12 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <span className="text-5xl mb-6 block grayscale opacity-20">🗓️</span>
          <h2 className="text-[22px] font-black text-[#2D2D2D] mb-3 tracking-tight">일정을 찾을 수 없습니다.</h2>
          <p className="text-stone-500 font-medium mb-10 leading-relaxed text-sm px-4 break-keep">
            삭제된 일정이거나 <br /> 잘못된 접근입니다.
          </p>
          <button
            onClick={() => navigate('/schedules')}
            className="w-full h-[56px] bg-[#FF6B00] text-white rounded-xl font-black text-[15px] shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      <PageLayout title="" maxWidth="max-w-[760px]" noPaddingTop>
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pt-2 pb-16 space-y-8 lg:space-y-10">

          {/* Header Block */}
          <ScheduleDetailHeader schedule={schedule} />

          {/* Data Widgets */}
          <section>
            <ScheduleDetailInfo 
              schedule={schedule} 
              onToggleComplete={handleToggleComplete}
            />
          </section>

          {/* Note Card */}
          <section className="bg-white rounded-[28px] lg:rounded-[36px] p-8 lg:p-10 shadow-sm border border-stone-200/60 min-h-[200px]">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-5 mb-8">
              <span className="text-[20px]">📝</span>
              <h3 className="text-[16px] font-black text-[#2D2D2D] tracking-widest uppercase">
                Plan <span className="text-[#FF6B00]">Memo.</span>
              </h3>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-[12px] font-black text-stone-400 uppercase tracking-widest">
                <span className="w-1 h-3 bg-stone-200 rounded-full" /> 상세 메모 및 참고사항
              </h4>
              <div className="text-[15px] md:text-[16px] leading-[1.9] text-stone-600 font-medium whitespace-pre-wrap pl-3 border-l-2 border-stone-100">
                {schedule.memo || '작성된 메모가 없습니다.'}
              </div>
            </div>
          </section>

          {/* Action Bar */}
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-stone-100">
            <button 
              onClick={() => navigate('/schedules')}
              className="w-full sm:w-auto px-6 h-[52px] rounded-xl border border-stone-200 text-stone-600 font-bold text-[14px] hover:border-stone-400 transition-all active:scale-95"
            >
              목록
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full sm:w-auto px-6 h-[52px] rounded-xl border border-stone-200 text-stone-400 font-bold text-[14px] hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
            >
              삭제
            </button>
            <button 
              onClick={() => navigate(`/schedules/edit/${schedule.id}`)}
              className="w-full sm:w-auto px-10 h-[52px] bg-white border-2 border-[#FF6B00] text-[#FF6B00] rounded-xl font-black text-[14px] hover:bg-orange-50 active:scale-[0.98] transition-all"
            >
              수정하기
            </button>
            <button 
              onClick={handleConvertToCareRecord}
              className="w-full sm:w-auto px-10 h-[52px] bg-[#FF6B00] text-white rounded-xl font-black text-[14px] shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              ✅ 케어기록으로 전환
            </button>
          </div>

        </div>
      </PageLayout>

      {/* Delete Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title="일정 삭제"
        description="이 예약을 목록에서 영구히 삭제하시겠습니까?"
        confirmText="삭제합니다"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ScheduleDetailPage;
