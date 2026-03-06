import { Link } from 'react-router-dom';

function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" onClick={onClick}>
      <div className="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3C8.5 3 5 6.5 5 10.5c0 5.5 7 10.5 7 10.5s7-5 7-10.5C19 6.5 15.5 3 12 3z" />
          <circle cx="12" cy="10" r="2" fill="white" stroke="none" />
        </svg>
      </div>
      <span className="logo-name">GlowMouth</span>
    </Link>
  );
}

export default Logo;