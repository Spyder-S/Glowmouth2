import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Logo from '../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="auth-split">
      <div className="auth-left">
        <Logo variant="dark" size={40} />
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 16, textAlign: 'center', maxWidth: 280 }}>
          Biological oral health monitoring. Know what&apos;s actually happening.
        </p>
        <div className="gs-card" style={{ marginTop: 40, width: '100%', maxWidth: 280 }}>
          <p className="gs-score-label">GlowScore</p>
          <div className="gs-numeral" style={{ fontSize: 56 }}>84</div>
          <div className="gs-bar-track" style={{ marginTop: 12 }}>
            <div className="gs-bar-fill" style={{ width: '84%' }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-body)', marginTop: 10 }}>↑ +3 from yesterday</p>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-h2">Welcome back.</h2>
          <p className="auth-sub">Sign in to your GlowMouth account.</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"/></div>
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <label style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Forgot password?</a>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••"/>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <p className="auth-switch">Don&apos;t have an account? <Link to="/signup">Sign up free</Link></p>
        </form>
      </div>
    </div>
  );
}
