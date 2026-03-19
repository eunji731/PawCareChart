import { Card } from '../../../components/common/Card';

export const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. 방문 횟수 */}
      <Card className="p-5 justify-between h-[110px] hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[12px] font-extrabold text-stone-400 tracking-tight">이번 달 방문 횟수</span>
          <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">🗓️</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-[22px] font-extrabold text-stone-800 tracking-tight">2<span className="text-[14px] font-bold text-stone-400 ml-1">회</span></span>
          <span className="text-[11px] font-extrabold tracking-tight text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full ml-auto">전월대비 +1</span>
        </div>
      </Card>

      {/* 2. 예방접종 현황 트래커 (신호등 효과) */}
      <Card className="p-5 justify-between h-[110px] hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[12px] font-extrabold text-stone-400 tracking-tight">예방접종 현황</span>
          <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">💉</span>
        </div>
        <div className="flex items-center gap-2.5 mt-auto bg-stone-50 rounded-xl px-2.5 py-1.5 border border-stone-100 w-max shadow-inner">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] border border-emerald-300"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-stone-200 border border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-stone-200 border border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"></div>
          <span className="text-[12px] font-extrabold text-stone-500 ml-1.5 leading-none">잔여일정 없음</span>
        </div>
      </Card>

      {/* 3. 복약 진행률 트래커 바 */}
      <Card className="p-5 justify-between h-[110px] hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[12px] font-extrabold text-stone-400 tracking-tight">피부염 약 복약</span>
          <span className="text-lg opacity-80 z-10 group-hover:scale-110 transition-transform">💊</span>
        </div>
        <div className="flex items-baseline justify-between mt-auto mb-1.5 z-10 w-full pr-1">
          <span className="text-[15px] font-extrabold text-stone-800 tracking-tight">Day 3 <span className="text-stone-400 text-xs">/ 7</span></span>
          <span className="text-[11px] font-extrabold text-amber-600 tracking-tight bg-white/80 px-1 rounded">43% 완료</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[6px] bg-orange-50">
          <div className="h-full bg-linear-to-r from-amber-400 to-orange-400 w-[43%] rounded-tr-xl"></div>
        </div>
      </Card>

      {/* 4. 총 지출 통계 */}
      <Card className="p-5 justify-between h-[110px] hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[12px] font-extrabold text-stone-400 tracking-tight">이번 달 총 지출</span>
          <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">💳</span>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-[22px] font-extrabold text-stone-800 tracking-tight">150,000</span>
          <span className="text-[11px] font-extrabold tracking-tight text-red-500 ml-auto">+20% ▲</span>
        </div>
      </Card>
    </div>
  );
};
