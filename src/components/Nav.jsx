import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Logo from './Logo.jsx';

function Nav({ modal, setModal }) {
  const [stuck, setStuck] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={stuck ? "stuck" : ""}>
      <div className="wrap nav-inner">
        <Link to="/">
          <Logo />
        </Link>
        <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>  
          {user && <li><Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link></li>}
          {user && <li><Link to="/scan" onClick={() => setMobileOpen(false)}>Scan</Link></li>}
          {user && <li><Link to="/history" onClick={() => setMobileOpen(false)}>History</Link></li>}
          <li><Link to="/features" onClick={() => setMobileOpen(false)}>Features</Link></li>
          <li><Link to="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link></li>
          <li><Link to="/faq" onClick={() => setMobileOpen(false)}>FAQ</Link></li>
        </ul>
        <button className="mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
          ☰
        </button>
        <div className="nav-right">
          {user ? (
            <>
              <div className="nav-user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button className="btn btn-ghost" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => setModal("signin")}>Sign In</button>
              <button className="btn btn-teal" onClick={() => setModal("signup")}>Get Started</button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .nav-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-right: 16px;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 24px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .mobile-toggle {
            display: block;
          }
          .nav-links {
            position: absolute;
            top: 60px;
            right: 28px;
            flex-direction: column;
            background: var(--bg2);
            padding: 12px 16px;
            border-radius: 12px;
            display: none;
            box-shadow: 0 4px 18px rgba(0,0,0,0.4);
          }
          .nav-links.open {
            display: flex;
          }
          .nav-links a {
            padding: 8px 12px;
          }
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .user-email {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 768px) {
          .nav-user-info {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}

export default Nav;