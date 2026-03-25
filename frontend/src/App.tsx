import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { HomePage } from './pages/Home';
import { MyPage } from './pages/MyPage';
import { DogFormPage } from './pages/Dogs/DogFormPage';
import { DogListPage } from './pages/Dogs/DogListPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 로그인 페이지 라우트 연결 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 회원가입 페이지 라우트 연결 */}
          <Route path="/signup" element={<SignupPage />} />

          {/* 메인 홈 화면은 보호된 라우트로 설정 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* 마이페이지 보호된 라우트 */}
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />

          {/* 반려견 목록 라우트 추가 */}
          <Route
            path="/dogs"
            element={
              <ProtectedRoute>
                <DogListPage />
              </ProtectedRoute>
            }
          />

          {/* 반려견 등록 및 수정 라우트 추가 */}
          <Route
            path="/dogs/new"
            element={
              <ProtectedRoute>
                <DogFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dogs/edit/:id"
            element={
              <ProtectedRoute>
                <DogFormPage />
              </ProtectedRoute>
            }
          />

          {/* 잘못된 경로로 접근 시 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;