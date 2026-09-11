import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const CRUMB_MAP: Record<string, { root: string; label: string }> = {
  '/stores': { root: 'RateNest', label: 'Explore Stores' },
  '/change-password': { root: 'RateNest', label: 'Change Password' },
  '/admin': { root: 'RateNest', label: 'Dashboard' },
  '/admin/users': { root: 'RateNest', label: 'Users' },
  '/admin/stores': { root: 'RateNest', label: 'Stores' },
  '/admin/change-password': { root: 'RateNest', label: 'Change Password' },
  '/owner': { root: 'RateNest', label: 'Store Dashboard' },
  '/owner/change-password': { root: 'RateNest', label: 'Change Password' },
};

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const crumb = CRUMB_MAP[location.pathname] ?? {
    root: 'RateNest',
    label: location.pathname.indexOf('/admin/users/') === 0 ? 'User Details' : 'Dashboard',
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          aria-expanded="false"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-breadcrumb" aria-label="Breadcrumb">
          <span className="crumb-root">{crumb.root}</span>
          <ChevronRight size={14} className="crumb-sep" />
          <span className="crumb-current">{crumb.label}</span>
        </div>
      </div>

      <div className="topbar-right">
        {user && (
          <div className="user-profile-badge" title={user.email}>
            <span className="user-avatar">{getInitials(user.name)}</span>
            <span className="user-info-snippet">
              <span className="user-name-snippet">{user.name}</span>
              <span className="user-role-badge">{user.role}</span>
            </span>
          </div>
        )}

        <button
          className="btn btn-ghost btn-sm"
          onClick={logout}
          title="Sign out of your account"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};