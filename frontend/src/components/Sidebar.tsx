import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store as StoreIcon,
  KeyRound,
  LogOut,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const roleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'STORE_OWNER':
        return 'Store Owner';
      default:
        return 'Community User';
    }
  };

  const renderNavLinks = () => {
    if (!user) return null;

    if (user.role === 'ADMIN') {
      return (
        <>
          <div className="sidebar-section">
            <span className="sidebar-section-label">Overview</span>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </div>
          <div className="sidebar-section">
            <span className="sidebar-section-label">Management</span>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Users size={18} />
              <span>Users</span>
            </NavLink>
            <NavLink
              to="/admin/stores"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <StoreIcon size={18} />
              <span>Stores</span>
            </NavLink>
          </div>
          <div className="sidebar-section">
            <span className="sidebar-section-label">Account</span>
            <NavLink
              to="/admin/change-password"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <KeyRound size={18} />
              <span>Change Password</span>
            </NavLink>
          </div>
        </>
      );
    }

    if (user.role === 'STORE_OWNER') {
      return (
        <>
          <div className="sidebar-section">
            <span className="sidebar-section-label">Overview</span>
            <NavLink
              to="/owner"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Store Dashboard</span>
            </NavLink>
          </div>
          <div className="sidebar-section">
            <span className="sidebar-section-label">Account</span>
            <NavLink
              to="/owner/change-password"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <KeyRound size={18} />
              <span>Change Password</span>
            </NavLink>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="sidebar-section">
          <span className="sidebar-section-label">Discover</span>
          <NavLink
            to="/stores"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Compass size={18} />
            <span>Explore Stores</span>
          </NavLink>
          <NavLink
            to="/change-password"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <KeyRound size={18} />
            <span>Change Password</span>
          </NavLink>
        </div>
      </>
    );
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Primary navigation">
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo" onClick={onClose}>
            <Logo size="md" />
          </NavLink>
          <span className="brand-label">Store Intelligence</span>
        </div>

        <nav className="sidebar-nav">{renderNavLinks()}</nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-profile">
              <span className="user-avatar">{getInitials(user.name)}</span>
              <span className="sidebar-profile-info">
                <span className="sidebar-profile-name">{user.name}</span>
                <span className="sidebar-profile-role">{roleLabel(user.role)}</span>
              </span>
            </div>
          )}
          <button className="btn btn-ghost btn-sm sidebar-signout" onClick={logout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};