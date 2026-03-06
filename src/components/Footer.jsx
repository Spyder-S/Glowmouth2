import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft-grid">
          <div>
            <Logo />
            <p className="ft-desc">Wellness oral intelligence. Track your GlowScore. Build better habits.</p>
            <p className="ft-disc">Not a medical device.<br />Not for diagnosis.<br />Wellness screening only.</p>
          </div>
          <div>
            <p className="ft-h">Product</p>
            <ul className="ft-links">
              <li><Link to="/features">AI Scan</Link></li>
              <li><Link to="/features">GlowScore</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/pricing">Device</Link></li>
            </ul>
          </div>
          <div>
            <p className="ft-h">Company</p>
            <ul className="ft-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <p className="ft-h">Legal</p>
            <ul className="ft-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/consent">Consent Policy</Link></li>
              <li><Link to="/cookie">Cookie Policy</Link></li>
              <li><Link to="/refund">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copy">© {new Date().getFullYear()} GlowMouth, Inc.</span>
          <span className="ft-legal">⚕ NOT A MEDICAL DEVICE · WELLNESS SCREENING ONLY</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;