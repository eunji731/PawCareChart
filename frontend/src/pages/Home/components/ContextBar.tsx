export const ContextBar = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 text-sm gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
        <label className="text-stone-400 text-[13px] font-extrabold shrink-0">선택된 반려견:</label>
        {/* 반려견 선택 드롭다운 콤보박스 */}
        <select className="appearance-none bg-white border border-orange-100 shadow-sm text-stone-800 font-extrabold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 text-[14px] cursor-pointer bg-no-repeat bg-[length:10px_10px] bg-[right_10px_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2378716c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]">
          <option value="bongbong">🐶 봉봉</option>
          <option value="choco">🍫 초코</option>
        </select>
        <span className="text-stone-400 text-xs font-bold hidden sm:block">말티즈 · 3살 · 4.5kg</span>
      </div>
      
      {/* 멍케어 월간 브리핑 (말풍선 테마 래핑) */}
      <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2.5 rounded-2xl rounded-tl-[4px] shadow-sm text-[13px] font-extrabold flex items-center gap-2.5 hover:bg-amber-100 cursor-pointer w-full lg:w-auto transition-colors">
        <span className="text-lg leading-none">💬</span> 이번 달 봉봉이는 병원에 2번 다녀왔고, 예방접종을 모두 마쳤어요! 🌱
      </div>
    </div>
  );
};
