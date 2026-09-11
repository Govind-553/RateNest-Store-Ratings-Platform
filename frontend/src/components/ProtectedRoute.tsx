import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '../types';
import { useAuth, getDefaultRoute } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton skeleton-circle" style={{ width: 52, height: 52, margin: '0 auto 1.25rem' }} />
          <div className="skeleton" style={{ width: 180, height: 14, margin: '0 auto' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
            Loading application…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackRoute = getDefaultRoute(user.role);
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};
