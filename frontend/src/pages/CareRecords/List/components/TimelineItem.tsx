import React from 'react';
import type { CareRecord } from '@/types/care';
import { Card } from '@/components/common/Card';

export const TimelineItem: React.FC<{ record: CareRecord }> = ({ record }) => {
  const isMedical = record.recordType === 'MEDICAL';

  // 강아지 식별 정보 (인라인 메타 스타일)
  const DogIdentity = (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden bg-stone-50 border border-stone-100 shrink-0 flex items-center justify-center shadow-sm">
        {record.dogProfileImageUrl ? (
          <img src={record.dogProfileImageUrl} alt={record.dogName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] grayscale opacity-40">🐕</span>
        )}
      </div>
      <span className="text-[14px] lg:text-[15px] font-black text-[#2D2D2D] tracking-tight">
        {record.dogName}
      </span>
    </div>
  );

  // 카테고리/진료처 정보 배지
  const CategoryBadge = isMedical ? (
    <div className="flex items-center gap-2 text-[13px] lg:text-[14px] text-stone-500 font-bold bg-[#FCFAF8] px-3 lg:px-4 py-1.5 rounded-xl border border-[#F5F5F5]">
      <span className="text-base">🏥</span> {record.clinicName || 'Clinic'}
      {record.diagnosis && <span className="text-[#FF6B00] ml-1 hidden sm:inline">/ {record.diagnosis}</span>}
    </div>
  ) : (
    <div className="flex items-center gap-2 text-[13px] lg:text-[14px] text-stone-500 font-bold bg-[#FCFAF8] px-3 lg:px-4 py-1.5 rounded-xl border border-[#F5F5F5]">
      <span className="text-base">🏷️</span> {record.categoryCode}
    </div>
  );

  // 첨부파일 메타 정보
  const AttachmentMeta = record.attachmentCount > 0 && (
    <div className="flex items-center gap-1.5 text-stone-300">
      <span className="text-base leading-none">📎</span>
      <span className="text-[12px] font-black tabular-nums tracking-wider">{record.attachmentCount}</span>
    </div>
  );

  return (
    <div className="group flex gap-8 lg:gap-12 items-start relative">
      {/* 타임라인 인디케이터 */}
      <div className="flex flex-col items-center flex-shrink-0 pt-6 relative z-10">
        <div className={`w-4 h-4 rounded-full border-[3px] border-white shadow-lg transition-all duration-500 group-hover:scale-125 
          ${isMedical ? 'bg-[#FF6B00]' : 'bg-[#FFB380]'}`} 
        />
        <div className="w-px h-full min-h-[120px] bg-[#F0F0F0] mt-4 group-last:hidden" />
      </div>

      <Card className="flex-grow p-6 lg:p-8 transition-all duration-500 hover:translate-x-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-none ring-1 ring-[#F0F0F0]">
        <div className="space-y-5 lg:space-y-6">
          
          {/* 1. TOP: 메타 정보 및 금액(PC) */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 lg:gap-4">
              <span className={`text-[9px] lg:text-[10px] font-black tracking-[0.2em] px-3 lg:px-4 py-1 rounded-md uppercase
                ${isMedical ? 'bg-[#FF6B00] text-white' : 'bg-stone-100 text-stone-500'}`}>
                {record.recordType}
              </span>
              <span className="text-[13px] lg:text-[14px] font-black text-stone-300 tabular-nums">{record.recordDate}</span>
            </div>
            
            {/* Desktop Amount */}
            {record.amount !== undefined && record.amount !== null && (
              <div className="hidden xl:block">
                <span className="text-[24px] font-black text-[#2D2D2D] tabular-nums tracking-tighter">
                  {record.amount.toLocaleString()}<span className="text-[14px] ml-1 text-stone-400 font-bold">원</span>
                </span>
              </div>
            )}
          </div>

          {/* 2. MIDDLE: 제목 */}
          <h4 className="text-[22px] lg:text-[28px] font-black text-[#2D2D2D] tracking-tight leading-tight">
            {record.title}
          </h4>

          {/* 3. MOBILE ONLY CONTENT (2-Row Layout) */}
          <div className="xl:hidden space-y-4 pt-4 border-t border-stone-50">
            {/* Mobile Row 1: Dog + Amount */}
            <div className="flex justify-between items-center">
              {DogIdentity}
              {record.amount !== undefined && record.amount !== null && (
                <span className="text-[18px] font-black text-[#2D2D2D] tabular-nums tracking-tighter">
                  {record.amount.toLocaleString()}<span className="text-[12px] ml-0.5 text-stone-400 font-bold">원</span>
                </span>
              )}
            </div>
            {/* Mobile Row 2: Category + Attachments */}
            <div className="flex justify-between items-center">
              {CategoryBadge}
              {AttachmentMeta}
            </div>
          </div>

          {/* 4. DESKTOP ONLY FOOTER (Bottom Left: Dog/Category, Bottom Right: Attachments) */}
          <div className="hidden xl:flex justify-between items-end pt-2">
            <div className="flex items-center gap-6">
              {DogIdentity}
              {CategoryBadge}
            </div>
            {AttachmentMeta}
          </div>

        </div>
      </Card>
    </div>
  );
};
