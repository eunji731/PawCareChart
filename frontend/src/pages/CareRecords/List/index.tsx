import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/common/Button';
import { useCareRecords } from './hooks/useCareRecords';
import { TimelineItem } from './components/TimelineItem';
import { FilterBar } from './components/FilterBar';
import { CareCalendar } from './components/CareCalendar';

const CareRecordListPage = () => {
  const { records, isLoading, filters, updateFilter } = useCareRecords();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    updateFilter({ startDate: date, endDate: date });
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      <PageLayout title="" maxWidth="max-w-[1500px]">
        {/* 상단 여백 축소 (pt-12 pb-16 -> pt-8 pb-10) */}
        <header className="pt-8 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3">
            <h1 className="text-[48px] lg:text-[56px] font-black text-[#2D2D2D] leading-[0.95] tracking-tight">
              Care <span className="text-[#FF6B00]">Log.</span>
            </h1>
            <p className="text-[16px] text-stone-400 font-medium max-w-xl">
              반려견의 건강 기록과 지출 흐름을 정교한 타임라인으로 관리하세요.
            </p>
          </div>
          <div className="pb-1">
            <Button size="lg" className="px-8 h-[56px] text-[15px] shadow-xl">
              + 기록 추가
            </Button>
          </div>
        </header>

        {/* 필터 영역과 메인 사이 간격 축소 (mb-12 -> mb-6) */}
        <section className="mb-6">
          <FilterBar filters={filters} onChange={updateFilter} />
        </section>

        {/* 메인 그리드 간격 축소 (gap-12 -> gap-6) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20">
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-12">
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-[#F0F0F0]">
              <CareCalendar 
                records={records} 
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
              />
              <div className="mt-8 pt-6 border-t border-stone-100 flex gap-8 justify-center">
                <div className="flex items-center gap-2.5 text-[11px] font-black text-stone-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Medical
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-black text-stone-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-[#FFB380]"></span> Expense
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-stone-100 border-t-[#FF6B00] rounded-full animate-spin" />
              </div>
            ) : records.length > 0 ? (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {records.map(record => (
                  <TimelineItem key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-3xl border border-[#F0F0F0] shadow-sm px-10">
                <h3 className="text-[22px] font-black text-[#2D2D2D] mb-2 tracking-tight">No Records.</h3>
                <p className="text-stone-400 font-medium mb-8 text-[15px]">아직 기록된 로그가 없습니다.</p>
                <Button variant="outline" size="lg" className="rounded-xl px-10 border-[#EEEEEE] text-stone-600">기록 시작하기</Button>
              </div>
            )}
          </div>
        </main>
      </PageLayout>
    </div>
  );
};

export default CareRecordListPage;
