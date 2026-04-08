import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';
import type { CareRecordsFilter } from '@/types/care';
import { useCommonCodes } from '@/hooks/useCommonCodes';

interface FilterBarProps {
  filters: CareRecordsFilter;
  onChange: (filters: Partial<CareRecordsFilter>) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [localKeyword, setLocalKeyword] = useState(filters.keyword ?? '');
  const navigate = useNavigate();
  
  // 1. 공통 코드 로드 (일상기록 제외 필터링)
  const { codes: allRecordTypes } = useCommonCodes('RECORD_TYPE');
  const recordTypes = allRecordTypes.filter(t => t.code !== 'MEMO');

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  useEffect(() => {
    setLocalKeyword(filters.keyword ?? '');
  }, [filters.keyword]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange({ keyword: localKeyword || undefined });
    }
  };

  const handleBlur = () => {
    if (filters.keyword !== localKeyword) {
      onChange({ keyword: localKeyword || undefined });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-[#F0F0F0]">
      <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">

        <div className="flex-grow flex flex-col sm:flex-row gap-3">
          {/* 검색창 */}
          <div className="relative flex-grow group">
            <input
              placeholder="무엇을 찾으시나요?"
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-full bg-[#F9F9F9] h-[56px] pl-12 pr-6 rounded-xl border border-transparent focus:border-[#FF6B00] focus:bg-white outline-none text-[15px] font-medium transition-all duration-300 shadow-inner"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-20 group-focus-within:opacity-100 transition-opacity">🔍</span>
          </div>

          {/* 반려견 선택 */}
          <div className="relative sm:w-56 group">
            <select
              value={filters.dogId ?? ''}
              onChange={(e) =>
                onChange({
                  dogId: e.target.value ? Number(e.target.value) : undefined
                })
              }
              className="w-full h-[56px] px-6 rounded-xl bg-[#F9F9F9] border border-transparent focus:border-[#FF6B00] focus:bg-white text-[14px] font-bold appearance-none outline-none cursor-pointer transition-all duration-300 shadow-inner"
            >
              <option value="">모든 아이들 🐾</option>
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>{dog.name}</option>
              ))}
            </select>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300 font-bold group-hover:text-[#FF6B00] transition-colors">▼</span>
          </div>
        </div>

        {/* 기록 유형 탭 (ID 기반 필터링 강화) */}
        <div className="flex p-1.5 bg-[#F5F5F5] rounded-xl shadow-inner">
          <button
            onClick={() => onChange({ type: 'ALL', recordTypeId: undefined })}
            className={`px-8 h-[44px] rounded-lg text-[13px] font-black transition-all duration-300 active:scale-95 ${(filters.type === 'ALL' && !filters.recordTypeId)
              ? 'bg-white text-[#FF6B00] shadow-sm'
              : 'text-stone-400 hover:text-stone-600'
              }`}
          >
            Total
          </button>
          
          {recordTypes.map((type) => {
            const isActive = filters.recordTypeId === type.id;
            return (
              <button
                key={type.id}
                onClick={() => onChange({ type: type.code as any, recordTypeId: type.id })}
                className={`px-8 h-[44px] rounded-lg text-[13px] font-black transition-all duration-300 active:scale-95 ${isActive
                  ? 'bg-white text-[#FF6B00] shadow-sm'
                  : 'text-stone-400 hover:text-stone-600'
                  }`}
              >
                {type.codeName}
              </button>
            )
          })}
        </div>

        {/* 날짜 범위 */}
        <div className="flex items-center gap-6 px-8 border-l border-stone-100 hidden xl:flex">
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest leading-none">Date Range</p>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={filters.startDate ?? ''}
                onChange={(e) => onChange({ startDate: e.target.value || undefined })}
                className="bg-transparent border-none outline-none text-[14px] font-black text-[#2D2D2D] cursor-pointer hover:text-[#FF6B00] transition-colors"
              />
              <span className="text-stone-200 font-light">/</span>
              <input
                type="date"
                value={filters.endDate ?? ''}
                onChange={(e) => onChange({ endDate: e.target.value || undefined })}
                className="bg-transparent border-none outline-none text-[14px] font-black text-[#2D2D2D] cursor-pointer hover:text-[#FF6B00] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="primary"
            className="w-full h-[56px] px-8 rounded-xl shadow-lg shadow-amber-100"
            onClick={() => navigate('/care-records/new')}
          >
            + 기록하기
          </Button>
        </div>
      </div>
    </div>
  );
};
