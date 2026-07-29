import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import AppShell from '../../components/AppShell';

const PREV_REPORTS = [
  { label: 'March 2026', range: 'Mar 1 – Mar 27', scans: 27, avg: 82 },
  { label: 'February 2026', range: 'Feb 1 – Feb 28', scans: 24, avg: 79 },
  { label: 'January 2026', range: 'Jan 1 – Jan 31', scans: 20, avg: 74 },
];

const LOCKED_PREVIEWS = [
  { title: 'June 2026 Summary', body: 'A full monthly overview of your GlowScore trend, zone activity, and consistency.' },
  { title: 'Dentist Export — Jun 15', body: 'A clean, shareable PDF formatted for your dentist with scan history and findings.' },
  { title: '30-Day Biological Trend', body: 'Zone-by-zone change over the last 30 days, with confidence and risk context.' },
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
        <div className="app-card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'left' }}>
          <span className="eyebrow">Premium reports</span>
          <h3 style={{ marginTop: 8 }}>Executive-grade oral health reports are a Premium feature.</h3>
          <p style={{ fontSize: 15, color: 'var(--text-body)', marginBottom: 24, lineHeight: 1.65 }}>
            Generate print-ready reports with summary insights, trend context, and a dentist-sharing workflow.
          </p>
          <Link to="/upgrade" className="btn btn-primary">Upgrade to Premium →</Link>
        </div>

        <div style={{ maxWidth: 720, margin: '32px auto 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
            {LOCKED_PREVIEWS.map(({ title, body }) => (
              <div key={title} className="report-thumb">
                <div className="report-thumb-blur">
                  <span className="eyebrow">Report</span>
                  <h4 style={{ marginTop: 8, fontSize: 16 }}>{title}</h4>
                  <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>{body}</p>
                </div>
                <div className="report-thumb-lock">
                  <Lock size={18} aria-hidden />
                  <span>{title}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Upgrade to Premium to generate and share reports with your dentist.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Reports">
      {toast && <Toast msg={toast} />}
      <div className="results-hero">
        <span className="eyebrow">Report workspace</span>
        <h2 style={{ marginTop: 8 }}>Premium oral intelligence reports.</h2>
        <p className="dashboard-copy" style={{ marginTop: 10, maxWidth: 760 }}>
          Create export-ready summaries for yourself or your dentist. The format should feel credible, polished, and easy to act on.
        </p>
        <div className="stat-inline-row" style={{ marginTop: 24 }}>
          <div className="stat-inline"><strong>{PREV_REPORTS.length}</strong><span>reports generated</span></div>
          <div className="stat-inline-divider" />
          <div className="stat-inline"><strong>+8</strong><span>avg score change</span></div>
          <div className="stat-inline-divider" />
          <div className="stat-inline"><strong>71</strong><span>total scans logged</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, marginTop: 24 }}>
        <div className="app-card">
          <span className="eyebrow">Generate report</span>
          <div className="field">
            <label>Date Range</label>
            <select value={range} onChange={e => setRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Includes executive summary, biological findings, trend context, and action plan.
          </p>
          <button className="btn btn-primary btn-full" onClick={() => showToast('Report ready — download starting...')}>
            Generate PDF Report
          </button>
        </div>
        <div className="app-card">
          <span className="eyebrow">Share with dentist</span>
          <div className="field"><label>Dentist Email</label><input type="email" placeholder="dentist@clinic.com"/></div>
          <div className="field"><label>Note (optional)</label><textarea style={{ height: 72, resize: 'none' }} placeholder="Hi Dr. Smith, here's my latest GlowMouth oral health report..."/></div>
          <button className="btn btn-outline-teal btn-full" onClick={() => showToast('Report sent to your dentist!')}>
            Send Report
          </button>
        </div>
      </div>

      <div className="app-card" style={{ marginTop: 24, padding: 0, overflow: 'hidden' }}>
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
