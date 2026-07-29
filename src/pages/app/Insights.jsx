import { useState, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { generateInsights } from '../../services/glowAI';
import { getSession } from '../../auth';
import useChartResizeFix from '../../hooks/useChartResizeFix';

function genSparkline(end, volatility = 6) {
  const days = [];
  let v = end - volatility;
  for (let i = 0; i < 14; i++) {
    v = Math.max(40, Math.min(100, v + Math.round((Math.random() - 0.4) * volatility)));
    days.push({ day: i, score: v });
  }
  days[days.length - 1].score = end;
  return days;
}

const ZONE_TIMELINES = [
  { name: 'Front Surface', score: 85, data: genSparkline(85) },
  { name: 'Left Surface', score: 62, data: genSparkline(62) },
  { name: 'Right Surface', score: 79, data: genSparkline(79) },
  { name: 'Rear Surface', score: 71, data: genSparkline(71) },
];

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

const MIN_SCANS_FOR_INSIGHTS = 3;

export default function Insights() {
  useChartResizeFix();
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';
  const [pageInsights, setPageInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiError, setAiError] = useState(false);
  const scanCount = parseInt(localStorage.getItem('gm_scan_count') || '0', 10);
  const hasEnoughScans = scanCount >= MIN_SCANS_FOR_INSIGHTS;

  const loadInsights = () => {
    setLoading(true);
    setAiError(false);
    const raw = localStorage.getItem('gm_last_score');
    const score = raw ? parseInt(raw) : 84;
    const scanData = buildScanData(score);
    generateInsights(scanData)
      .then(data => setPageInsights(data))
      .catch(err => { console.error('[GlowMouth AI] Error:', err.message); setAiError(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!hasEnoughScans) { setLoading(false); return; }
    loadInsights();
  }, []);

  if (!hasEnoughScans) {
    return (
      <AppShell title="Insights">
        <div className="app-card" style={{ maxWidth: 560, margin: '60px auto 0', textAlign: 'center', padding: '48px 32px' }}>
          <span className="eyebrow">Building your intelligence feed</span>
          <h3 style={{ marginTop: 8 }}>Insights become available after your third scan.</h3>
          <p className="dashboard-copy" style={{ marginTop: 10 }}>
            You've completed {scanCount} of {MIN_SCANS_FOR_INSIGHTS} scans needed to unlock pattern recognition and trend analysis.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {Array.from({ length: MIN_SCANS_FOR_INSIGHTS }).map((_, i) => (
              <span key={i} style={{
                width: 32, height: 6, borderRadius: 3,
                background: i < scanCount ? 'var(--accent)' : 'var(--border)'
              }} />
            ))}
          </div>
          <Link to="/scan" className="btn btn-primary" style={{ marginTop: 24 }}>Start Scan</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Insights">
      <div className="results-hero">
        <span className="eyebrow">Personal oral intelligence</span>
        <h2 style={{ marginTop: 8 }}>A feed of patterns, forecasts, and biological context.</h2>
        <p className="dashboard-copy" style={{ marginTop: 10, maxWidth: 760 }}>
          Zone-level trends over the last 14 days — where the patterns actually come from.
        </p>
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          {ZONE_TIMELINES.map(({ name, score, data }) => (
            <div key={name} className="hero-mini-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>{name}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--text)' }}>{score}</span>
              </div>
              <div style={{ height: 48, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isPremium && (
        <div className="app-card" style={{ marginTop: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ filter: 'blur(4px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
            <span className="eyebrow">AI summary</span>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '10px 0' }}>Your left surface shows a recurring pattern worth a closer look.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
              <div className="insight-card"><div className="insight-title">Behavior trend</div></div>
              <div className="insight-card"><div className="insight-title">Watch zone</div></div>
            </div>
          </div>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(245,243,238,0.55)', padding: 24, textAlign: 'center'
          }}>
            <Sparkles size={22} color="var(--accent)" aria-hidden />
            <strong style={{ color: 'var(--text)' }}>Unlock the intelligence feed</strong>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 360 }}>Premium subscribers get full pattern analysis, personalized behavioral recommendations, and predictive context.</p>
            <Link to="/upgrade" className="btn btn-primary btn-sm">Upgrade to Premium</Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="app-card" style={{ marginTop: 24 }}>
          <div className="skeleton-bar" style={{ width: '30%', height: 14, borderRadius: 4, marginBottom: 16 }} />
          <div className="skeleton-bar" style={{ width: '80%', height: 24, borderRadius: 4, marginBottom: 12 }} />
          <div className="skeleton-bar" style={{ width: '60%', height: 14, borderRadius: 4 }} />
        </div>
      ) : pageInsights ? (
        <div className="app-card" style={{ marginTop: 24 }}>
          <span className="eyebrow">AI summary</span>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--text)', margin: '12px 0 10px', lineHeight: 1.25 }}>
            {pageInsights.summary}
          </p>
          <p className="dashboard-copy">{pageInsights.motivationMessage}</p>
        </div>
      ) : aiError ? (
        <div className="app-card" style={{ marginTop: 24 }}>
          <AlertCircle size={22} color="var(--amber)" aria-hidden />
          <p style={{ fontWeight: 700, color: 'var(--text)', marginTop: 12, fontSize: 16 }}>AI summary not available right now</p>
          <p className="dashboard-copy" style={{ marginTop: 6 }}>We couldn't generate a personalized summary for this session. Your scan data is unaffected.</p>
          <button onClick={loadInsights} className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>Retry</button>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginTop: 24 }}>
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard />
            <SkeletonCard /><SkeletonCard />
          </>
        ) : pageInsights ? (
          <>
            <div className="insight-card">
              <div className="eyebrow">Pattern recognition</div>
              <div className="insight-title">Behavior trend</div>
              <p className="insight-body">{pageInsights.trendAnalysis}</p>
            </div>
            <div className="insight-card">
              <div className="eyebrow">Biological changes</div>
              <div className="insight-title">Watch zone</div>
              <p className="insight-body">{pageInsights.watchZone}</p>
            </div>
            <div className="insight-card">
              <div className="eyebrow">Recommendations</div>
              <div className="insight-title">Top action</div>
              <p className="insight-body">{pageInsights.recommendations[0]}</p>
            </div>
            <div className="insight-card">
              <div className="eyebrow">Forecasting</div>
              <div className="insight-title">Next step</div>
              <p className="insight-body">{pageInsights.recommendations[1]}</p>
            </div>
          </>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginTop: 24 }}>
        {STATIC_INSIGHTS.map(({ icon, title, body }) => (
          <div key={title} className="insight-card">
            <div className="eyebrow">{icon}</div>
            <div className="insight-title">{title}</div>
            <p className="insight-body">{body}</p>
          </div>
        ))}
      </div>

      <div className="app-card" style={{ marginTop: 24 }}>
        <div className="results-hero-top" style={{ marginBottom: 20 }}>
          <span className="eyebrow">Learn</span>
          <span style={{ color: 'var(--text-muted)' }}>Research-backed guidance and educational context.</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
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
