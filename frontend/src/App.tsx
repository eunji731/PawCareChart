import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from '@/pages/Login';
import { SignupPage } from '@/pages/Signup';

// Global Pages
import { HomePage } from '@/pages/Home';
import { MyPage } from '@/pages/MyPage';

// Dog Management
import DogListPage from '@/pages/Dogs/List';
import DogFormPage from '@/pages/Dogs/Form';

// Care Records
import CareRecordListPage from '@/pages/CareRecords/List';
import CareRecordFormPage from '@/pages/CareRecords/Form';
import CareRecordDetailPage from '@/pages/CareRecords/Detail';

// Schedules
import ScheduleListPage from '@/pages/Schedules/List';
import ScheduleFormPage from '@/pages/Schedules/Form';
import ScheduleDetailPage from '@/pages/Schedules/Detail';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            
            {/* Dogs */}
            <Route path="/dogs" element={<ProtectedRoute><DogListPage /></ProtectedRoute>} />
            <Route path="/dogs/new" element={<ProtectedRoute><DogFormPage /></ProtectedRoute>} />
            <Route path="/dogs/edit/:id" element={<ProtectedRoute><DogFormPage /></ProtectedRoute>} />
            
            {/* Care Records */}
            <Route path="/care-records" element={<ProtectedRoute><CareRecordListPage /></ProtectedRoute>} />
            <Route path="/care-records/new" element={<ProtectedRoute><CareRecordFormPage /></ProtectedRoute>} />
            <Route path="/care-records/edit/:id" element={<ProtectedRoute><CareRecordFormPage /></ProtectedRoute>} />
            <Route path="/care-records/:id" element={<ProtectedRoute><CareRecordDetailPage /></ProtectedRoute>} />
            
            {/* Schedules */}
            <Route path="/schedules" element={<ProtectedRoute><ScheduleListPage /></ProtectedRoute>} />
            <Route path="/schedules/new" element={<ProtectedRoute><ScheduleFormPage /></ProtectedRoute>} />
            <Route path="/schedules/edit/:id" element={<ProtectedRoute><ScheduleFormPage /></ProtectedRoute>} />
            <Route path="/schedules/:id" element={<ProtectedRoute><ScheduleDetailPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
