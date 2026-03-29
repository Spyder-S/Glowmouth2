import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Logo from './Logo';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/scan', icon: '🔬', label: 'Scan' },
  { to: '/results', icon: '📋', label: 'Results' },
  { to: '/history', icon: '📅', label: 'History' },
  { to: '/progress', icon: '📈', label: 'Progress' },
  { to: '/insights', icon: '💡', label: 'Insights' },
  { to: '/reports', icon: '📄', label: 'Reports' },
];

export default function AppShell({ title, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex' }}>
      <aside className="app-sidebar">
        <div className="sidebar-logo-area">
          <Link to="/dashboard"><Logo variant="dark" size={30} /></Link>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <Link key={to} to={to}
              className={`sidebar-nav-item ${location.pathname === to ? 'active' : ''}`}>
              <span className="item-icon">{icon}</span>
              {label}
            </Link>
          ))}
          <div className="sidebar-divider" />
          <Link to="/settings"
            className={`sidebar-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
            <span className="item-icon">⚙️</span>Settings
          </Link>
          {user?.plan === 'free' && (
            <Link to="/upgrade"
              className={`sidebar-nav-item ${location.pathname === '/upgrade' ? 'active' : ''}`}>
              <span className="item-icon">⬆️</span>
              Upgrade
              <span className="upgrade-badge">PRO</span>
            </Link>
          )}
        </nav>
        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initial}</div>
            <div>
              <div className="sidebar-name">{user?.name}</div>
              <div className="sidebar-email">{user?.email}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>← Log out</button>
        </div>
      </aside>

      <div className="app-main">
        <div className="app-topbar">
          <span className="app-topbar-title">{title}</span>
          <Link to="/scan" className="btn btn-primary btn-sm">Start Scan</Link>
        </div>
        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
}
