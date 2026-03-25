import { useSignup } from '@/pages/Signup/hooks/useSignup';

export const SignupForm = () => {
  const {
    email, setEmail,
    password, setPassword,
    name, setName,
    error, loading,
    handleSignup
  } = useSignup();

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      {/* 보호자 이름 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700 ml-1" htmlFor="name">
          보호자 이름
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 홍길동"
          required
          className="w-full px-4 py-4 rounded-2xl bg-amber-50/40 border border-amber-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 shadow-sm text-base"
        />
      </div>

      {/* 이메일 아이디 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700 ml-1" htmlFor="email">
          이메일 아이디
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="pawcare@example.com"
          required
          className="w-full px-4 py-4 rounded-2xl bg-amber-50/40 border border-amber-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 shadow-sm text-base"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700 ml-1" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 설정"
          required
          className="w-full px-4 py-4 rounded-2xl bg-amber-50/40 border border-amber-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 shadow-sm text-base"
        />
      </div>

      {/* 에러 메시지 컴포넌트 */}
      {error && (
        <p className="text-sm text-red-500 font-medium py-2 px-3 mt-1 rounded-xl bg-red-50 border border-red-100 leading-relaxed">
          {error}
        </p>
      )}

      {/* 가입하기 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-4 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? '다이어리 만드는 중...' : '시작하기'}
      </button>

      {/* 기존 회원 로그인 이동 링크 */}
      <div className="mt-6 text-center">
        <span className="text-sm text-stone-500 mr-2">이미 수첩이 있으신가요?</span>
        <a
          href="/login"
          className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer transition-colors"
        >
          로그인하기
        </a>
      </div>
    </form>
  );
};

export default SignupForm;
