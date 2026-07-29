import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Logo from '../../components/Logo';
import OralHealthMap from '../../components/OralHealthMap';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Login() {
  useDocumentTitle('Sign In');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });
    if (!emailValid) { setError('Enter a valid email address.'); return; }
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
        <p style={{ color: 'var(--text-body)', fontSize: 15, marginTop: 16, textAlign: 'center', maxWidth: 320 }}>
          Biological oral health intelligence. Know what&apos;s actually happening.
        </p>
        <div style={{ marginTop: 28, width: '100%', maxWidth: 360 }}>
          <OralHealthMap compact />
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <span className="eyebrow">Welcome back</span>
          <h2 className="auth-h2" style={{ marginTop: 8 }}>Sign in to your account.</h2>
          <p className="auth-sub">Access your oral health intelligence dashboard.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => markTouched('email')}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={touched.email && !emailValid ? 'field-invalid' : ''}
              aria-invalid={touched.email && !emailValid}
            />
            {touched.email && !emailValid && <span className="field-error">Enter a valid email address.</span>}
          </div>
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <label style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Forgot password?</a>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => markTouched('password')} required autoComplete="current-password" placeholder="••••••••"/>
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
