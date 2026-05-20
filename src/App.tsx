import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '~/stores/auth.store';
import { socketService } from '~/lib/socket/socket.service';

// Pages
import LoginPage from '~/pages/auth/LoginPage';
import RegisterPage from '~/pages/auth/RegisterPage';
import DashboardLayout from '~/layouts/DashboardLayout';
import NotFoundPage from '~/pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return !token ? children : <Navigate to="/channels/@me" replace />;
};

export default function App() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // Initialize socket connection when token is available
    if (token) {
      socketService.connect(token);
      socketService.connectVideo(token);
    }

    return () => {
      // Cleanup on unmount
      socketService.removeAllListeners();
    };
  }, [token]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/channels/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/channels/@me" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
