import { useState, useCallback } from 'react';
import { Header } from '@/pages/Home/components/Header';
import { DashboardFilters } from '@/pages/Home/components/DashboardFilters';
import { KpiCards } from '@/pages/Home/components/KpiCards';
import { MainDataTable } from '@/pages/Home/components/MainDataTable';
import { ExpenseChart } from '@/pages/Home/components/ExpenseChart';
import { HealthWidgets } from '@/pages/Home/components/HealthWidgets';
import { careApi } from '@/api/careApi';

export const HomePage = () => {
  const [filters, setFilters] = useState<{ dogId?: number; startDate: string; endDate: string }>({
    startDate: '',
    endDate: ''
  });

  const [dashboardData, setDashboardData] = useState<{
    totalExpenses: number;
    medicalCount: number;
    activeMedications: number;
  }>({
    totalExpenses: 0,
    medicalCount: 0,
    activeMedications: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = useCallback(async (newFilters: { dogId?: number; startDate: string; endDate: string }) => {
    setFilters(newFilters);

    try {
      setIsLoading(true);
      // 실제 API 호출 시점
      const data = await careApi.getDashboardSummary(newFilters);
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard Data Load Failed:', err);
      // 에러 시 초기값 유지 또는 Mock 처리
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans text-[#2D2D2D] pb-32">
      <Header />

      <main className="max-w-[1600px] mx-auto px-6 md:px-10">

        {/* 1. HERO BRIEFING SECTION */}
        <section className="pt-12 pb-12">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-b border-stone-100 pb-10 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-[42px] lg:text-[64px] font-black text-[#2D2D2D] leading-[0.95] tracking-tight">
                Monthly <span className="text-[#FF6B00]">Briefing.</span>
              </h1>
            </div>
            <div className="flex w-full md:w-auto justify-center">
              <DashboardFilters onFilterChange={handleFilterChange} />
            </div>
          </header>

          <KpiCards data={dashboardData} isLoading={isLoading} />
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
