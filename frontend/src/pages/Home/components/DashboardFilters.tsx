import { useEffect, useState } from 'react';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { DatePicker } from '@/components/common/DatePicker';

interface DashboardFiltersProps {
  onFilterChange: (filters: { dogId?: number; startDate: string; endDate: string }) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFilterChange }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  
  const now = new Date();
  const [selectedDogId, setSelectedDogId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | null>(startOfMonth(now));
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(now));

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      onFilterChange({ 
        dogId: selectedDogId, 
        startDate: format(startDate, 'yyyy-MM-dd'), 
        endDate: format(endDate, 'yyyy-MM-dd') 
      });
    }
  }, [selectedDogId, startDate, endDate]);

  const handlePreset = (type: '7D' | '1M' | '3M') => {
    const today = new Date();
    let start = new Date();
    
    if (type === '7D') start = subDays(today, 7);
    else if (type === '1M') start = subDays(today, 30);
    else if (type === '3M') start = subDays(today, 90);

    setStartDate(start);
    setEndDate(today);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      
      <div className="relative group">
        <select 
          value={selectedDogId || ''}
          onChange={(e) => setSelectedDogId(e.target.value ? Number(e.target.value) : undefined)}
          className="appearance-none bg-white h-[52px] pl-6 pr-12 rounded-[20px] border border-stone-100 shadow-sm text-[#2D2D2D] font-black text-[14px] outline-none focus:ring-4 focus:ring-[#FF6B00]/5 focus:border-[#FF6B00] transition-all cursor-pointer min-w-[160px]"
        >
          <option value="">모든 아이들 🐾</option>
          {dogs.map(dog => (
            <option key={dog.id} value={dog.id}>{dog.name}</option>
          ))}
        </select>
        <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300 group-hover:text-[#FF6B00] transition-colors">▼</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-1 p-1 bg-stone-100/50 rounded-[18px]">
          {(['7D', '1M', '3M'] as const).map(p => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-black text-stone-400 hover:bg-white hover:text-[#FF6B00] hover:shadow-sm transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* 기간 카드 너비 및 간격 조정 */}
        <div className="flex items-center px-5 h-[52px] bg-white rounded-[20px] border border-stone-100 shadow-sm focus-within:border-[#FF6B00] transition-all">
          <div className="flex items-center gap-2">
            <span className="text-base opacity-30">📅</span>
            <div className="flex items-center">
              <div className="w-[95px]">
                <DatePicker 
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <span className="text-stone-300 font-light mx-1">~</span>
              <div className="w-[95px]">
                <DatePicker 
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
