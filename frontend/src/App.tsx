import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';
import { HomePage } from '@/pages/Home';
import { MyPage } from '@/pages/MyPage';
import DogListPage from '@/pages/Dogs/List';
import DogFormPage from '@/pages/Dogs/Form';
import CareRecordListPage from '@/pages/CareRecords/List';
import CareRecordFormPage from '@/pages/CareRecords/Form';
import CareRecordDetailPage from '@/pages/CareRecords/Detail';
import SchedulePage from '@/pages/Schedules'; // Default import
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
          <Route path="/care-records" element={<ProtectedRoute><CareRecordListPage /></ProtectedRoute>} />
          <Route path="/care-records/new" element={<ProtectedRoute><CareRecordFormPage /></ProtectedRoute>} />
          <Route path="/care-records/edit/:id" element={<ProtectedRoute><CareRecordFormPage /></ProtectedRoute>} />
          <Route path="/care-records/:id" element={<ProtectedRoute><CareRecordDetailPage /></ProtectedRoute>} />
          <Route path="/schedules" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
