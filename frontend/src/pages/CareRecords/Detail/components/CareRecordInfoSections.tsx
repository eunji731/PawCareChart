import React from 'react';
import type { CareRecord } from '@/types/care';

interface CareRecordInfoSectionsProps {
  record: CareRecord;
}

export const CareRecordInfoSections: React.FC<CareRecordInfoSectionsProps> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
      
      {/* Amount Card (Highlight) */}
      {record.amount !== undefined && record.amount !== null && (
        <div className="col-span-2 md:col-span-1 bg-[#FF6B00] rounded-[24px] lg:rounded-[32px] p-6 lg:p-7 flex flex-col justify-between min-h-[140px] shadow-lg shadow-[#FF6B00]/20">
          <span className="text-white/70 text-[11px] font-black uppercase tracking-widest opacity-90">Total Amount</span>
          <div className="mt-4 break-words">
            <span className="text-white text-[28px] md:text-[32px] font-black tracking-tighter tabular-nums leading-none">
              {record.amount.toLocaleString()}
            </span>
            <span className="text-white/80 text-[13px] font-bold ml-1">KRW</span>
          </div>
        </div>
      )}

      {/* Clinic / Category Card */}
      <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-7 flex flex-col justify-between min-h-[140px] shadow-sm border border-stone-200/60">
        <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">
           {isMedical ? '방문 병원' : '지출 카테고리'}
        </span>
        <div className="mt-4 text-[#2D2D2D] text-[18px] lg:text-[20px] font-black tracking-tight leading-snug break-keep">
          {isMedical ? (record.clinicName || '-') : record.categoryCode}
        </div>
      </div>

      {/* Diagnosis Card (If Medical) */}
      {isMedical && (
        <div className="col-span-2 md:col-span-1 bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-7 flex flex-col justify-between min-h-[140px] shadow-sm border border-stone-200/60">
          <span className="text-stone-400 text-[11px] font-black uppercase tracking-widest">진단 / 치료명</span>
          <div className="mt-4 text-[#2D2D2D] text-[18px] lg:text-[20px] font-black tracking-tight leading-snug break-keep">
            {record.diagnosis || '-'}
          </div>
        </div>
      )}

      {/* Medication Status Card (If Active or Completed) */}
      {isMedical && record.medicationStatus !== 'NONE' && (
        <div className={`col-span-2 md:col-span-3 rounded-[24px] lg:rounded-[32px] p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border shadow-sm
          ${record.medicationStatus === 'ACTIVE' ? 'bg-[#FF6B00]/5 border-[#FF6B00]/20' : 'bg-green-50/50 border-green-200/50'}
        `}>
          <div className="flex items-center gap-4 pl-2 lg:pl-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[24px] shadow-sm shrink-0 border
              ${record.medicationStatus === 'ACTIVE' ? 'bg-white text-[#FF6B00] border-orange-100' : 'bg-white text-green-600 border-green-100'}`}>
              💊
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[11px] font-black text-stone-500 uppercase tracking-widest">Medication Status</span>
               <span className="text-[15px] font-black text-[#2D2D2D]">현재 약물 치료를 진행 중이신가요?</span>
            </div>
          </div>
          <span className={`px-5 py-3.5 rounded-[16px] text-[13px] font-black tracking-widest uppercase text-center shrink-0 w-full sm:w-auto
            ${record.medicationStatus === 'ACTIVE' ? 'bg-[#FF6B00] text-white shadow-xl shadow-orange-500/20' : 'bg-green-600 text-white shadow-xl shadow-green-500/20'}
          `}>
            {record.medicationStatus === 'ACTIVE' ? '복약 진행중' : '복약 완료'}
          </span>
        </div>
      )}

    </div>
  );
};
