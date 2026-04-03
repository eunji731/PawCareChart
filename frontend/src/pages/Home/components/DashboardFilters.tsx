import { useEffect, useState, useRef } from 'react';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';

interface DashboardFiltersProps {
  onFilterChange: (filters: { dogId?: number; startDate: string; endDate: string }) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFilterChange }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  
  const getInitialDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      first: formatDate(firstDay),
      last: formatDate(lastDay)
    };
  };

  const { first, last } = getInitialDates();
  const [selectedDogId, setSelectedDogId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState(first);
  const [endDate, setEndDate] = useState(last);

  // 무한 루프 방지 및 초기 호출 제어를 위한 Ref
  const isFirstRender = useRef(true);

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  // 필터 변경 시 부모에게 알림
  useEffect(() => {
    // 최초 렌더링 시에는 호출하지 않거나, 필요 시에만 호출
    onFilterChange({ dogId: selectedDogId, startDate, endDate });
  }, [selectedDogId, startDate, endDate]); // onFilterChange를 의존성에서 제거하여 무한 루프 방지

  return (
    <div className="flex flex-col md:flex-row items-center md:items-center gap-3 w-full max-w-[400px] md:max-w-none">
      {/* 1. 반려견 선택 */}
      <div className="relative group w-full md:min-w-[160px] md:w-auto">
        <select 
          value={selectedDogId || ''}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            setSelectedDogId(val);
          }}
          className="w-full appearance-none bg-stone-100/40 h-[48px] pl-5 pr-10 rounded-xl border border-transparent text-[#2D2D2D] font-bold text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]/30 transition-all cursor-pointer text-center md:text-left"
        >
          <option value="">모든 아이들 🐾</option>
          {dogs.map(dog => (
            <option key={dog.id} value={dog.id}>{dog.name}</option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300 text-[10px]">▼</span>
      </div>

      {/* 2. 기간 선택 */}
      <div className="flex items-center justify-center bg-stone-100/40 h-[48px] px-5 rounded-xl border border-transparent focus-within:bg-white focus-within:border-[#FF6B00]/30 transition-all w-full md:w-auto">
        <div className="flex items-center gap-2">
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] font-bold text-stone-600 cursor-pointer hover:text-[#FF6B00] transition-colors"
          />
          <span className="text-stone-300 text-[10px] font-light">~</span>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] font-bold text-stone-600 cursor-pointer hover:text-[#FF6B00] transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
