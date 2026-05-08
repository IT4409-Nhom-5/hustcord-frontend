import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppStore';

// --- Import Pages ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import GuildPage from './pages/GuildPage';

// --- Route Guards ---

// 1. ProtectedRoute: Chỉ cho phép truy cập khi ĐÃ đăng nhập
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, đá văng ra trang login
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 2. PublicRoute: Chỉ cho phép truy cập khi CHƯA đăng nhập
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (isAuthenticated) {
    // Nếu đã đăng nhập mà cố vào lại /login, đẩy thẳng vào app
    return <Navigate to="/channels/@me" replace />;
  }
  return <>{children}</>;
};

// --- App Router ---
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public route - Landing page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth routes (Ẩn với người đã đăng nhập) */}
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        {/* Protected routes (Yêu cầu đăng nhập) */}
        <Route path="/channels/@me" element={
          <ProtectedRoute><OverviewPage /></ProtectedRoute>
        } />
        <Route path="/channels/:guildId/:channelId?" element={
          <ProtectedRoute><GuildPage /></ProtectedRoute>
        } />

        {/* Redirect mọi route không hợp lệ về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;