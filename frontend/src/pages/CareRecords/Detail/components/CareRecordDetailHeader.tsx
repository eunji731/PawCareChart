import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CareRecord } from '@/types/care';

interface CareRecordDetailHeaderProps {
  record: CareRecord;
  onDelete: () => void;
}

export const CareRecordDetailHeader: React.FC<CareRecordDetailHeaderProps> = ({ record, onDelete }) => {
  const navigate = useNavigate();
  const isMedical = record.recordType === 'MEDICAL';

  return (
    <header className="flex flex-col gap-8 pb-4">
      
      {/* Top Bar: Back & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-[16px] bg-white flex items-center justify-center text-stone-600 hover:text-[#FF6B00] transition-all shadow-sm border border-stone-200/60 hover:border-[#FF6B00]"
        >
          <span className="text-xl leading-none -mt-0.5">←</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/care-records/edit/${record.id}`)}
            className="px-5 h-11 rounded-[14px] bg-white border border-stone-200/60 text-stone-600 font-bold text-[14px] hover:border-stone-400 transition-all shadow-sm"
          >
            수정
          </button>
          <button 
            onClick={onDelete}
            className="w-11 h-11 rounded-[14px] bg-white border border-red-100 text-red-400 font-bold text-[16px] hover:bg-red-50 hover:border-red-200 transition-all shadow-sm flex items-center justify-center"
            title="삭제"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Main Title & Tags */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg uppercase border
            ${isMedical ? 'border-[#FF6B00]/30 text-[#FF6B00] bg-[#FF6B00]/5' : 'border-stone-200 text-stone-500 bg-white shadow-sm'}`}>
            {record.recordType}
          </span>
          <span className="text-[13px] font-black text-stone-400 tabular-nums ml-1 tracking-widest">
            {record.recordDate}
          </span>
        </div>
        
        <h1 className="text-[36px] md:text-[44px] font-black text-[#2D2D2D] leading-[1.2] lg:leading-[1.1] tracking-tight word-break-keep-all pr-4">
          {record.title}<span className="text-[#FF6B00]">.</span>
        </h1>

        {/* Dog Avatar */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-stone-200 shadow-sm flex items-center justify-center shrink-0">
            {record.dogProfileImageUrl ? (
              <img src={record.dogProfileImageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[12px] grayscale opacity-40">🐕</span>
            )}
          </div>
          <span className="text-[15px] font-black text-[#2D2D2D] tracking-tight">{record.dogName}</span>
        </div>

      </div>
    </header>
  );
};
