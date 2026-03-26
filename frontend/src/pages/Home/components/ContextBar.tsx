export const ContextBar = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative group">
        <select className="appearance-none bg-white h-[56px] pl-6 pr-12 rounded-2xl border border-stone-100 shadow-sm text-[#2D2D2D] font-black text-[16px] outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 cursor-pointer transition-all">
          <option value="bongbong">🐶 봉봉</option>
          <option value="choco">🍫 초코</option>
        </select>
        <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300 font-bold group-hover:text-[#FF6B00] transition-colors">▼</span>
      </div>
      
      <div className="hidden lg:flex items-center gap-3 px-6 h-[56px] bg-white border border-stone-100 rounded-2xl shadow-sm">
        <span className="text-xl leading-none">💬</span>
        <p className="text-[14px] font-bold text-stone-500 word-break-keep-all">
          이번 달 <span className="text-[#FF6B00]">봉봉이</span>는 병원에 <span className="text-[#2D2D2D]">2번</span> 다녀왔고, 예방접종을 모두 마쳤어요! 🌱
        </p>
      </div>
    </div>
  );
};
