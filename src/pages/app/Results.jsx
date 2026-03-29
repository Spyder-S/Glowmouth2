import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { generateInsights } from '../../services/glowAI';
import { getSession } from '../../auth';

const ZONES = [
  { name: 'Front Surfaces', score: 85, status: 'Good', badge: 'badge-good' },
  { name: 'Left Side', score: 62, status: 'Watch', badge: 'badge-watch' },
  { name: 'Right Side', score: 79, status: 'Good', badge: 'badge-good' },
  { name: 'Rear / Back', score: 71, status: 'Good', badge: 'badge-good' },
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
  const score = raw ? parseInt(raw) : 84;
  const tier = score >= 80
    ? { label: 'Excellent', cls: 'badge-good' }
    : score >= 65
    ? { label: 'Good', cls: 'badge-watch' }
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
    runAI();
  }, []);

  return (
    <AppShell title="Results">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Score Hero */}
        <div className="results-hero">
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
            Your GlowScore
          </p>
          <div className="results-score">{score}</div>
          <div style={{ fontSize: 14, color: 'var(--teal)', margin: '12px 0' }}>↑ +3 from yesterday</div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, maxWidth: 300, margin: '0 auto 16px' }}>
            <div style={{ width: `${score}%`, height: '100%', background: 'var(--teal)', borderRadius: 3 }} />
          </div>
          <span className={`zone-badge ${tier.cls}`} style={{ fontSize: 14, padding: '6px 16px' }}>{tier.label}</span>
        </div>

        {/* Zone Breakdown */}
        <div className="app-card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--heading)', marginBottom: 20 }}>Zone Breakdown</div>
          {ZONES.map(({ name, score: s, status, badge }) => (
            <div key={name} className="zone-row">
              <span className="zone-name">{name}</span>
              <div className="zone-bar-track">
                <div className="zone-bar-fill" style={{ width: `${s}%`, background: status === 'Watch' ? '#F59E0B' : 'var(--teal)' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: 'var(--teal)', width: 36, textAlign: 'right', flexShrink: 0 }}>{s}</span>
              <span className={`zone-badge ${badge}`}>{status}</span>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="app-card" style={{ marginBottom: 24 }}>
          {aiLoading && (
            <>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                GlowMouth AI is analyzing your scan...
              </p>
              <SkeletonBar width="60%" height={20} />
              <SkeletonBar width="90%" />
              <SkeletonBar width="90%" />
              <SkeletonBar width="90%" />
            </>
          )}

          {aiError && !aiLoading && (
            <>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
                AI analysis unavailable right now. Check your connection and try again.
              </p>
              <button
                onClick={runAI}
                style={{ background: 'none', border: '1px solid var(--teal)', color: 'var(--teal)', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 14 }}
              >
                Retry
              </button>
            </>
          )}

          {aiInsights && !aiLoading && (
            <>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--heading)', margin: 0 }}>
                  AI Analysis
                </h3>
                <span style={{
                  background: 'rgba(13,148,136,0.1)',
                  border: '1px solid rgba(13,148,136,0.2)',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  color: 'var(--teal)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  POWERED BY CLAUDE
                </span>
              </div>

              {/* Summary */}
              <div className="disc" style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-body)', fontStyle: 'normal', margin: 0, lineHeight: 1.65 }}>
                  {aiInsights.summary}
                </p>
              </div>

              {/* Recommendations */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
                  RECOMMENDATIONS
                </div>
                {aiInsights.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: 'var(--teal)',
                      color: 'white', fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'var(--body)', lineHeight: 1.65, margin: 0 }}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>

              {/* Watch Zone */}
              <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L15 14H1L8 1Z" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="1.2"/>
                    <path d="M8 6v3M8 11v.5" stroke="#92400E" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, color: '#92400E' }}>Watch Zone</span>
                </div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#78350F', margin: 0 }}>
                  {aiInsights.watchZone}
                </p>
              </div>

              {/* Trend Analysis */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  TREND
                </div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'var(--body)', margin: 0 }}>
                  {aiInsights.trendAnalysis}
                </p>
              </div>

              {/* Motivation */}
              <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-body)', fontStyle: 'normal', margin: '0 0 8px', lineHeight: 1.65 }}>
                  {aiInsights.motivationMessage}
                </p>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  — GlowMouth AI
                </span>
              </div>

              {/* Disclaimer */}
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginTop: 16, marginBottom: 0 }}>
                ⚕ AI analysis is for wellness awareness only and is not medical advice.
                Always consult a licensed dentist for health concerns.
              </p>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/scan" className="btn btn-outline-teal">Scan Again</Link>
          <Link to="/history" className="ghost-cta" style={{ marginTop: 0, alignSelf: 'center' }}>View History →</Link>
        </div>
      </div>
    </AppShell>
  );
}
