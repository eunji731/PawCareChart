import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 백엔드 에러(무시됨):', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-stone-800 flex items-center gap-2 hover:text-amber-600 transition-colors py-4 cursor-pointer">
            <span className="text-2xl">🐾</span> 멍케어차트
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-[14px] font-bold text-stone-400">
            <Link to="/" className="hover:text-amber-600 transition-colors cursor-pointer">홈</Link>
            <Link to="/dogs" className="hover:text-amber-600 transition-colors cursor-pointer">반려견</Link>
            <Link to="/care-records" className="hover:text-amber-600 transition-colors cursor-pointer">케어기록</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <span className="text-[14px] font-bold text-stone-600">{user?.name}님</span>
          <button
            onClick={handleLogout}
            className="text-[14px] font-bold text-stone-400 hover:text-amber-600 transition-colors cursor-pointer"
          >
            로그아웃
          </button>
          <Link to="/mypage" className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shadow-sm cursor-pointer hover:bg-orange-100 transition-colors">
            <span className="text-sm">👤</span>
          </Link>
        </div>

        {/* 모바일 햄버거 메뉴 및 프로필 아이콘 래퍼 */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/mypage" className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shadow-sm cursor-pointer hover:bg-orange-100 transition-colors">
            <span className="text-sm">👤</span>
          </Link>
          <button
            className="text-stone-400 hover:text-amber-600 p-1 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 공간 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-orange-50 bg-[#FFF9F2] px-6 py-4 space-y-4 pb-6 shadow-md absolute w-full left-0 z-40">
          <Link to="/" className="block text-stone-600 font-bold hover:text-amber-600 text-base cursor-pointer">홈</Link>
          <Link to="/dogs" className="block text-stone-600 font-bold hover:text-amber-600 text-base cursor-pointer">반려견</Link>
          <Link to="/care-records" className="block text-stone-600 font-bold hover:text-amber-600 text-base cursor-pointer">케어기록</Link>
          <div className="border-t border-orange-100 pt-4 mt-2">
            <button
              onClick={handleLogout}
              className="block w-full text-left text-stone-400 font-bold text-sm cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
