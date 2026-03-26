import React from 'react';
import type { CareRecord } from '@/types/care';
import { Badge } from '@/components/common/Badge';

interface TimelineItemProps {
  record: CareRecord;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';

  return (
    <div className="relative pl-8 pb-10 group">
      {/* 수직 타임라인 선 */}
      <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-orange-100 group-last:bg-transparent" />

      {/* 노드 포인트 */}
      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 
        ${isMedical ? 'bg-emerald-400 ring-4 ring-emerald-50' : 'bg-amber-400 ring-4 ring-amber-50'}`}
      />

      <div className="bg-white rounded-[24px] p-5 border border-orange-50 shadow-sm hover:shadow-md hover:border-orange-100 transition-all cursor-pointer group/card">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge color={isMedical ? 'emerald' : 'amber'}>
              {isMedical ? '병원' : '지출'}
            </Badge>
            <h4 className="font-black text-stone-800 text-[16px] tracking-tight group-hover/card:text-amber-600 transition-colors">
              {record.title}
            </h4>
          </div>
          {record.amount !== undefined && (
            <span className="font-black text-stone-800 text-[15px] bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
              {record.amount.toLocaleString()}원
            </span>
          )}
        </div>

        <div className="space-y-2">
          {isMedical && (
            <div className="flex flex-wrap gap-2 text-[13px] text-stone-500 font-bold items-center">
              <span className="flex items-center gap-1">🏥 {record.clinicName || '병원명 미등록'}</span>
              {record.diagnosis && (
                <>
                  <span className="text-stone-300">|</span>
                  <span>✨ {record.diagnosis}</span>
                </>
              )}
            </div>
          )}

          {!isMedical && record.categoryCode && (
            <p className="text-[13px] text-stone-400 font-bold flex items-center gap-1">
              🏷️ <span className="bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100">{record.categoryCode}</span>
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <span className="text-[11px] text-stone-400 font-black tracking-tight flex items-center gap-1">
              📅 {record.recordDate}
            </span>

            {isMedical && record.medicationStatus === 'ACTIVE' && (
              <span className="text-[11px] text-emerald-600 font-black bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 animate-pulse">
                💊 복약 중
              </span>
            )}

            {record.attachmentCount > 0 && (
              <span className="text-[11px] text-stone-400 font-bold bg-stone-50 px-2 py-1 rounded-lg border border-stone-100 flex items-center gap-1">
                📎 {record.attachmentCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
