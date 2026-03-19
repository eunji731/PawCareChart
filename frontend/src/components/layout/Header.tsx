import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-stone-800 flex items-center gap-1.5 hover:text-amber-600 transition-colors">
            <span className="text-xl">🐾</span> 멍케어차트
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-bold text-stone-400">
            <Link to="/" className="text-amber-600 hover:text-amber-700 transition-colors">홈</Link>
            <Link to="#" className="hover:text-stone-800 transition-colors">반려견</Link>
            <Link to="#" className="hover:text-stone-800 transition-colors">병원기록</Link>
            <Link to="#" className="hover:text-stone-800 transition-colors">비용기록</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="#" className="text-[13px] font-bold text-stone-500 hover:text-stone-800 transition-colors">마이페이지</Link>
          <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shadow-sm cursor-pointer hover:bg-orange-100 transition-colors">
            <span className="text-xs">👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};
