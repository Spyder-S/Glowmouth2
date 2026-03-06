import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function Nav({ modal, setModal }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={stuck ? "stuck" : ""}>
      <div className="wrap nav-inner">
        <Logo />
        <ul className="nav-links">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
        <div className="nav-right">
          <button className="btn btn-ghost" onClick={() => setModal("signin")}>Sign In</button>
          <button className="btn btn-teal" onClick={() => setModal("signup")}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;