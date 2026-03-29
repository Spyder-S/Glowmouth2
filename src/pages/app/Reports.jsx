import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AppShell from '../../components/AppShell';

const PREV_REPORTS = [
  { label: 'March 2026', range: 'Mar 1 – Mar 27', scans: 27, avg: 82 },
  { label: 'February 2026', range: 'Feb 1 – Feb 28', scans: 24, avg: 79 },
  { label: 'January 2026', range: 'Jan 1 – Jan 31', scans: 20, avg: 74 },
];

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

export default function Reports() {
  const { user } = useAuth();
  const [toast, setToast] = useState('');
  const [range, setRange] = useState('30');
  const isPremium = user?.plan === 'premium';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (!isPremium) {
    return (
      <AppShell title="Reports">
        <div className="app-card" style={{ maxWidth: 560, margin: '60px auto 0', textAlign: 'center', padding: 48 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 20px' }}>
            <rect x="8" y="2" width="28" height="36" rx="4" fill="none" stroke="#9CA3AF" strokeWidth="2"/>
            <path d="M16 14h16M16 20h16M16 26h10" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="36" cy="36" r="10" fill="#1A1A1A"/>
            <path d="M33 36h6M36 33v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, color: 'var(--heading)', marginBottom: 12 }}>
            Reports are a Premium feature.
          </h3>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.65 }}>
            Generate shareable PDF summaries of your GlowScore trends to bring to your dentist.
            Upgrade to Premium to unlock reports.
          </p>
          <Link to="/upgrade" className="btn btn-primary">Upgrade to Premium →</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Reports">
      {toast && <Toast msg={toast} />}
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: 'var(--heading)', marginBottom: 24 }}>Reports</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="app-card">
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--heading)', marginBottom: 16 }}>Generate New Report</div>
          <div className="field">
            <label>Date Range</label>
            <select value={range} onChange={e => setRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            The report includes GlowScore trend chart, zone analysis, and AI recommendations.
          </p>
          <button className="btn btn-primary btn-full" onClick={() => showToast('Report ready — download starting...')}>
            Generate PDF Report
          </button>
        </div>
        <div className="app-card">
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--heading)', marginBottom: 16 }}>Share with Dentist</div>
          <div className="field"><label>Dentist Email</label><input type="email" placeholder="dentist@clinic.com"/></div>
          <div className="field"><label>Note (optional)</label><textarea style={{ height: 72, resize: 'none' }} placeholder="Hi Dr. Smith, here's my latest GlowMouth oral health report..."/></div>
          <button className="btn btn-outline-teal btn-full" onClick={() => showToast('Report sent to your dentist!')}>
            Send Report
          </button>
        </div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--heading)', marginBottom: 16 }}>Previous Reports</div>
      <div className="app-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr><th>Report</th><th>Range</th><th>Scans</th><th>Avg Score</th><th>Action</th></tr>
          </thead>
          <tbody>
            {PREV_REPORTS.map(r => (
              <tr key={r.label}>
                <td style={{ fontWeight: 500 }}>{r.label}</td>
                <td>{r.range}</td>
                <td>{r.scans}</td>
                <td className="td-score">{r.avg}</td>
                <td><button className="ghost-cta" style={{ margin: 0, fontSize: 13 }} onClick={() => showToast('Downloading...')}>Download →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
