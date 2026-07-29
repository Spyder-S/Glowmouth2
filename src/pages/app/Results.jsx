import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import AppShell from '../../components/AppShell';
import OralHealthMap from '../../components/OralHealthMap';
import { generateInsights } from '../../services/glowAI';
import { getSession } from '../../auth';

const ZONES = [
  { name: 'Front Surfaces', score: 85, status: 'Good', badge: 'badge-good' },
  { name: 'Left Side', score: 62, status: 'Watch', badge: 'badge-watch' },
  { name: 'Right Side', score: 79, status: 'Good', badge: 'badge-good' },
  { name: 'Rear / Back', score: 71, status: 'Good', badge: 'badge-good' },
];

function zoneFillColor(score) {
  if (score >= 80) return 'var(--accent-glow)';
  if (score >= 60) return 'var(--amber)';
  return 'var(--red)';
}

function zoneTone(score) {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#F59E0B';
  return '#F97316';
}

const MAP_REGIONS = [
  { id: 'front', label: 'Front Surface', score: 85, status: 'Good', trend: '+2%', risk: 'Low', note: 'Stable enamel reflection and low plaque accumulation.', tone: zoneTone(85) },
  { id: 'left', label: 'Left Side', score: 62, status: 'Watch', trend: '-1%', risk: 'Moderate', note: 'Recurring bacterial activity near posterior left molars.', tone: zoneTone(62) },
  { id: 'right', label: 'Right Side', score: 79, status: 'Good', trend: '+3%', risk: 'Low', note: 'Recovery trend is consistent across the right arch.', tone: zoneTone(79) },
  { id: 'rear', label: 'Rear / Back', score: 71, status: 'Good', trend: '+1%', risk: 'Low', note: 'Slightly elevated fluorescence in rear contact points, trending down.', tone: zoneTone(71) },
];

function buildScanData(score) {
  const session = getSession();
  return {
    score,
    previousScore: score - 3,
    streak: 7,
    zones: {
      front: { score: 85, status: 'Good' },
      left:  { score: 62, status: 'Watch' },
      right: { score: 79, status: 'Good' },
      back:  { score: 71, status: 'Good' },
    },
    history: [78, 80, 79, 82, 81, 83, score],
    userName: session?.name || 'there',
  };
}

function SkeletonBar({ width, height = 14 }) {
  return (
    <div
      className="skeleton-bar"
      style={{ width, height, borderRadius: 4, marginBottom: 12 }}
    />
  );
}

export default function Results() {
  const raw = localStorage.getItem('gm_last_score');
  const hasScanned = Boolean(raw);
  const score = raw ? parseInt(raw) : 84;
  const tier = score >= 90
    ? { label: 'Excellent', cls: 'badge-good' }
    : score >= 80
    ? { label: 'Monitor', cls: 'badge-good' }
    : score >= 65
    ? { label: 'Watch', cls: 'badge-watch' }
    : { label: 'Needs Attention', cls: 'badge-poor' };

  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(false);

  const runAI = async () => {
    setAiLoading(true);
    setAiError(false);
    try {
      const scanData = buildScanData(score);
      const insights = await generateInsights(scanData);
      setAiInsights(insights);
    } catch (err) {
      console.error('[GlowMouth AI] Error:', err.message);
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (hasScanned) runAI();
    else setAiLoading(false);
  }, []);

  if (!hasScanned) {
    return (
      <AppShell title="Results">
        <div className="app-card" style={{ maxWidth: 560, margin: '60px auto 0', textAlign: 'center', padding: '48px 32px' }}>
          <span className="eyebrow">No results yet</span>
          <h3 style={{ marginTop: 8 }}>No scan on record.</h3>
          <p className="dashboard-copy" style={{ marginTop: 10 }}>
            Start your first scan to see your GlowScore, zone-specific findings, and AI interpretation here.
          </p>
          <Link to="/scan" className="btn btn-primary" style={{ marginTop: 20 }}>Start Scan</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Results">
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div className="results-hero">
          <div className="results-hero-top">
            <div>
              <span className="eyebrow">Executive summary</span>
              <h2 style={{ marginTop: 8 }}>Your oral health status is stable, with a positive trend.</h2>
              <p className="dashboard-copy" style={{ marginTop: 12, maxWidth: 720 }}>
                The current scan shows a strong overall score with one region worth monitoring more closely. The 7-day trend is moving in the right direction.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="oral-map-score">{score}</div>
              <div className={`zone-badge ${tier.cls}`} style={{ marginTop: 8, display: 'inline-flex' }}>{tier.label}</div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <OralHealthMap compact title="Your scan" subtitle="Biological activity by region" regions={MAP_REGIONS} />
          </div>
        </div>

        <div className="dash-main-grid" style={{ marginTop: 24 }}>
          <div className="app-card">
            <span className="eyebrow">Biological findings</span>
            <h3 style={{ marginTop: 8 }}>Zone-specific context</h3>
            <div style={{ marginTop: 18 }}>
              {ZONES.map(({ name, score: s, status, badge }) => (
                <div key={name} className="zone-row">
                  <span className="zone-name">{name}</span>
                  <div className="zone-bar-track">
                    <div className="zone-bar-fill" style={{ width: `${s}%`, background: zoneFillColor(s) }} />
                  </div>
                  <span style={{ fontFamily: 'var(--metric)', fontSize: 15, color: 'var(--text)', width: 36, textAlign: 'right', flexShrink: 0 }}>{s}</span>
                  <span className={`zone-badge ${badge}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="app-card">
            <span className="eyebrow">AI interpretation</span>
            <h3 style={{ marginTop: 8 }}>What the model is seeing</h3>
            {aiLoading && (
              <div style={{ marginTop: 18 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Analyzing scan data…</p>
                <SkeletonBar width="96%" />
                <SkeletonBar width="84%" />
                <SkeletonBar width="60%" height={28} />
              </div>
            )}
            {aiError && !aiLoading && (
              <div style={{ marginTop: 18 }}>
                <AlertCircle size={24} color="var(--amber)" aria-hidden />
                <p style={{ fontWeight: 700, color: 'var(--text)', marginTop: 12, fontSize: 16 }}>Analysis not available for this scan</p>
                <p className="dashboard-copy" style={{ marginTop: 8 }}>
                  Scan confidence was below the threshold required for interpretation. Try rescanning with better lighting and a fully charged device.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Link to="/scan" className="btn btn-primary btn-sm">Rescan now</Link>
                  <button onClick={runAI} className="btn btn-ghost-light btn-sm">View raw data</button>
                </div>
              </div>
            )}
            {aiInsights && !aiLoading && !aiError && (
              <div style={{ marginTop: 18 }}>
                <p className="dashboard-copy">{aiInsights.summary} {aiInsights.trendAnalysis}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                  <span className="finding-chip"><span className="finding-dot" style={{ background: 'var(--amber)' }} />Plaque Pattern · Moderate</span>
                  <span className="finding-chip"><span className="finding-dot" style={{ background: 'var(--accent-glow)' }} />Trend Direction · Improving</span>
                  <span className="finding-chip"><span className="finding-dot" style={{ background: 'var(--accent-glow)' }} />Risk Level · Low</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', margin: '18px 0 14px' }} />
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  AI analysis is for wellness awareness only and is not a clinical diagnosis. Consult a licensed dental professional for any clinical concerns.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="app-card" style={{ marginTop: 24 }}>
          <span className="eyebrow">Recommendations</span>
          <h3 style={{ marginTop: 8 }}>Recommended next actions</h3>
          {aiInsights && !aiLoading && (
            <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
              {aiInsights.recommendations.map((rec, i) => (
                <div key={rec} className="hero-mini-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div className="hero-mini-stat" style={{ fontSize: 24 }}>{i + 1}</div>
                  <p style={{ marginTop: 4 }}>{rec}</p>
                </div>
              ))}
            </div>
          )}
          <p style={{ marginTop: 18, fontSize: 12, color: 'var(--text-muted)' }}>
            GlowMouth AI is for wellness awareness only and is not medical advice.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <Link to="/scan" className="btn btn-primary">Scan again</Link>
          <Link to="/reports" className="btn btn-secondary">Export report</Link>
        </div>
      </div>
    </AppShell>
  );
}
