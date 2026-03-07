import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="static-page">
      <section className="wrap" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1>404 — Page not found</h1>
        <p>The page you’re looking for doesn’t exist or has been moved.</p>
        <button className="btn btn-teal" onClick={() => navigate('/')}>Go home</button>
      </section>
    </div>
  );
}
