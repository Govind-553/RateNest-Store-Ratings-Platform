import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, getDefaultRoute } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// User Pages
import { UserStores } from './pages/user/Stores';
import { ChangePassword } from './pages/user/ChangePassword';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminUserDetails } from './pages/admin/UserDetails';
import { AdminStores } from './pages/admin/Stores';

// Owner Pages
import { OwnerDashboard } from './pages/owner/Dashboard';

const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <div className="skeleton skeleton-circle" style={{ width: 52, height: 52 }} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDefaultRoute(user.role)} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root Route: Redirects based on role */}
            <Route path="/" element={<RootRedirect />} />

            {/* Normal User Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/stores" element={<UserStores />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/:id" element={<AdminUserDetails />} />
              <Route path="/admin/stores" element={<AdminStores />} />
              <Route path="/admin/change-password" element={<ChangePassword />} />
            </Route>

            {/* Store Owner Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/change-password" element={<ChangePassword />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
