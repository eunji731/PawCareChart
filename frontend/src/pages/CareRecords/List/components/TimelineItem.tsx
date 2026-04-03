import React from 'react';
import { useNavigate } from 'react-router-dom';
import { parseISO, addDays, isBefore, startOfDay, format } from 'date-fns';
import type { CareRecord } from '@/types/care';
import { Card } from '@/components/common/Card';

export const TimelineItem: React.FC<{ record: CareRecord }> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/care-records/${record.id}`);
  };

  const rawRecord = record as any;
  const getField = (camelField: string, snakeField: string) => 
    rawRecord[camelField] ?? 
    rawRecord[snakeField] ?? 
    rawRecord.medicalDetails?.[camelField] ?? 
    rawRecord.medical_details?.[snakeField] ??
    rawRecord.medicalDetails?.[snakeField] ??
    rawRecord.medical_details?.[camelField];

  // 모든 가능한 경로에서 복약 정보 추출 시도
  const medDays = Number(getField('medicationDays', 'medication_days') || 0);
  const medStart = getField('medicationStartDate', 'medication_start_date');
  const isMedCompletedRaw = getField('isMedicationCompleted', 'is_medication_completed');
  
  let medStatus = record.medicationStatus || (isMedCompletedRaw === true ? 'COMPLETED' : (isMedCompletedRaw === false ? 'ACTIVE' : undefined));
  let medEndDateStr = '';

  // 날짜 정보가 있으면 상태 계산 우선 적용
  if (medStart && medDays > 0) {
    try {
      const startDate = parseISO(medStart);
      const medEndDate = addDays(startDate, medDays - 1);
      medEndDateStr = format(medEndDate, 'yyyy-MM-dd');
      
      const completionDate = addDays(startDate, medDays);
      const today = startOfDay(new Date());
      
      if (!isBefore(today, completionDate)) {
        medStatus = 'COMPLETED';
      } else {
        medStatus = 'ACTIVE';
      }
    } catch (e) {
      console.error('Date calculation error:', e);
    }
  } else if (!medStatus && medDays > 0) {
    // 날짜는 없지만 기간 정보만 있는 경우
    medStatus = 'ACTIVE';
  }

  // 복약 정보 존재 여부 판단
  const hasMedication = !!(medStart || medDays > 0 || (medStatus && medStatus !== 'NONE'));

  return (
    <div className="group flex gap-4 md:gap-8 lg:gap-10 items-stretch relative">
      
      {/* 타임라인 축 Indicator */}
      <div className="flex flex-col items-center flex-shrink-0 pt-6 relative z-10 w-4 md:w-6">
        <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-[3px] border-white shadow-md transition-all duration-500 group-hover:scale-125 
          ${isMedical ? 'bg-[#FF6B00]' : 'bg-[#FFB380]'}`} 
        />
        <div className="w-px h-full min-h-[60px] bg-stone-200 mt-4 group-last:hidden opacity-60" />
      </div>

      {/* 실제 카드 영역 */}
      <Card 
        onClick={handleCardClick}
        className="flex-grow p-5 md:p-6 lg:p-7 mb-6 group-last:mb-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50 border-stone-100 cursor-pointer overflow-hidden relative"
      >
        {/* 상단: 타입 + 날짜 | (모바일) 금액 */}
        <div className="flex justify-between items-start md:items-center mb-3">
          <div className="flex items-center gap-3">
            <span className={`text-[9px] md:text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase
              ${isMedical ? 'bg-[#FF6B00] text-white' : 'bg-stone-100 text-stone-500'}`}>
              {record.recordType}
            </span>
            <span className="text-[13px] md:text-[14px] font-bold text-stone-400 tabular-nums tracking-tight">
              {record.recordDate}
            </span>
          </div>

          {/* 데스크탑 및 태블릿용 금액 우측 상단 표시 */}
          {record.amount !== undefined && record.amount !== null && (
            <div className="text-right hidden sm:block">
              <span className="text-[18px] md:text-[22px] font-black text-[#2D2D2D] tabular-nums tracking-tighter">
                {record.amount.toLocaleString()} 
                <span className="text-[13px] ml-0.5 text-stone-400 font-bold tracking-normal">원</span>
              </span>
            </div>
          )}
        </div>

        {/* 본문: 제목 */}
        <h4 className="text-[18px] md:text-[22px] font-black text-[#2D2D2D] tracking-tight leading-snug mb-5 pr-2 md:pr-0">
          {record.title}
        </h4>

        {/* 하단: 강아지 정보 | 카테고리/진료태그 | 첨부파일 | (모바일) 금액 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-100/80">
          
          {/* 강아지, 태그들 */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            
            {/* 강아지 아바타 & 이름 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-50 border border-stone-100 shrink-0 flex items-center justify-center">
                {record.dogProfileImageUrl ? (
                  <img src={record.dogProfileImageUrl} alt={record.dogName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[8px] grayscale opacity-40">🐕</span>
                )}
              </div>
              <span className="text-[13px] font-bold text-stone-600 tracking-tight">
                {record.dogName}
              </span>
            </div>

            <div className="hidden sm:block w-px h-3 bg-stone-200" />

            {/* 태그 정보 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold text-stone-500 bg-stone-50/80 border border-stone-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                {isMedical ? '🏥' : '🏷️'} {isMedical ? (record.clinicName || 'Clinic') : record.categoryCode}
              </span>

              {isMedical && hasMedication && (
                <span className={`text-[11px] font-black border px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm
                  ${medStatus === 'ACTIVE' 
                    ? 'text-[#FF6B00] bg-orange-50/50 border-orange-100' 
                    : 'text-green-600 bg-green-50/50 border-green-100'}`}>
                  <span className="text-[12px]">💊</span> 
                  {medStatus === 'ACTIVE' ? '복약중' : '복약완료'}
                  {medEndDateStr && <span className="opacity-60 font-bold ml-0.5">~{medEndDateStr}</span>}
                </span>
              )}

              {record.relatedMedicalRecordId && (
                <span className="text-[11px] font-black text-[#FF6B00] bg-orange-50/50 border border-orange-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <span className="text-[12px] opacity-80">🔗</span> 진료 연동
                </span>
              )}
            </div>
          </div>

          {/* 모바일용 금액 & 첨부파일 (우측 정렬) */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 gap-4">
            {/* 모바일에서만 아래로 내려오는 금액 */}
            {record.amount !== undefined && record.amount !== null && (
              <div className="sm:hidden flex items-baseline gap-1">
                <span className="text-[18px] font-black text-[#2D2D2D] tabular-nums tracking-tighter">
                  {record.amount.toLocaleString()}
                </span>
                <span className="text-[12px] text-stone-400 font-bold">원</span>
              </div>
            )}

            {/* 첨부파일 아이콘 */}
            {record.attachmentCount > 0 && (
              <div className="flex items-center gap-1.5 text-stone-400 ml-auto sm:ml-0 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                <span className="text-[12px]">📎</span>
                <span className="text-[11px] font-black tabular-nums tracking-wider">{record.attachmentCount}</span>
              </div>
            )}
          </div>

        </div>
      </Card>
    </div>
  );
};
