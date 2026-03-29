import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../AuthContext';

const PUBLIC_LINKS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/science', label: 'Science' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navClass = ['nav', scrolled ? 'nav-scrolled' : ''].filter(Boolean).join(' ');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={navClass}>
        <div className="nav-inner">
          <Link to="/">
            <Logo variant="dark" />
          </Link>

          <ul className="nav-links">
            {PUBLIC_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={location.pathname === to ? 'active' : ''}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link-plain">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-plain">
                  Sign In
                </Link>
                <Link to="/pricing" className="nav-cta">
                  Get Early Access
                </Link>
              </>
            )}
            <button
              type="button"
              className="hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-overlay">
          <button type="button" className="nav-overlay-close" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
          {PUBLIC_LINKS.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{ color: 'var(--text-muted)', fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/pricing" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Get Early Access
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
