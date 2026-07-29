import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Logo variant="light" />
            <p className="footer-tagline">
              Biological oral health monitoring.<br />
              Know what&apos;s actually happening in your mouth.
            </p>
            <p className="footer-disclaimer">Not a medical device. Not for diagnosis.</p>
          </div>
          <div className="footer-col">
            <span className="footer-col-head">Product</span>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/science">Science</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <span className="footer-col-head">Company</span>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <span className="footer-col-head">Legal</span>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-legal">© 2026 GlowMouth, Inc.</p>
          <p className="footer-mono-note">NOT A MEDICAL DEVICE · WELLNESS ONLY</p>
        </div>
      </div>
    </footer>
  );
}
