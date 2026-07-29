import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import Logo from '../../components/Logo';
import OralHealthMap from '../../components/OralHealthMap';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'case', label: 'Upper and lowercase letters', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: 'number', label: 'At least one number', test: (v) => /\d/.test(v) },
];

function strengthScore(password) {
  return RULES.filter((r) => r.test(password)).length;
}

export default function Signup() {
  useDocumentTitle('Create Account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const score = useMemo(() => strengthScore(password), [password]);
  const meetsAllRules = score === RULES.length;
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const confirmValid = !confirm || confirm === password;

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!emailValid) { setError('Enter a valid email address.'); return; }
    if (!meetsAllRules) { setError('Password does not meet the requirements below.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.ok) navigate('/dashboard');
    else setError(result.error);
  };

  const strengthLabel = ['Too weak', 'Weak', 'Good', 'Strong'][score];
  const strengthColor = ['var(--red)', 'var(--amber)', 'var(--accent-hover)', 'var(--accent)'][score];

  return (
    <div className="auth-split">
      <div className="auth-left">
        <Logo variant="dark" size={40} />
        <p style={{ color: 'var(--text-body)', fontSize: 15, marginTop: 16, textAlign: 'center', maxWidth: 320 }}>
          Start building a biological awareness layer for your oral health.
        </p>
        <div style={{ marginTop: 28, width: '100%', maxWidth: 360 }}>
          <OralHealthMap compact />
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <span className="eyebrow">Create account</span>
          <h2 className="auth-h2" style={{ marginTop: 8 }}>Create your GlowMouth account.</h2>
          <p className="auth-sub">Create your account and get access to the platform.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="field">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} onBlur={() => markTouched('name')} required placeholder="Alex Morgan"/>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => markTouched('email')}
              required
              placeholder="you@example.com"
              className={touched.email && !emailValid ? 'field-invalid' : ''}
              aria-invalid={touched.email && !emailValid}
            />
            {touched.email && !emailValid && <span className="field-error">Enter a valid email address.</span>}
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => markTouched('password')}
              required
              placeholder="Create a password"
              className={touched.password && !meetsAllRules && password ? 'field-invalid' : ''}
            />
            {touched.password && (
              <>
                <div className="pw-strength-track">
                  <div className="pw-strength-fill" style={{ width: `${(score / RULES.length) * 100}%`, background: strengthColor }} />
                </div>
                <div className="pw-strength-label" style={{ color: strengthColor }}>{password ? strengthLabel : ''}</div>
                <ul className="pw-rules">
                  {RULES.map((rule) => {
                    const pass = rule.test(password);
                    return (
                      <li key={rule.id} className={pass ? 'pw-rule-pass' : ''}>
                        {pass ? <Check size={14} aria-hidden /> : <X size={14} aria-hidden />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onBlur={() => markTouched('confirm')}
              required
              placeholder="Repeat password"
              className={touched.confirm && !confirmValid ? 'field-invalid' : ''}
              aria-invalid={touched.confirm && !confirmValid}
            />
            {touched.confirm && !confirmValid && <span className="field-error">Passwords do not match.</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
