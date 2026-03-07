import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const accessToken = searchParams.get('access_token');

  useEffect(() => {
    if (!accessToken && window.location.hash) {
      const hash = new URLSearchParams(window.location.hash.replace('#', ''));
      if (hash.get('access_token')) {
        // supabase may return in hash
        searchParams.set('access_token', hash.get('access_token'));
      }
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password, accessToken);
      setMessage('Password updated. You can now sign in.');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAuth', { detail: { mode: 'signin' } }));
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap fade-in">
        <h2>Create a new password</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>New password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}
          <button className="btn btn-teal" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px; }
        .auth-wrap { background:var(--bg2); border:1px solid var(--teal-border); border-radius:22px; padding:40px; max-width:400px; width:100%; }
        .auth-form .field { display:flex; flex-direction:column; margin-bottom:16px; }
        .form-error { color:#ff6b6b; margin-bottom:12px; }
        .form-success { color:#86efac; margin-bottom:12px; }
      `}</style>
    </div>
  );
}