import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLogin();

  const navigate = useNavigate();

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* 이메일 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700 ml-1" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="pawcare@example.com"
          required
          className="w-full px-4 py-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 shadow-sm"
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
          placeholder="비밀번호를 입력해주세요"
          required
          className="w-full px-4 py-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 shadow-sm"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 font-medium py-2 px-3 mt-1 rounded-xl bg-red-50 border border-red-100">
          {error}
        </p>
      )}

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-4 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '로그인 중...' : '로그인하기'}
      </button>

      {/* 회원가입 버튼 */}
      <div className="mt-5 text-center">
        <span className="text-sm text-stone-500 mr-2">아직 멍케어차트 회원이 아니신가요?</span>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer transition-colors"
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
