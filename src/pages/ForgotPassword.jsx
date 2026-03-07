import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('If an account exists we sent password reset instructions.');
    } catch (err) {
      setError(err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap fade-in">
        <h2>Reset password</h2>
        <p>Enter your email address and we'll send reset instructions.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}
          <button className="btn btn-teal" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset email'}
          </button>
        </form>
        <p className="auth-footer">
          <a href="/signin">Back to sign in</a>
        </p>
      </div>
      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px; }
        .auth-wrap { background:var(--bg2); border:1px solid var(--teal-border); border-radius:22px; padding:40px; max-width:400px; width:100%; }
        .auth-form .field { display:flex; flex-direction:column; margin-bottom:16px; }
        .form-error { color:#ff6b6b; margin-bottom:12px; }
        .form-success { color:#86efac; margin-bottom:12px; }
        .auth-footer { margin-top:20px; text-align:center; }
        .auth-footer a { color:var(--teal); text-decoration:underline; }
      `}</style>
    </div>
  );
}