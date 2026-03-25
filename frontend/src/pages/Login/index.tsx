import { LoginForm } from '@/pages/Login/components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/30 p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[26rem] bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-orange-100/40 p-8 sm:p-10 relative overflow-hidden">
        
        {/* 장식용 배경 요소 (다이어리 감성) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* 헤더/타이틀 영역 */}
          <div className="text-center mb-10 mt-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100/80 mb-5 shadow-sm rotate-3 border border-amber-200/50">
              <span className="text-3xl drop-shadow-sm -rotate-3">🐾</span>
            </div>
            <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-stone-800 tracking-tight mb-2">
              멍케어차트
            </h1>
            <p className="text-sm text-stone-500 font-medium">
              우리아이 건강기록 다이어리
            </p>
          </div>

          {/* 폼 컴포넌트 */}
          <LoginForm />
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
