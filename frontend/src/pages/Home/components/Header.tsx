import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      navigate('/login');
    }
  };

  const menuItems = [
    { label: '홈', path: '/' },
    { label: '반려견', path: '/dogs' },
    { label: '케어기록', path: '/care-records' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-[#FCFAF8]/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-[100]">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 h-[80px] flex items-center justify-between">
        {/* LOGO AREA */}
        <div className="flex items-center gap-12">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B00]/20 group-hover:rotate-6 transition-transform">
              <span className="text-xl">🐾</span>
            </div>
            <span className="text-[20px] font-black text-[#2D2D2D] tracking-tight uppercase">
              PawCare<span className="text-[#FF6B00]">.</span>
            </span>
          </Link>

          {/* MAIN NAVIGATION */}
          <nav className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-[15px] font-bold transition-all duration-300 py-2 ${
                  isActive(item.path)
                    ? 'text-[#FF6B00]'
                    : 'text-stone-400 hover:text-[#2D2D2D]'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B00] rounded-full animate-in fade-in slide-in-from-left-2" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* USER AREA */}
        <div className="hidden md:flex items-center gap-6 pl-6 border-l border-stone-100">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-black text-[#2D2D2D] leading-none mb-1">
              {user?.name || '사용자'}님
            </span>
            <button
              onClick={handleLogout}
              className="text-[11px] font-bold text-stone-400 hover:text-red-500 transition-colors cursor-pointer tracking-tight"
            >
              LOGOUT
            </button>
          </div>
          <Link 
            to="/mypage" 
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-90 shadow-sm ${
              isActive('/mypage')
                ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00]'
                : 'border-stone-100 bg-white text-stone-400 hover:border-stone-200'
            }`}
          >
            <span className="text-lg">👤</span>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-4">
          <Link 
            to="/mypage"
            className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-lg"
          >
            👤
          </Link>
          <button
            className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-[#2D2D2D]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-stone-50 bg-white/95 backdrop-blur-lg px-6 py-8 space-y-6 shadow-2xl absolute w-full left-0 z-40 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-[18px] font-black tracking-tight ${
                  isActive(item.path) ? 'text-[#FF6B00]' : 'text-stone-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[14px] font-bold text-stone-600">{user?.name}님 환영해요!</span>
            <button
              onClick={handleLogout}
              className="text-[13px] font-black text-red-400 hover:text-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
