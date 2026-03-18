import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiClient } from './lib/apiClient';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';

// 추후 폴더 구조(Colocation) 원칙에 따라 /pages/Home/ 으로 분리될 홈(메인) 화면 임시 코드입니다.
function TempHome() {
  const [backendMessage, setBackendMessage] = useState<string>('');

  useEffect(() => {
    apiClient.get('/hello')
      .then((response) => setBackendMessage(response.data))
      .catch((error) => {
        console.error('스프링 연결 실패:', error);
        setBackendMessage('스프링 부트와 연결되지 않았습니다. 서버가 켜져 있는지 확인하세요.');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🐾 Paw Care Chart Home (Temp)</h1>
      <div style={{ marginTop: '20px', padding: '15px', background: '#e0f7fa', borderRadius: '8px' }}>
        <h2>🔌 서버 통신 테스트</h2>
        <p><strong>백엔드 응답:</strong> {backendMessage || '데이터를 불러오는 중...'}</p>
      </div>
      <div style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        👉 <a href="/login" style={{ color: '#ea580c', textDecoration: 'none' }}>로그인 화면 구경하러 가기</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 라우트 연결 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 회원가입 페이지 라우트 연결 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 기존 테스트 화면 경로 */}
        <Route path="/" element={<TempHome />} />

        {/* 잘못된 경로로 접근 시 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;