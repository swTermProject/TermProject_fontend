import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext'; // AuthProvider 임포트
import HomePage from "./pages/HomePage";
import LogInPage from './pages/LoginPage';
import ReservationPage from './pages/ReservationPage';
import MyPage from "./pages/MyPage";
import SignupPage from './pages/SignupPage';

import './App.css';



// 로그인이 필요한 페이지를 감싸는 PrivateRoute 컴포넌트
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  // 홈페이지는 로그인 여부와 상관없이 접근 가능
  // 로그인이 필요한 /reservation, /MyReserve는 PrivateRoute로 보호
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignupPage />} /> {/* 이 라우트 추가 */}
        <Route 
          path="/reservation" 
          element={
            <PrivateRoute>
              <ReservationPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/MyReserve" 
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* 여기서 앱 전체를 감싸줍니다. */}
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;