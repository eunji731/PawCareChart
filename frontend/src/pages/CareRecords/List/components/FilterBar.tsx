import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';
import type { CareRecordsFilter } from '@/types/care';

interface FilterBarProps {
  filters: CareRecordsFilter;
  onChange: (filters: Partial<CareRecordsFilter>) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [localKeyword, setLocalKeyword] = useState(filters.keyword ?? '');
  const navigate = useNavigate();

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  // 외부에서 필터가 초기화될 경우를 대비해 동기화
  useEffect(() => {
    setLocalKeyword(filters.keyword ?? '');
  }, [filters.keyword]);

  // 2. 엔터키를 눌렀을 때만 부모의 onChange 호출
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange({ keyword: localKeyword || undefined });
    }
  };

  // 3. 포커스를 잃었을 때도 검색 적용 (선택 사항)
  const handleBlur = () => {
    if (filters.keyword !== localKeyword) {
      onChange({ keyword: localKeyword || undefined });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-[#F0F0F0]">
      <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">

        {/* GROUP 1: INTEGRATED SEARCH & DOG SELECT - 정제된 사각형 */}
        <div className="flex-grow flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow group">
            <input
              placeholder="무엇을 찾으시나요?"
              value={localKeyword} // 내부 상태 사용
              onChange={(e) => setLocalKeyword(e.target.value)} // 타이핑 시에는 내부 상태만 업데이트
              onKeyDown={handleKeyDown} // 엔터키 감지
              onBlur={handleBlur} // 포커스 아웃 감지
              className="w-full bg-[#F9F9F9] h-[56px] pl-12 pr-6 rounded-xl border border-transparent focus:border-[#FF6B00] focus:bg-white outline-none text-[15px] font-medium transition-all duration-300 shadow-inner"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-20 group-focus-within:opacity-100 transition-opacity">🔍</span>
          </div>

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
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300 font-bold group-hover:text-[#FF6B00] transition-colors">▼</span>
          </div>
        </div>

        {/* GROUP 2: PREMIUM SEGMENTED TABS - 곡률 축소 */}
        <div className="flex p-1.5 bg-[#F5F5F5] rounded-xl shadow-inner">
          {(['ALL', 'MEDICAL', 'EXPENSE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onChange({ type })}
              className={`px-8 h-[44px] rounded-lg text-[13px] font-black transition-all duration-300 active:scale-95 ${filters.type === type
                ? 'bg-white text-[#FF6B00] shadow-sm'
                : 'text-stone-400 hover:text-stone-600'
                }`}
            >
              {type === 'ALL' ? 'Total' : type === 'MEDICAL' ? 'Medical' : 'Expense'}
            </button>
          ))}
        </div>

        {/* GROUP 3: MINIMAL DATE RANGE */}
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

        {/* 4. 기록 추가 버튼 */}
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
