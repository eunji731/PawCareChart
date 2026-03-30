import React from 'react';
import type { CareRecord } from '@/types/care';

interface CareRecordInfoSectionsProps {
  record: CareRecord;
}

export const CareRecordInfoSections: React.FC<CareRecordInfoSectionsProps> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';

  // 백엔드가 하위 객체나 스네이크 케이스로 데이터를 던졌을 경우를 위한 안전한 맵핑 방어 코드
  const rawRecord = record as any;
  const getField = (camelField: string, snakeField: string) => 
    rawRecord[camelField] || rawRecord[snakeField] || rawRecord.medicalDetails?.[camelField] || rawRecord.medical_details?.[snakeField];

  const medDays = getField('medicationDays', 'medication_days');
  const medStart = getField('medicationStartDate', 'medication_start_date');
  
  // 복약 상태 추론 로직 (medicationStatus 가 명시되지 않았고 is_medication_completed 가 존재한다면 자동 맵핑)
  let medStatus = record.medicationStatus;
  const isMedCompletedRaw = rawRecord.is_medication_completed ?? rawRecord.medicalDetails?.is_medication_completed;
  if (!medStatus && isMedCompletedRaw !== undefined && isMedCompletedRaw !== null) {
      medStatus = isMedCompletedRaw ? 'COMPLETED' : 'ACTIVE';
  } else if (!medStatus && medDays) {
      medStatus = 'ACTIVE'; // 처방 기간이 있다면 최소한 ACTIVE로 간주
  }

  return (
    <div className={`flex flex-col md:grid gap-3 lg:gap-4 ${isMedical ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      
      {/* Amount Card (Highlight) */}
      {record.amount !== undefined && record.amount !== null && (
        <div className="bg-[#FF6B00] rounded-[20px] md:rounded-[24px] lg:rounded-[32px] p-5 md:p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-lg shadow-[#FF6B00]/20">
          <span className="text-white/70 text-[11px] font-black uppercase tracking-widest opacity-90">Total Amount</span>
          <div className="mt-0 md:mt-4 flex items-end">
            <span className="text-white text-[24px] md:text-[28px] lg:text-[32px] font-black tracking-tighter tabular-nums leading-none">
              {record.amount.toLocaleString()}
            </span>
            <span className="text-white/80 text-[12px] md:text-[13px] font-bold ml-1 mb-0.5 md:mb-0">KRW</span>
          </div>
        </div>
      )}

      {/* Clinic / Category Card */}
      <div className="bg-white rounded-[20px] md:rounded-[24px] lg:rounded-[32px] p-5 md:p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-sm border border-stone-200/60">
        <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">
           {isMedical ? '방문 병원' : '지출 카테고리'}
        </span>
        <div className="mt-0 md:mt-4 text-[#2D2D2D] text-[15px] md:text-[18px] lg:text-[20px] font-black tracking-tight leading-snug break-keep">
          {isMedical ? (record.clinicName || '-') : record.categoryCode}
        </div>
      </div>

      {/* Diagnosis Card (If Medical) */}
      {isMedical && (
        <div className="bg-white rounded-[20px] md:rounded-[24px] lg:rounded-[32px] p-5 md:p-6 lg:p-7 flex flex-row md:flex-col justify-between items-center md:items-start md:min-h-[140px] shadow-sm border border-stone-200/60">
          <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">진단 / 치료명</span>
          <div className="mt-0 md:mt-4 text-[#2D2D2D] text-[15px] md:text-[18px] lg:text-[20px] font-black tracking-tight leading-snug break-keep">
            {record.diagnosis || '-'}
          </div>
        </div>
      )}

      {/* Medication Status Card (If Active or Completed) */}
      {isMedical && medStatus && medStatus !== 'NONE' && (
        <div className={`col-span-1 md:col-span-3 rounded-[20px] md:rounded-[24px] lg:rounded-[32px] p-5 lg:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-5 border shadow-sm
          ${medStatus === 'ACTIVE' ? 'bg-[#FF6B00]/5 border-[#FF6B00]/20' : 'bg-green-50/50 border-green-200/50'}
        `}>
          <div className="flex items-start md:items-center gap-3 md:gap-4 md:pl-2">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[20px] md:text-[24px] shadow-sm shrink-0 border
              ${medStatus === 'ACTIVE' ? 'bg-white text-[#FF6B00] border-orange-100' : 'bg-white text-green-600 border-green-100'}`}>
              💊
            </div>
            <div className="flex flex-col gap-1 md:gap-0.5 mt-0.5 md:mt-0">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] md:text-[11px] font-black text-stone-500 uppercase tracking-widest">Medication</span>
                 {medDays && (
                   <span className="text-[10px] font-black text-[#FF6B00] bg-white border border-[#FF6B00]/20 px-1.5 py-0.5 rounded shadow-sm">
                     {medDays}일치 처방
                   </span>
                 )}
               </div>
               <span className="text-[14px] md:text-[15px] font-black text-[#2D2D2D] mt-1 md:mt-0.5">
                 {medStart 
                   ? `${medStart} 부터 투약 진행` 
                   : '복약 진행 내역'}
               </span>
            </div>
          </div>
          <span className={`w-full md:w-auto px-4 py-3 md:px-5 md:py-3.5 rounded-[12px] md:rounded-[16px] text-[12px] md:text-[13px] font-black tracking-widest uppercase text-center shrink-0
            ${medStatus === 'ACTIVE' ? 'bg-[#FF6B00] text-white shadow-xl shadow-orange-500/20' : 'bg-green-600 text-white shadow-xl shadow-green-500/20'}
          `}>
            {medStatus === 'ACTIVE' ? '복약 진행중' : '복약 완료'}
          </span>
        </div>
      )}

    </div>
  );
};
