import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page Not Found');
  return (
    <div className="not-found">
      <div className="not-found-num">404</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: 'var(--text)', marginBottom: 12 }}>Page not found.</h2>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 420 }}>The page you're looking for doesn't exist or has moved.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
        <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
      </div>
    </div>
  );
}
