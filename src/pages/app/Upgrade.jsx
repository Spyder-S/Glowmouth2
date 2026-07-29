import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AppShell from '../../components/AppShell';

function CheckIcon() {
  return (
    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l3.2 3.2L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
];

const ANNUAL_PRICE = 89.88;
const MONTHLY_PRICE = 9.99;
const ANNUAL_SAVINGS = (MONTHLY_PRICE * 12 - ANNUAL_PRICE).toFixed(2);

export default function Upgrade() {
  const { user, updateUser } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [toast, setToast] = useState('');

  const handleUpgrade = () => {
    updateUser({ plan: 'premium' });
    setUpgraded(true);
    setToast('Welcome to Premium.');
    setTimeout(() => setToast(''), 4000);
  };

  if (upgraded || user?.plan === 'premium') {
    return (
      <AppShell title="Upgrade">
        {toast && <Toast msg={toast} />}
        <div className="app-card" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
          <span className="eyebrow">Premium</span>
          <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 32, color: 'var(--text)', margin: '8px 0 12px' }}>
            Welcome to Premium.
          </h2>
          <p className="dashboard-copy" style={{ marginBottom: 28 }}>
            All features unlocked. Unlimited scans, AI insights, full history, and dentist reports are now available.
          </p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Upgrade">
      {toast && <Toast msg={toast} />}
      <span className="eyebrow">Upgrade</span>
      <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 32, color: 'var(--text)', margin: '8px 0 8px' }}>
        Unlock the full GlowMouth experience.
      </h2>
      <p className="dashboard-copy" style={{ marginBottom: 28, maxWidth: 560 }}>Everything you need to understand your oral biology.</p>

      <div className="app-card" style={{ marginBottom: 20 }}>
        <div className="results-hero-top" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">The sensor · one-time purchase</span>
            <h3 style={{ marginTop: 6 }}>$49.99 — no subscription required.</h3>
          </div>
        </div>
        <p className="dashboard-copy" style={{ marginBottom: 16, maxWidth: 560 }}>
          Adds 405nm QLF analysis, zone-level biological mapping, and a 30-day Premium trial.
        </p>
        <ul className="plan-features" style={{ marginBottom: 20, maxWidth: 420 }}>
          {['GlowMouth 405nm QLF sensor', 'Enhanced scan accuracy', '30-day Premium trial included', '1-year warranty'].map(f => <li key={f}><CheckIcon />{f}</li>)}
        </ul>
        <button className="btn btn-primary" onClick={handleUpgrade}>Order the Sensor →</button>
      </div>

      <div className="app-card" style={{ marginBottom: 24 }}>
        <div className="results-hero-top" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow">Premium subscription</span>
            <h3 style={{ marginTop: 6 }}>{annual ? `$${(ANNUAL_PRICE / 12).toFixed(2)}/mo` : `$${MONTHLY_PRICE}/mo`}</h3>
          </div>
          <div className="price-toggle" style={{ margin: 0 }}>
            <span style={{ fontWeight: annual ? 400 : 600, color: annual ? 'var(--text-muted)' : 'var(--text)' }}>Monthly</span>
            <button type="button" className={`toggle-switch ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)} aria-label="Toggle annual billing">
              <div className="toggle-knob" />
            </button>
            <span style={{ fontWeight: annual ? 600 : 400, color: annual ? 'var(--text)' : 'var(--text-muted)' }}>
              Annual <span style={{ color: annual ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12 }}>(save ${ANNUAL_SAVINGS})</span>
            </span>
          </div>
        </div>
        {annual && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>Billed ${ANNUAL_PRICE}/year.</p>}
        <ul className="plan-features" style={{ marginBottom: 20, maxWidth: 420 }}>
          {['Unlimited scans', 'Advanced AI fluorescence interpretation', 'Early biological change indicators', 'Full 365-day score history', 'Shareable dentist PDF reports', 'Priority support'].map(f => <li key={f}><CheckIcon />{f}</li>)}
        </ul>
        <button className="btn btn-primary" onClick={handleUpgrade}>Start 30-day trial →</button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        No long-term contract. Cancel your Premium subscription anytime. The sensor is yours to keep.
      </p>

      <div className="app-card" style={{ padding: 0, overflow: 'hidden', maxWidth: 800 }}>
        <table className="comp-table">
          <thead>
            <tr><th>Feature</th><th>Free</th><th>Device</th><th style={{ color: 'var(--accent)' }}>Premium</th></tr>
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
    </AppShell>
  );
}
