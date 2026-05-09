import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppStore';
import { JSX } from 'react';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuildPage from './pages/GuildPage';
import NotFoundPage from './pages/NotFoundPage';
import OverviewPage from './pages/OverviewPage';

// Private Route Guard
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const token = useAppSelector((state) => state.auth.token);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={token ? <Navigate to="/channels/@me" /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Private Routes */}
        <Route 
          path="/channels/@me/:userId?" 
          element={
            <PrivateRoute>
              <OverviewPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/channels/:guildId/:channelId?" 
          element={
            <PrivateRoute>
              <GuildPage />
            </PrivateRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;