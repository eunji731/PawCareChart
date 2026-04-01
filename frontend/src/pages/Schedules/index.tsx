import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Calendar } from '@/components/common/Calendar';
import type { CalendarMarkers } from '@/components/common/Calendar';
import { ScheduleHeroCard } from './components/ScheduleHeroCard';
import { ScheduleList } from './components/ScheduleList';
import type { Schedule } from '@/types/schedule';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';

const mockSchedules: Schedule[] = [
  { id: 1, type: 'MEDICAL', title: '튼튼동물병원 피부염 2차 재진', date: '2026-04-04T14:00', memo: '약 먹고 구토한 증상 문의', tags: ['피부염', '구토'], dDay: 3 },
  { id: 2, type: 'GROOMING', title: '멍멍살롱 썸머컷', date: '2026-04-15T11:00', memo: '3mm, 얼굴 가위컷', tags: ['미용'], dDay: 14 },
  { id: 3, type: 'MEDICATION', title: '넥스가드 스펙트라', date: '2026-04-21T09:00', memo: '심장사상충 예방', tags: [], dDay: 20 }
];

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('2026-04-04');
  const [filterType, setFilterType] = useState('ALL');
  const [activeScheduleId, setActiveScheduleId] = useState<number | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  const handleMonthChange = useCallback((year: number, month: number) => {
    setSelectedDate('');
  }, []);

  const markers = useMemo(() => {
    const m: CalendarMarkers = {};
    mockSchedules.forEach(s => {
      const date = s.date.split('T')[0];
      if (!m[date]) m[date] = [];
      m[date].push({ type: s.type as any });
    });
    return m;
  }, []);

  const filteredSchedules = useMemo(() => {
    let result = mockSchedules;
    if (filterType !== 'ALL') {
      result = result.filter(s => s.type === filterType);
    }
    if (keyword.trim()) {
      result = result.filter(s => s.title.includes(keyword) || s.memo?.includes(keyword));
    }
    // dogId 필터 등 추가 가능
    return result;
  }, [filterType, keyword]);

  const selectedDateSchedules = useMemo(() => {
    return filteredSchedules.filter(s => s.date.startsWith(selectedDate));
  }, [selectedDate, filteredSchedules]);

  const heroSchedule = useMemo(() => {
    if (activeScheduleId) {
      return mockSchedules.find(s => s.id === activeScheduleId) || mockSchedules[0];
    }
    return selectedDateSchedules.length > 0 ? selectedDateSchedules[0] : filteredSchedules[0];
  }, [selectedDateSchedules, filteredSchedules, activeScheduleId]);

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      <PageLayout title="" maxWidth="max-w-[1500px]">

        {/* 1. 상단 헤더 */}
        <header className="pt-8 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3">
            <h1 className="text-[48px] lg:text-[56px] font-black text-[#2D2D2D] leading-[0.95] tracking-tight">
              Schedule <span className="text-[#FF6B00]">Plan.</span>
            </h1>
            <p className="text-[16px] text-stone-400 font-medium max-w-xl">
              우리 아이의 진료 예약부터 복약 알림까지, 모든 일정을 한눈에 관리하세요.
            </p>
          </div>
        </header>

        {/* 2. 필터 바 (Care Record와 동일한 디자인 및 기능) */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-[#F0F0F0]">
            <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">

              {/* GROUP 1: SEARCH & DOG SELECT */}
              <div className="flex-grow flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow group">
                  <input
                    placeholder="어떤 일정을 찾으시나요?"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-[#F9F9F9] h-[56px] pl-12 pr-6 rounded-xl border border-transparent focus:border-[#FF6B00] focus:bg-white outline-none text-[15px] font-medium transition-all duration-300 shadow-inner"
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-20 group-focus-within:opacity-100 transition-opacity">🔍</span>
                </div>

                <div className="relative sm:w-56 group">
                  <select
                    value={selectedDogId}
                    onChange={(e) => setSelectedDogId(e.target.value)}
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

              {/* GROUP 2: SEGMENTED TABS */}
              <div className="flex p-1.5 bg-[#F5F5F5] rounded-xl shadow-inner">
                {[
                  { label: 'Total', value: 'ALL' },
                  { label: 'Medical', value: 'MEDICAL' },
                  { label: 'Grooming', value: 'GROOMING' },
                  { label: 'Meds', value: 'MEDICATION' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilterType(option.value)}
                    className={`px-8 h-[44px] rounded-lg text-[13px] font-black transition-all duration-300 active:scale-95 ${filterType === option.value
                      ? 'bg-white text-[#FF6B00] shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* GROUP 3: DATE RANGE */}
              <div className="flex items-center gap-6 px-8 border-l border-stone-100 hidden xl:flex">
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest leading-none">Date Range</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-[14px] font-black text-[#2D2D2D] cursor-pointer hover:text-[#FF6B00] transition-colors"
                    />
                    <span className="text-stone-200 font-light">/</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-[14px] font-black text-[#2D2D2D] cursor-pointer hover:text-[#FF6B00] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* GROUP 4: ACTION BUTTON */}
              <div className="pb-1">
                <button 
                  className="px-8 h-[56px] bg-[#2D2D2D] text-white rounded-2xl font-black text-[15px] shadow-xl shadow-stone-200 active:scale-95 transition-all"
                  onClick={() => navigate('/schedules/new')}
                >
                  + 일정 추가
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 3. 메인 그리드 */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">

          {/* Left: Calendar */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-12">
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-[#F0F0F0]">
              <Calendar
                markers={markers}
                selectedDate={selectedDate}
                onDateClick={setSelectedDate}
                onMonthChange={handleMonthChange}
              />
              <div className="mt-10 pt-6 border-t border-stone-100 flex gap-6 justify-center">
                <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Medical
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Grooming
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Meds
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[13px] font-black text-stone-400 uppercase tracking-widest">Focus</h3>
                {heroSchedule && (
                  <span className="text-[11px] font-black text-[#FF6B00] bg-orange-50 px-2.5 py-1 rounded-lg">Upcoming Event</span>
                )}
              </div>
              {heroSchedule ? (
                <ScheduleHeroCard schedule={heroSchedule} />
              ) : (
                <div className="py-24 text-center bg-white rounded-3xl border border-[#F0F0F0] shadow-sm">
                  <span className="text-4xl mb-4 block opacity-20">🗓️</span>
                  <h3 className="text-[18px] font-black text-[#2D2D2D] tracking-tight">No Events.</h3>
                  <p className="text-stone-400 font-medium text-[14px]">조건에 맞는 일정이 없습니다.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-[13px] font-black text-stone-400 uppercase tracking-widest px-2">Upcoming List</h3>
              {filteredSchedules.length > 0 ? (
                <ScheduleList
                  schedules={filteredSchedules}
                  onSelect={setActiveScheduleId}
                  activeId={heroSchedule?.id || 0}
                />
              ) : (
                <div className="p-10 text-center text-stone-300 font-bold border-2 border-dashed border-stone-100 rounded-3xl">
                  일정이 없습니다.
                </div>
              )}
            </div>
          </div>
        </main>
      </PageLayout>
    </div>
  );
};

export default SchedulePage;
