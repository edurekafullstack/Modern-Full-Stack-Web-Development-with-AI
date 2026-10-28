import { useAuth } from '../context/useAuth.js';
import { useTheme } from '../context/useTheme.js';
import { Sun, Moon, LogOut, CheckSquare, Plus, User } from 'lucide-react';

export default function Navbar({ onOpenCreateModal }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <CheckSquare size={20} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">TaskFlow</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {onOpenCreateModal && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenCreateModal}
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>
          )}

          {/* Theme switch button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User profile & Logout */}
          <div className="user-profile-menu">
            <div className="user-avatar" title={user?.email || 'User'}>
              {user?.name ? getInitials(user.name) : <User size={16} />}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Workspace User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
            <button
              type="button"
              className="btn-logout"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
