import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Logo from '../../components/Logo';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await signup(name, email, password);
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
          <p style={{ fontSize: 13, color: 'var(--text-body)', marginTop: 10 }}>↑ Your first scan awaits</p>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-h2">Create your account.</h2>
          <p className="auth-sub">Start monitoring your oral health today.</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="field"><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Alex Morgan"/></div>
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"/></div>
          <div className="field"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters"/></div>
          <div className="field"><label>Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password"/></div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
