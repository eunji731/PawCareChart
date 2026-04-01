import React from 'react';
import type { CareRecord } from '@/types/care';
import { Badge } from '@/components/common/Badge';

interface CareRecordInfoSectionsProps {
  record: CareRecord;
}

export const CareRecordInfoSections: React.FC<CareRecordInfoSectionsProps> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';
  const rawRecord = record as any;
  const getField = (camelField: string, snakeField: string) => 
    rawRecord[camelField] || rawRecord[snakeField] || rawRecord.medicalDetails?.[camelField] || rawRecord.medical_details?.[snakeField];

  const medDays = getField('medicationDays', 'medication_days');
  const medStart = getField('medicationStartDate', 'medication_start_date');
  const symptomTags = record.symptomTags || getField('symptomTags', 'symptom_tags') || [];
  
  let medStatus = record.medicationStatus;
  const isMedCompletedRaw = rawRecord.is_medication_completed ?? rawRecord.medicalDetails?.is_medication_completed;
  if (!medStatus && isMedCompletedRaw !== undefined && isMedCompletedRaw !== null) {
      medStatus = isMedCompletedRaw ? 'COMPLETED' : 'ACTIVE';
  } else if (!medStatus && medDays) {
      medStatus = 'ACTIVE';
  }

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. 상단 KPI 카드 (이전 스타일 복구) */}
      <div className={`flex flex-col md:grid gap-3 lg:gap-4 ${isMedical ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        
        {/* Amount Card */}
        {record.amount !== undefined && record.amount !== null && (
          <div className="bg-[#FF6B00] rounded-[24px] p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-lg shadow-[#FF6B00]/20">
            <span className="text-white/70 text-[11px] font-black uppercase tracking-widest opacity-90">Total Amount</span>
            <div className="mt-0 md:mt-4 flex items-end">
              <span className="text-white text-[24px] md:text-[32px] font-black tracking-tighter tabular-nums leading-none">
                {record.amount.toLocaleString()}
              </span>
              <span className="text-white/80 text-[12px] font-bold ml-1 mb-0.5 md:mb-0">원</span>
            </div>
          </div>
        )}

        {/* Clinic / Category Card */}
        <div className="bg-white rounded-[24px] p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-sm border border-stone-200/60">
          <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">
             {isMedical ? '방문 병원' : '지출 카테고리'}
          </span>
          <div className="mt-0 md:mt-4 text-[#2D2D2D] text-[16px] md:text-[20px] font-black tracking-tight leading-snug break-keep">
            {isMedical ? (record.clinicName || '-') : record.categoryCode}
          </div>
        </div>

        {/* Diagnosis Card */}
        {isMedical && (
          <div className="bg-white rounded-[24px] p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-sm border border-stone-200/60">
            <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">진단 / 치료명</span>
            <div className="mt-0 md:mt-4 text-[#2D2D2D] text-[16px] md:text-[20px] font-black tracking-tight leading-snug break-keep">
              {record.diagnosis || '-'}
            </div>
          </div>
        )}
      </div>

      {/* 2. 증상 태그 (심플 스타일) */}
      {isMedical && symptomTags.length > 0 && (
        <div className="px-2 py-1">
          <div className="flex flex-wrap gap-2">
            {symptomTags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[12px] font-bold flex items-center gap-1"
              >
                <span className="text-[#FF6B00]">#</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. 복약 상태 카드 (이전 스타일 복구) */}
      {isMedical && medStatus && medStatus !== 'NONE' && (
        <div className={`rounded-[24px] p-5 lg:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-5 border shadow-sm
          ${medStatus === 'ACTIVE' ? 'bg-[#FF6B00]/5 border-[#FF6B00]/20' : 'bg-green-50/50 border-green-200/50'}
        `}>
          <div className="flex items-start md:items-center gap-4 md:pl-2">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[20px] shadow-sm shrink-0 border bg-white
              ${medStatus === 'ACTIVE' ? 'text-[#FF6B00] border-orange-100' : 'text-green-600 border-green-100'}`}>
              💊
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Medication Status</span>
               <span className="text-[14px] md:text-[15px] font-black text-[#2D2D2D] mt-0.5">
                 {medStart && medDays 
                   ? `${medStart} 부터 ${medDays}일간 투약` 
                   : medStart 
                     ? `${medStart} 부터 투약 시작`
                     : medDays
                       ? `${medDays}일간 투약 진행`
                       : '복약 진행 내역'}
               </span>
            </div>
          </div>
          <span className={`w-full md:w-auto px-5 py-3 rounded-xl text-[12px] font-black tracking-widest uppercase text-center
            ${medStatus === 'ACTIVE' ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20' : 'bg-green-600 text-white shadow-lg shadow-green-500/20'}
          `}>
            {medStatus === 'ACTIVE' ? '복약 진행중' : '복약 완료'}
          </span>
        </div>
      )}

    </div>
  );
};
