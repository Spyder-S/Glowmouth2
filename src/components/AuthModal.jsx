import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

function AuthModal({ mode, onClose, onSwap }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const isUp = mode === "signup";

  const handleSubmit = async () => {
    setError("");
    // basic front-end validation
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Invalid email address');
      return;
    }
    if (!pass || pass.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (isUp && !agreed) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      await login(email, pass, isUp, name);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{isUp ? "Create account" : "Welcome back"}</h3>
        <p className="modal-sub">{isUp ? "Start your 14-day free trial — no card needed." : "Sign in to your GlowMouth account."}</p>
        {isUp && (
          <div className="field">
            <label>Name</label>
            <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        {isUp && (
          <div className="check-row">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I agree to the <a href="/terms" target="_blank" rel="noopener">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>. I understand GlowMouth is not a medical device.</span>
          </div>
        )}
        {error && <div className="modal-error">{error}</div>}
        <button className="modal-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? (isUp ? "Creating…" : "Signing in…") : (isUp ? "Create Account" : "Sign In")}
        </button>
        {!isUp && (
          <p className="forgot-row">
            <a href="/forgot-password">Forgot password?</a>
          </p>
        )}
        <div className="modal-swap">
          {isUp ? "Already have an account? " : "No account yet? "}
          <button onClick={onSwap}>{isUp ? "Sign in" : "Sign up free"}</button>
        </div>
      </div>

      <style>{`
        .modal-error {
          color: #ff6b6b;
          padding: 12px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }
        .forgot-row {
          text-align: right;
          margin-top: 8px;
        }
        .forgot-row a {
          color: var(--teal);
          font-size: 13px;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default AuthModal;