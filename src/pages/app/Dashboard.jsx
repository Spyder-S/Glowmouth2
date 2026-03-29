import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AppShell from '../../components/AppShell';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { day: 'Mon', score: 78 },
  { day: 'Tue', score: 80 },
  { day: 'Wed', score: 79 },
  { day: 'Thu', score: 82 },
  { day: 'Fri', score: 81 },
  { day: 'Sat', score: 83 },
  { day: 'Sun', score: 84 },
];

const ZONES = [
  { name: 'Front Surfaces', score: 85, status: 'Good' },
  { name: 'Left Side', score: 62, status: 'Watch' },
  { name: 'Right Side', score: 79, status: 'Good' },
  { name: 'Rear / Back', score: 71, status: 'Good' },
];

const ACTIVITY = [
  { date: 'Today, 8:12 AM', score: 84, change: '+3', pos: true },
  { date: 'Yesterday, 7:55 AM', score: 81, change: '-2', pos: false },
  { date: 'March 26, 8:03 AM', score: 83, change: '+3', pos: true },
];

export default function Dashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AppShell title="Dashboard">
      <div className="dash-greeting">Good morning, {user?.name?.split(' ')[0]}.</div>
      <p className="dash-sub">Here's your oral health summary.</p>
      <p className="dash-date">{today}</p>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-card-label">Today's Score</span>
          <span className="stat-card-val">84</span>
          <span className="stat-card-sub">+3 from yesterday</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Streak</span>
          <span className="stat-card-val">7</span>
          <span className="stat-card-sub">days in a row</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Last Scan</span>
          <span className="stat-card-val" style={{ fontSize: 28 }}>Today</span>
          <span className="stat-card-sub">2 hours ago</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Plan</span>
          <span className="stat-card-val" style={{ fontSize: 24, textTransform: 'capitalize' }}>{user?.plan}</span>
          {user?.plan === 'free' && (
            <Link to="/upgrade" style={{ fontSize: 13, color: 'var(--teal)', display: 'block', marginTop: 6 }}>Upgrade →</Link>
          )}
        </div>
      </div>

      <div className="dash-main-grid">
        <div className="app-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--heading)' }}>GlowScore History</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E0DB',
                  borderRadius: '10px',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  color: '#1A1A1A'
                }}
                labelStyle={{ color: '#8A8A8A', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                itemStyle={{ color: '#1A1A1A' }}
                formatter={(value) => [`${value}`, 'GlowScore']}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0D9488"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0D9488', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#0D9488', stroke: '#E5E0DB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="app-card">
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--heading)', marginBottom: 20 }}>Zone Analysis</div>
          {ZONES.map(({ name, score, status }) => (
            <div key={name} className="zone-row">
              <span className="zone-name">{name}</span>
              <div className="zone-bar-track">
                <div className="zone-bar-fill" style={{ width: `${score}%`, background: status === 'Watch' ? '#F59E0B' : 'var(--teal)' }} />
              </div>
              <span className={`zone-badge ${status === 'Good' ? 'badge-good' : 'badge-watch'}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="app-card-dark" style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--text)', marginBottom: 6, fontWeight: 400 }}>Ready for today&apos;s scan?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Takes 2 minutes. Device connected and charged.</p>
        </div>
        <Link to="/scan" className="btn btn-primary">Start 2-Minute Scan →</Link>
      </div>

      <div className="app-card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--heading)' }}>Recent Scans</span>
          <Link to="/history" style={{ fontSize: 13, color: 'var(--teal)' }}>View all →</Link>
        </div>
        {ACTIVITY.map(({ date, score, change, pos }) => (
          <div key={date} className="activity-row">
            <span className="activity-date">{date}</span>
            <span className="activity-score">{score}</span>
            <span className="activity-change" style={{ color: pos ? '#16A34A' : '#DC2626' }}>{change}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
