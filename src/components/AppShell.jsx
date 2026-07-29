import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScanLine, BarChart2, History as HistoryIcon, TrendingUp, Lightbulb, FileText, Settings as SettingsIcon, ArrowUpCircle, MoreHorizontal, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import Logo from './Logo';
import useDocumentTitle from '../hooks/useDocumentTitle';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scan', icon: ScanLine, label: 'Scan' },
  { to: '/results', icon: BarChart2, label: 'Results' },
  { to: '/history', icon: HistoryIcon, label: 'History' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

const TAB_BAR_ITEMS = NAV_ITEMS.slice(0, 4);
const MORE_ITEMS = NAV_ITEMS.slice(4);

export default function AppShell({ title, children }) {
  useDocumentTitle(title);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const initial = user?.name?.[0]?.toUpperCase() || 'U';
  const isMoreActive = MORE_ITEMS.some(i => i.to === location.pathname) || ['/settings', '/upgrade'].includes(location.pathname);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-logo-area">
          <Link to="/dashboard"><Logo variant="light" size={32} /></Link>
          <div className="sidebar-status-card">
            <span className="sidebar-status-label">Biological status</span>
            <strong>Stable</strong>
            <p>GlowScore 84 · Trend +3 this week</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`sidebar-nav-item ${location.pathname === to ? 'active' : ''}`}>
              <Icon className="item-icon" size={16} strokeWidth={1.75} aria-hidden />
              {label}
            </Link>
          ))}
          <div className="sidebar-divider" />
          <Link to="/settings"
            className={`sidebar-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
            <SettingsIcon className="item-icon" size={16} strokeWidth={1.75} aria-hidden />Settings
          </Link>
          {user?.plan === 'free' && (
            <Link to="/upgrade"
              className={`sidebar-nav-item ${location.pathname === '/upgrade' ? 'active' : ''}`}>
              <ArrowUpCircle className="item-icon" size={16} strokeWidth={1.75} aria-hidden />
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
          <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <div className="app-main">
        <div className="app-topbar">
          <div className="app-topbar-left">
            <div className="app-topbar-kicker">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <span className="app-topbar-title">{title}</span>
          </div>
          <div className="app-topbar-center">
            <input className="app-search" type="search" placeholder="Search insights, reports, or scans" aria-label="Search" />
          </div>
          <div className="app-topbar-actions">
            <span className="status-pill status-pill-live">Live</span>
            <Link to="/scan" className="btn btn-primary btn-sm">Start Scan</Link>
          </div>
        </div>
        <div className="app-content">
          {children}
        </div>
      </div>

      <nav className="mobile-tab-bar" aria-label="Primary">
        {TAB_BAR_ITEMS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={`mobile-tab-item ${location.pathname === to ? 'active' : ''}`}>
            <Icon size={20} strokeWidth={1.75} aria-hidden />
            <span>{label}</span>
          </Link>
        ))}
        <button
          type="button"
          className={`mobile-tab-item ${isMoreActive ? 'active' : ''}`}
          onClick={() => setMoreOpen(true)}
          aria-label="More navigation options"
          aria-expanded={moreOpen}
        >
          <MoreHorizontal size={20} strokeWidth={1.75} aria-hidden />
          <span>More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="mobile-more-sheet" role="dialog" aria-label="More navigation">
          <div className="mobile-more-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="mobile-more-panel">
            <div className="mobile-more-header">
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>More</span>
              <button type="button" onClick={() => setMoreOpen(false)} aria-label="Close menu" className="mobile-more-close">
                <X size={18} aria-hidden />
              </button>
            </div>
            {MORE_ITEMS.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} className="mobile-more-item" onClick={() => setMoreOpen(false)}>
                <Icon size={18} strokeWidth={1.75} aria-hidden />{label}
              </Link>
            ))}
            <Link to="/settings" className="mobile-more-item" onClick={() => setMoreOpen(false)}>
              <SettingsIcon size={18} strokeWidth={1.75} aria-hidden />Settings
            </Link>
            {user?.plan === 'free' && (
              <Link to="/upgrade" className="mobile-more-item" onClick={() => setMoreOpen(false)}>
                <ArrowUpCircle size={18} strokeWidth={1.75} aria-hidden />Upgrade
              </Link>
            )}
            <button type="button" className="mobile-more-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
