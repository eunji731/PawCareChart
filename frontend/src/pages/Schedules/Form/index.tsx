import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/common/Button';
import { Section } from '@/components/common/Section';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { TagInput } from '@/components/common/TagInput';
import { useScheduleForm } from './hooks/useScheduleForm';

const ScheduleFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    formData,
    setFormData,
    dogs,
    handleSave,
    isLoading,
    isFetching
  } = useScheduleForm(id);

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
              {isEdit ? 'Edit' : 'New'} <span className="text-[#FF6B00]">Plan.</span>
            </h1>
            <p className="text-[17px] text-stone-400 font-medium max-w-xl">
              우리 아이의 건강을 위한 미래의 일정을 계획하고 꼼꼼하게 관리하세요.
            </p>
          </div>
          <div className="flex gap-3 pb-1">
            <Button variant="ghost" onClick={() => navigate(-1)} className="px-6 font-bold text-stone-400">취소</Button>
            <Button onClick={handleSave} disabled={isLoading} className="px-10 h-[64px] text-[16px] shadow-2xl">
              {isLoading ? '저장 중...' : (isEdit ? '일정 수정하기' : '일정 예약하기')}
            </Button>
          </div>
        </header>

        <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* 2. 대상 및 유형 선택 */}
          <Section title="기본 정보" description="누구의 어떤 일정인가요?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="반려견 선택"
                value={formData.dogId}
                onChange={(e) => setFormData({ ...formData, dogId: e.target.value })}
                options={[
                  { label: '아이를 선택해주세요', value: '' },
                  ...dogs.map(d => ({ label: d.name, value: d.id.toString() }))
                ]}
              />
              <Select
                label="일정 유형"
                value={formData.scheduleTypeCode}
                onChange={(e) => setFormData({ ...formData, scheduleTypeCode: e.target.value as any })}
                options={[
                  { label: '🏥 병원 진료', value: 'MEDICAL' },
                  { label: '✂️ 미용 예약', value: 'GROOMING' },
                  { label: '💊 복약/영양제', value: 'MEDICATION' },
                  { label: '🩺 정기 검진', value: 'CHECKUP' },
                  { label: '📅 기타 일정', value: 'ETC' },
                ]}
              />
            </div>
          </Section>

          {/* 3. 일정 상세 */}
          <Section title="상세 일정" description="언제, 어떤 활동을 계획하시나요?">
            <div className="space-y-6">
              <Input
                label="일정 제목"
                placeholder="예: 튼튼동물병원 정기검진"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="날짜"
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                />
                <Input
                  label="시간"
                  type="time"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* 4. 메모 및 태그 */}
          <Section title="추가 메모" description="일정 시 참고할 사항이나 증상을 미리 적어보세요.">
            <div className="space-y-8">
              <TagInput
                label="관련 증상 키워드 (선택)"
                placeholder="예: 구토, 설사, 가려움"
                tags={formData.symptomTags}
                suggestions={['구토', '설사', '무기력', '식욕부진', '가려움']}
                onChange={(tags) => setFormData({ ...formData, symptomTags: tags })}
              />
              <Textarea
                label="상세 메모"
                placeholder="수의사 선생님께 여쭤볼 내용이나 미용 시 주의사항을 적어주세요."
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                rows={5}
              />
            </div>
          </Section>

          {/* 하단 저장 버튼 */}
          <div className="pt-10 flex justify-center">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={isLoading}
              className="w-full max-w-sm h-[64px] text-[17px] shadow-2xl"
            >
              {isLoading ? '저장 중...' : (isEdit ? '일정 수정 완료' : '일정 예약 완료')}
            </Button>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default ScheduleFormPage;
