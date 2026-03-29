import { useState, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import { generateInsights } from '../../services/glowAI';
import { getSession } from '../../auth';

const ARTICLES = [
  { tag: 'Science', title: 'What is QLF technology?', sub: 'How 405nm light reveals bacteria invisible to the naked eye.' },
  { tag: 'Health', title: 'Why oral health affects your heart', sub: 'The oral-systemic connection explained.' },
  { tag: 'Habits', title: 'Building a daily scan routine', sub: 'The habit loop: cue, routine, reward — applied to oral health.' },
  { tag: 'Product', title: 'Understanding your GlowScore', sub: 'How the 1–100 score is calculated from your scan data.' },
];

const STATIC_INSIGHTS = [
  { icon: '🔁', title: 'Scan Frequency', body: 'Scanning 5+ times per week produces 23% richer trend data. You\'ve averaged 4.2 — push for one more session per week.' },
  { icon: '📊', title: 'User Comparison', body: 'Your average score of 84 is above the user median of 79. Early-detection awareness and consistency are driving your results.' },
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

function SkeletonCard() {
  return (
    <div className="insight-card">
      <div className="skeleton-bar" style={{ width: '40%', height: 14, borderRadius: 4, marginBottom: 12 }} />
      <div className="skeleton-bar" style={{ width: '90%', height: 12, borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton-bar" style={{ width: '75%', height: 12, borderRadius: 4 }} />
    </div>
  );
}

export default function Insights() {
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';
  const [pageInsights, setPageInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('gm_last_score');
    const score = raw ? parseInt(raw) : 84;
    const scanData = buildScanData(score);
    generateInsights(scanData)
      .then(data => setPageInsights(data))
      .catch(err => console.error('[GlowMouth AI] Error:', err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Insights">
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--text)', marginBottom: 8, fontWeight: 400 }}>
        Your personalized insights
      </h2>
      <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>
        Based on your last 30 scans and behavior patterns.
      </p>

      {!isPremium && (
        <div className="app-card" style={{ marginBottom: 24, borderLeft: '3px solid var(--accent)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>✨</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Unlock AI-powered insights</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Premium subscribers get full pattern analysis, personalized behavioral recommendations, and biological context for every biomarker.</p>
          </div>
          <Link to="/upgrade" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Upgrade</Link>
        </div>
      )}

      {/* AI Summary Card — full width */}
      {loading ? (
        <div className="app-card" style={{ marginBottom: 16 }}>
          <div className="skeleton-bar" style={{ width: '30%', height: 14, borderRadius: 4, marginBottom: 16 }} />
          <div className="skeleton-bar" style={{ width: '80%', height: 28, borderRadius: 4, marginBottom: 12 }} />
          <div className="skeleton-bar" style={{ width: '60%', height: 14, borderRadius: 4 }} />
        </div>
      ) : pageInsights ? (
        <div className="app-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-hidden>
              <rect width="36" height="36" rx="9" fill="#1A1A1A"/>
              <path d="M10 22 Q18 29 26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M18 10 L19.2 13.8 L23.1 13.8 L20 16.1 L21.2 19.9 L18 17.6 L14.8 19.9 L16 16.1 L12.9 13.8 L16.8 13.8 Z" fill="white"/>
            </svg>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>GlowMouth AI</span>
            <span style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '3px 8px',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginLeft: 'auto'
            }}>Powered by Claude</span>
          </div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--text)', fontStyle: 'normal', margin: '0 0 12px', lineHeight: 1.3 }}>
            {pageInsights.summary}
          </p>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--text-body)', margin: 0, lineHeight: 1.65 }}>
            {pageInsights.motivationMessage}
          </p>
        </div>
      ) : null}

      {/* 4-card AI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard />
            <SkeletonCard /><SkeletonCard />
          </>
        ) : pageInsights ? (
          <>
            <div className="insight-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>📈</div>
              <div className="insight-title">Your Trend</div>
              <p className="insight-body">{pageInsights.trendAnalysis}</p>
            </div>
            <div className="insight-card" style={{ borderLeft: '3px solid #F59E0B' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>⚠️</div>
              <div className="insight-title">Watch Zone</div>
              <p className="insight-body">{pageInsights.watchZone}</p>
            </div>
            <div className="insight-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>🦷</div>
              <div className="insight-title">Top Recommendation</div>
              <p className="insight-body">{pageInsights.recommendations[0]}</p>
            </div>
            <div className="insight-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>✅</div>
              <div className="insight-title">Next Step</div>
              <p className="insight-body">{pageInsights.recommendations[1]}</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Static insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {STATIC_INSIGHTS.map(({ icon, title, body }) => (
          <div key={title} className="insight-card">
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div className="insight-title">{title}</div>
            <p className="insight-body">{body}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--heading)' }}>Learn</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {ARTICLES.map(({ tag, title, sub }) => (
            <div key={title} className="learn-card">
              <span className="learn-tag">{tag}</span>
              <div className="learn-title">{title}</div>
              <p className="learn-sub">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
