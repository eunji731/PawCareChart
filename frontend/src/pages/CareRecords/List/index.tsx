import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/common/Section';
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
    <PageLayout 
      title="케어기록" 
      description="우리 아이의 병원 방문과 지출 내역을 시간순으로 모아보세요."
      maxWidth="max-w-[1440px]"
    >
      {/* 1. 상단 통합 필터바 */}
      <FilterBar filters={filters} onChange={updateFilter} />

      {/* 2. 메인 컨텐츠: 4:6 레이아웃 (공간 활용 극대화) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 items-start">
        
        {/* 좌측: 월간 캘린더 (대형화) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <Section className="p-10 shadow-md border-orange-100/50">
            <CareCalendar 
              records={records} 
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />

            {/* 범례 (Legend) */}
            <div className="mt-10 pt-8 border-t border-orange-50 flex gap-8 justify-center">
              <div className="flex items-center gap-2.5 text-[12px] font-black text-stone-400 uppercase tracking-wider">
                <span className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-50 shadow-sm"></span> 
                Medical
              </div>
              <div className="flex items-center gap-2.5 text-[12px] font-black text-stone-400 uppercase tracking-wider">
                <span className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-50 shadow-sm"></span> 
                Expense
              </div>
            </div>
          </Section>
        </div>

        {/* 우측: 세로 타임라인 (시원한 가로폭 확보) */}
        <div className="lg:col-span-7 xl:col-span-8 min-h-[700px]">
          {isLoading ? (
            <div className="py-40 text-center">
              <div className="inline-block w-10 h-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mb-6" />
              <p className="text-stone-400 font-black text-[16px] tracking-tight">기록을 불러오고 있어요... 🐾</p>
            </div>
          ) : records.length > 0 ? (
            <div className="flex flex-col pt-2 max-w-4xl mx-auto lg:mx-0">
              {records.map(record => (
                <TimelineItem key={record.id} record={record} />
              ))}

              {/* 마지막 노드 장식 */}
              <div className="relative pl-8 h-20">
                <div className="absolute left-[11px] top-0 h-full w-[2px] bg-gradient-to-b from-orange-100 to-transparent" />
                <div className="absolute left-1.5 top-0 w-3 h-3 bg-orange-50 rounded-full border-2 border-orange-100" />
              </div>
            </div>
          ) : (
            <div className="py-48 text-center bg-white rounded-[48px] border-2 border-dashed border-orange-100 shadow-sm mx-auto max-w-3xl">
              <span className="text-7xl block mb-8 grayscale opacity-60">📓</span>
              <h3 className="text-xl font-black text-stone-800 mb-3">아직 기록이 없어요</h3>
              <p className="text-stone-400 font-bold text-[15px] mb-10">아이와 함께한 소중한 순간들을 기록해보세요.</p>
              <Button onClick={() => {}} variant="outline" size="lg" className="px-10 border-amber-200 text-amber-600 hover:bg-amber-50">
                첫 기록 남기기
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>  );
};

export default CareRecordListPage;
