import { Header } from '@/pages/Home/components/Header';
import { ContextBar } from '@/pages/Home/components/ContextBar';
import { KpiCards } from '@/pages/Home/components/KpiCards';
import { MainDataTable } from '@/pages/Home/components/MainDataTable';
import { ExpenseChart } from '@/pages/Home/components/ExpenseChart';
import { HealthWidgets } from '@/pages/Home/components/HealthWidgets';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans text-[#2D2D2D] pb-32">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-6 md:px-10">
        
        {/* 1. HERO BRIEFING SECTION: 4개의 위젯을 하나의 큰 브리핑 영역으로 통합 */}
        <section className="pt-12 pb-12">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-stone-100 pb-10">
            <div className="space-y-4">
              <h1 className="text-[48px] lg:text-[64px] font-black text-[#2D2D2D] leading-[0.95] tracking-tight">
                Daily <span className="text-[#FF6B00]">Briefing.</span>
              </h1>
              <div className="flex items-center gap-4">
                <ContextBar />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <p className="text-[11px] font-black text-stone-300 uppercase tracking-[0.2em] mb-1">Last Update</p>
                <p className="text-[15px] font-black text-[#2D2D2D] tabular-nums">2026.03.24 10:30</p>
              </div>
            </div>
          </header>

          <KpiCards />
        </section>

        {/* 2. MAIN DASHBOARD CONTENT: 2단 에디토리얼 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          
          {/* LEFT CONTENT: 분석 및 상세 기록 (8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="bg-white rounded-[32px] p-1 border border-[#F0F0F0] shadow-[0_30px_80px_rgba(0,0,0,0.02)]">
              <ExpenseChart />
            </div>
            
            <div className="bg-white rounded-[32px] p-1 border border-[#F0F0F0] shadow-[0_30px_80px_rgba(0,0,0,0.02)]">
              <MainDataTable />
            </div>
          </div>

          {/* RIGHT SIDE PANEL: 일정 및 이상 징후 (4/12) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-[40px] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.03)] border border-[#F0F0F0]">
              <HealthWidgets />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HomePage;
