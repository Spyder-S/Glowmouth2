import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AppShell from '../../components/AppShell';

function CheckIcon() {
  return (
    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#F0FDFA"/>
      <path d="M5 8l2.5 2.5L11 5.5" stroke="#0D9488" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Toast({ msg }) { return <div className="toast">{msg}</div>; }

const TABLE_ROWS = [
  ['Scans per month', '5', 'Unlimited', 'Unlimited'],
  ['GlowScore zones', '3 (basic)', '8 (full)', '8 (full)'],
  ['Scan history', '7 days', '365 days', '365 days'],
  ['AI zone analysis', '✗', '✓', '✓'],
  ['Trend charts', '✗', '✓', '✓'],
  ['Dentist PDF reports', '✗', '✗', '✓'],
  ['Priority support', '✗', '✗', '✓'],
  ['30-day Premium trial', '✗', '✓', '—'],
];

export default function Upgrade() {
  const { user, updateUser } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const handleUpgrade = () => {
    updateUser({ plan: 'premium' });
    setUpgraded(true);
    setToast('Welcome to Premium! 🎉');
    setTimeout(() => setToast(''), 4000);
  };

  if (upgraded || user?.plan === 'premium') {
    return (
      <AppShell title="Upgrade">
        {toast && <Toast msg={toast} />}
        <div style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 40, color: 'var(--heading)', marginBottom: 12 }}>
            Welcome to Premium.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
            All features unlocked. Unlimited scans, AI insights, full history, and dentist reports are now available.
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Upgrade">
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 0 48px' }}>
        <h2 className="upgrade-header">Unlock the full GlowMouth experience.</h2>
        <p style={{ fontSize: 17, color: 'var(--muted)', marginBottom: 40 }}>Everything you need to understand your oral biology.</p>

        <div className="price-toggle" style={{ justifyContent: 'flex-start' }}>
          <span style={{ fontWeight: annual ? 400 : 600, color: annual ? 'var(--muted)' : 'var(--heading)' }}>Monthly</span>
          <button className={`toggle-switch ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)}>
            <div className="toggle-knob" />
          </button>
          <span style={{ fontWeight: annual ? 600 : 400, color: annual ? 'var(--heading)' : 'var(--muted)' }}>
            Annual <span style={{ color: 'var(--teal)', fontSize: 12 }}>(save $19.88)</span>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 720, marginBottom: 40 }}>
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <span className="plan-label">Device</span>
            <div className="plan-price">$49.99</div>
            <div className="plan-per">one-time · includes 30-day Premium trial</div>
            <div className="plan-divider"/>
            <ul className="plan-features" style={{ marginBottom: 24 }}>
              {['GlowMouth 405nm QLF sensor','Enhanced scan accuracy','30-day Premium trial included','1-year warranty'].map(f => <li key={f}><CheckIcon />{f}</li>)}
            </ul>
            <button className="btn btn-primary btn-full" onClick={handleUpgrade}>Order Device + Trial</button>
          </div>
          <div className="pricing-card">
            <span className="plan-label">Premium</span>
            <div className="plan-price">{annual ? '$100' : '$9.99'}</div>
            <div className="plan-per">{annual ? '/year' : '/month'}</div>
            <div className="plan-divider"/>
            <ul className="plan-features" style={{ marginBottom: 24 }}>
              {['Unlimited scans','Advanced AI analysis','Early detection indicators','Full 365-day history','Dentist PDF reports','Priority support'].map(f => <li key={f}><CheckIcon />{f}</li>)}
            </ul>
            <button className="btn btn-outline-teal btn-full" onClick={handleUpgrade}>Upgrade Now</button>
          </div>
        </div>

        <div className="app-card" style={{ padding: 0, overflow: 'hidden', maxWidth: 800 }}>
          <table className="comp-table">
            <thead>
              <tr><th>Feature</th><th>Free</th><th>Device</th><th style={{ color: 'var(--teal)' }}>Premium</th></tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(([f, fr, d, p]) => (
                <tr key={f}>
                  <td>{f}</td>
                  <td>{fr}</td>
                  <td>{d}</td>
                  <td>{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
