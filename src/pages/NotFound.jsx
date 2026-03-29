import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-num">404</div>
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, color: 'var(--heading)', marginBottom: 12 }}>Page not found.</h2>
      <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 32 }}>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
