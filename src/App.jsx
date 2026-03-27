import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './lib/api';
import logger from './lib/logger';
import { NotificationProvider } from './lib/NotificationContext';

import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/login';
import InvitePage from './pages/InvitePage';
import { AdminApprovalPage } from './pages/AdminApprovalPage';

import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { CustomersPage } from './pages/CustomersPage';
import { TasksPage } from './pages/TasksPage';
import { CommunicationsPage } from './pages/CommunicationsPage';
import { ChatPage } from './pages/ChatPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { RoleManagementPage } from './pages/RoleManagementPage';
import { SettingsPage } from './pages/SettingsPage';

// ─── Protected Route Wrapper ──────────────────────────────────────────────────
const ProtectedRoute = ({ isAuthenticated, isLoading, user, allowedRoles, children }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── App / Router ─────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('crm-auth') === 'true' && !!localStorage.getItem('accessToken');
  });
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('crm-dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const res = await api.get('/auth/me');
          if (isMounted) {
            const data = res.data;
            // Normalize backend role (e.g. "ROLE_ADMIN" or "admin") to uppercase "ADMIN"
            const normalizedRole = data.role ? data.role.replace('ROLE_', '').toUpperCase() : '';
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
              try {
                const payloadBase64 = accessToken.split('.')[1];
                const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
                const payload = JSON.parse(decodedJson);
                if (payload.employeeId) {
                  localStorage.setItem('employeeId', payload.employeeId);
                } else if (payload.userId) {
                  localStorage.setItem('employeeId', payload.userId);
                } else if (payload.id) {
                  localStorage.setItem('employeeId', payload.id);
                }
              } catch (e) {
                logger.error('Failed to parse token', e);
              }
            }

            setUser({
              ...data,
              name: data.username || data.name,
              role: normalizedRole
            });
          }
        } catch (error) {
          logger.error('Failed to fetch user:', error);
          if (error.response?.status === 401) {
            handleLogout();
          } else {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
              try {
                const payloadBase64 = accessToken.split('.')[1];
                const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
                const payload = JSON.parse(decodedJson);
                const roleFromJwt = payload.role || payload.roles || '';
                setUser({
                  name: payload.sub || payload.username || 'User',
                  role: roleFromJwt.replace('ROLE_', '').toUpperCase()
                });
                return;
              } catch (e) {
                logger.error('Failed to parse token for fallback user', e);
                handleLogout();
              }
            } else {
              handleLogout();
            }
          }
        } finally {
          if (isMounted) setIsLoadingAuth(false);
        }
      } else {
        if (isMounted) setIsLoadingAuth(false);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const toggleDark = () => setDarkMode(prev => !prev);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('crm-auth', 'true');
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('crm-auth');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  const wrap = (Page, allowedRoles) => (
    <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoadingAuth} user={user} allowedRoles={allowedRoles}>
      <MainLayout darkMode={darkMode} onToggleDark={toggleDark} onLogout={handleLogout} user={user}>
        <Page user={user} />
      </MainLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
      } />
      <Route path="/invite/:token" element={<InvitePage />} />

      {/* Protected routes wrapped in NotificationProvider */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <NotificationProvider>
          {wrap(DashboardPage)}
        </NotificationProvider>
      } />
      <Route path="/leads" element={<NotificationProvider>{wrap(LeadsPage, ['ADMIN', 'MANAGER', 'SALES'])}</NotificationProvider>} />
      <Route path="/customers" element={<NotificationProvider>{wrap(CustomersPage, ['ADMIN', 'MANAGER', 'SALES', 'SUPPORT'])}</NotificationProvider>} />
      <Route path="/tasks" element={<NotificationProvider>{wrap(TasksPage)}</NotificationProvider>} />
      <Route path="/communications" element={<NotificationProvider>{wrap(CommunicationsPage)}</NotificationProvider>} />
      <Route path="/chat" element={<NotificationProvider>{wrap(ChatPage)}</NotificationProvider>} />
      <Route path="/documents" element={<NotificationProvider>{wrap(DocumentsPage)}</NotificationProvider>} />
      <Route path="/reports" element={<NotificationProvider>{wrap(ReportsPage, ['ADMIN', 'MANAGER'])}</NotificationProvider>} />
      <Route path="/users" element={<NotificationProvider>{wrap(UserManagementPage, ['ADMIN'])}</NotificationProvider>} />
      <Route path="/roles" element={<NotificationProvider>{wrap(RoleManagementPage, ['ADMIN'])}</NotificationProvider>} />
      <Route path="/settings" element={<NotificationProvider>{wrap(SettingsPage)}</NotificationProvider>} />
      <Route path="/admin/approvals" element={<NotificationProvider>{wrap(AdminApprovalPage, ['ADMIN'])}</NotificationProvider>} />
    </Routes>
  );
}

