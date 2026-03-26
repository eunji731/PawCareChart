import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { CareRecordsFilter } from '@/types/care';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';

interface FilterBarProps {
  filters: CareRecordsFilter;
  onChange: (filters: Partial<CareRecordsFilter>) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  return (
    <div className="bg-white p-6 rounded-[32px] border border-orange-100 shadow-sm space-y-6">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
        {/* 1. 핵심 필터 그룹 (반려견 + 유형) */}
        <div className="flex items-center gap-3 flex-shrink-0 w-full xl:w-auto">
          <select 
            value={filters.dogId}
            onChange={(e) => onChange({ dogId: e.target.value })}
            className="flex-1 xl:w-44 px-5 py-3 rounded-2xl border border-orange-100 bg-orange-50/30 text-[15px] font-black text-stone-700 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all cursor-pointer appearance-none shadow-sm"
          >
            <option value="">모든 반려견 🐾</option>
            {dogs.map(dog => (
              <option key={dog.id} value={dog.id}>{dog.name}</option>
            ))}
          </select>

          <div className="flex p-1.5 bg-stone-100/80 rounded-2xl flex-shrink-0 shadow-inner">
            {(['ALL', 'MEDICAL', 'EXPENSE'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onChange({ type })}
                className={`px-5 py-2 rounded-xl text-[13px] font-black transition-all ${
                  filters.type === type 
                    ? 'bg-white text-amber-600 shadow-md scale-100' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {type === 'ALL' ? '전체' : type === 'MEDICAL' ? '병원' : '지출'}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 검색창 (남은 공간 모두 활용) */}
        <div className="flex-grow w-full xl:w-auto">
          <div className="relative group">
            <Input 
              placeholder="증상, 병원명, 지출 메모 등 검색..." 
              value={filters.keyword}
              onChange={(e) => onChange({ keyword: e.target.value })}
              className="bg-stone-50/50 pl-12 py-3.5 border-stone-100 focus:bg-white rounded-2xl"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale opacity-40 group-focus-within:opacity-100 group-focus-within:grayscale-0 transition-all">🔍</span>
          </div>
        </div>

        {/* 3. 액션 버튼 */}
        <div className="flex-shrink-0 w-full xl:w-auto">
          <Button variant="primary" className="w-full xl:w-auto px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-100 font-black">
            + 새로운 기록 남기기
          </Button>
        </div>
      </div>

      {/* 4. 부가 필터: 기간 선택 */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-black text-stone-400 border-t border-orange-50 pt-6">
        <div className="flex items-center gap-2 mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-200"></span>
          조회 기간
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="bg-orange-50/50 border border-orange-100 rounded-xl px-4 py-2 outline-none text-stone-600 focus:border-amber-300 transition-all cursor-pointer font-bold" 
          />
          <span className="text-stone-300">~</span>
          <input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="bg-orange-50/50 border border-orange-100 rounded-xl px-4 py-2 outline-none text-stone-600 focus:border-amber-300 transition-all cursor-pointer font-bold" 
          />
        </div>

        {/* 빠른 기간 필터 (선택 사항) */}
        <div className="flex gap-2 ml-auto">
          {['1주일', '1개월', '3개월'].map(label => (
            <button key={label} className="px-3 py-1 rounded-lg border border-stone-100 text-[11px] hover:bg-stone-50 transition-colors cursor-pointer">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
