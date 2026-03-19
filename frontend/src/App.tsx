import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { HomePage } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 라우트 연결 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 회원가입 페이지 라우트 연결 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 메인 홈 화면 경로 */}
        <Route path="/" element={<HomePage />} />

        {/* 잘못된 경로로 접근 시 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;