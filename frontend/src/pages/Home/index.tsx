import { Header } from './components/Header';
import { ContextBar } from './components/ContextBar';
import { KpiCards } from './components/KpiCards';
import { MainDataTable } from './components/MainDataTable';
import { ExpenseChart } from './components/ExpenseChart';
import { HealthWidgets } from './components/HealthWidgets';

export const HomePage = () => {
  return (
    // 다이어리 감성의 부드러운 배경 톤과 모바일 반응형 1440px 와이드 지원
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-800 pb-12">
      <Header />
      
      {/* 메인 컨테이너 패딩 적용 및 최대 너비 정렬 */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Core 7 (강아지 선택) & 이번 달 요약 톡 컨텍스트 바 */}
        <section className="mt-2 mb-4">
          <ContextBar />
        </section>

        {/* 4단 Core 지표 요약 카드 (방문횟수, 신호등, 트래커, 비용) */}
        <section className="mb-6">
          <KpiCards />
        </section>

        {/* 하단 메인 데이터 및 위젯 레이아웃 (좌: 8 / 우: 4 비율) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 좌측 패널: 차트 및 표 세로 배치 */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ExpenseChart />
            <MainDataTable />
          </div>

          {/* 우측 사이드 패널: 건강/일정 위젯 세로 배치 */}
          <div className="lg:col-span-4 h-full">
            <HealthWidgets />
          </div>

        </main>
      </div>
    </div>
  );
};

export default HomePage;
