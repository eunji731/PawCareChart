export const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* 1. 방문 횟수 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">🗓️</div>
          <p className="text-[13px] font-black text-stone-400 uppercase tracking-widest leading-none pt-1">Medical Visit</p>
        </div>
        <div className="flex items-end justify-between border-b border-stone-100 pb-4">
          <span className="text-[44px] font-black text-[#2D2D2D] tracking-tighter leading-none">2<span className="text-[18px] ml-1 text-stone-300 font-bold uppercase">times</span></span>
          <span className="text-[12px] font-black text-[#FF6B00] bg-[#FF6B00]/5 px-3 py-1 rounded-lg">+1 than last</span>
        </div>
      </div>

      {/* 2. 예방접종 현황 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">💉</div>
          <p className="text-[13px] font-black text-stone-400 uppercase tracking-widest leading-none pt-1">Vaccination</p>
        </div>
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 h-[44px]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-100 ring-4 ring-emerald-50"></div>
            <div className="w-3 h-3 rounded-full bg-stone-100"></div>
            <div className="w-3 h-3 rounded-full bg-stone-100"></div>
          </div>
          <span className="text-[13px] font-black text-stone-500">Perfect Status</span>
        </div>
      </div>

      {/* 3. 복약 진행률 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">💊</div>
          <p className="text-[13px] font-black text-stone-400 uppercase tracking-widest leading-none pt-1">Medication</p>
        </div>
        <div className="space-y-3 border-b border-stone-100 pb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[18px] font-black text-[#2D2D2D]">Day 3 <span className="text-[13px] text-stone-300 font-bold">/ 7</span></span>
            <span className="text-[13px] font-black text-[#FF6B00]">43%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF6B00] rounded-full transition-all duration-1000" style={{ width: '43%' }}></div>
          </div>
        </div>
      </div>

      {/* 4. 총 지출 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">💳</div>
          <p className="text-[13px] font-black text-stone-400 uppercase tracking-widest leading-none pt-1">Total Expense</p>
        </div>
        <div className="flex items-end justify-between border-b border-stone-100 pb-4">
          <span className="text-[44px] font-black text-[#2D2D2D] tracking-tighter leading-none">150<span className="text-[18px] ml-1 text-stone-300 font-bold uppercase">k</span></span>
          <span className="text-[12px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg">▲ 20%</span>
        </div>
      </div>
    </div>
  );
};
