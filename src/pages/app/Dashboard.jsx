import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AppShell from '../../components/AppShell';
import useChartResizeFix from '../../hooks/useChartResizeFix';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { day: 'Mon', score: 78 },
  { day: 'Tue', score: 80 },
  { day: 'Wed', score: 79 },
  { day: 'Thu', score: 82 },
  { day: 'Fri', score: 81 },
  { day: 'Sat', score: 83 },
  { day: 'Sun', score: 84 },
];

const ACTIVITY = [
  { date: 'Today, 8:12 AM', score: 84, change: '+3', pos: true },
  { date: 'Yesterday, 7:55 AM', score: 81, change: '-2', pos: false },
  { date: 'March 26, 8:03 AM', score: 83, change: '+3', pos: true },
];

export default function Dashboard() {
  useChartResizeFix();
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(' ')[0];
  const greeting = firstName && firstName.length >= 2 ? `Good morning, ${firstName}.` : 'Good morning.';

  return (
    <AppShell title="Dashboard">
      <div className="dash-greeting">{greeting}</div>

      <div className="app-card dash-summary" style={{ marginTop: 32 }}>
        <div className="dash-summary-main">
          <span className="eyebrow">GlowScore</span>
          <div className="dash-summary-score">84</div>
          <p className="dashboard-copy">You're trending in the right direction — up 3 points this week. The left surface remains the region to monitor most closely.</p>
          <Link to="/scan" className="btn btn-primary" style={{ marginTop: 8 }}>Start Scan</Link>
        </div>
        <div className="dash-summary-stats">
          <div>
            <span className="stat-card-label">Weekly change</span>
            <span className="stat-card-val" style={{ fontSize: 32 }}>+3</span>
          </div>
          <div>
            <span className="stat-card-label">Status</span>
            <span className="stat-card-val" style={{ fontSize: 28 }}>Monitor</span>
          </div>
        </div>
      </div>

      <div className="app-card insight-lead" style={{ marginTop: 24 }}>
        <div className="results-hero-top" style={{ marginBottom: 12 }}>
          <div>
            <span className="eyebrow">Insight</span>
            <h3 style={{ marginTop: 6 }}>What to watch this week.</h3>
          </div>
        </div>
        <p className="dashboard-copy">
          Recurring bacterial activity on the left side has shown up in the last three scans. Consistency has improved 12% over the past month — keep evening scan timing steady and expect a predicted score of 87 next week.
        </p>
      </div>

      <div className="app-card" style={{ marginTop: 24 }}>
        <div className="results-hero-top" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">Weekly trend</span>
            <h3 style={{ marginTop: 6 }}>Score over the last 7 days.</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dashTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D5C4A" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#1D5C4A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#A8A49C' }} axisLine={false} tickLine={false} />
            <YAxis domain={[60, 100]} tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#A8A49C' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 20px 50px rgba(26,26,24,0.12)' }}
              labelFormatter={(label, payload) => payload?.[0] ? `${label}` : label}
              formatter={(value, name, item) => {
                const idx = trendData.findIndex(d => d.day === item.payload.day);
                const prev = idx > 0 ? trendData[idx - 1].score : null;
                const change = prev !== null ? value - prev : null;
                return [`${value}${change !== null ? ` (${change >= 0 ? '+' : ''}${change})` : ''}`, 'GlowScore'];
              }}
            />
            <Area type="monotone" dataKey="score" stroke="#1D5C4A" strokeWidth={2.8} fill="url(#dashTrend)" dot={{ r: 4, fill: '#1D5C4A', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#1D5C4A' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="app-card" style={{ marginTop: 24 }}>
        <div className="results-hero-top" style={{ marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Recent activity</span>
            <h3 style={{ marginTop: 6 }}>Scans, reports, and actions.</h3>
          </div>
          <Link to="/history" style={{ color: 'var(--accent)' }}>View all →</Link>
        </div>
        {ACTIVITY.map(({ date, score, change, pos }) => (
          <div key={date} className="activity-row">
            <span className="activity-date" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="activity-status-dot" style={{ background: pos ? 'var(--accent-glow)' : 'var(--red)' }} />
              {date}
            </span>
            <span className="activity-score">{score}</span>
            <span className="activity-change" style={{ color: pos ? 'var(--accent-glow)' : 'var(--red)' }}>{change}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
