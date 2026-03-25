import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';
import { HomePage } from '@/pages/Home';
import { MyPage } from '@/pages/MyPage';
import DogListPage from '@/pages/Dogs/List';
import DogFormPage from '@/pages/Dogs/Form';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          <Route path="/dogs" element={<ProtectedRoute><DogListPage /></ProtectedRoute>} />
          <Route path="/dogs/new" element={<ProtectedRoute><DogFormPage /></ProtectedRoute>} />
          <Route path="/dogs/edit/:id" element={<ProtectedRoute><DogFormPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
