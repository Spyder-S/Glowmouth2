import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import useChartResizeFix from '../../hooks/useChartResizeFix';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateHistory = () => {
  const days = [];
  let score = 76;
  for (let i = 29; i >= 3; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    score = Math.max(60, Math.min(95, score + (Math.random() > 0.4 ? 1 : -1) * Math.floor(Math.random() * 4)));
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      score,
    });
  }

  // Canonical most-recent scores — must match Dashboard, Results, and Progress.
  const canonical = [79, 81, 84];
  for (let i = 2; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      score: canonical[2 - i],
    });
  }
  return days;
};

const HISTORY_DATA = generateHistory();

export default function History() {
  useChartResizeFix();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('30');
  const hasScanned = Boolean(localStorage.getItem('gm_last_score'));
  const filteredData = filter === '7' ? HISTORY_DATA.slice(-7) : HISTORY_DATA;

  if (!hasScanned) {
    return (
      <AppShell title="History">
        <div className="app-card" style={{ maxWidth: 560, margin: '60px auto 0', textAlign: 'center', padding: '48px 32px' }}>
          <span className="eyebrow">No history yet</span>
          <h3 style={{ marginTop: 8 }}>Your scan history will appear here.</h3>
          <p className="dashboard-copy" style={{ marginTop: 10 }}>
            Once you complete your first scan, every GlowScore will be tracked here so you can see your trend over time.
          </p>
          <Link to="/scan" className="btn btn-primary" style={{ marginTop: 20 }}>Start Scan</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="History">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="eyebrow">Longitudinal data</span>
          <h2 style={{ marginTop: 6 }}>Scan history</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{HISTORY_DATA.length} total scans recorded</p>
        </div>
        <div className="prog-toggle">
          {[['7', '7 Days'], ['30', 'All Time']].map(([v, l]) => (
            <button key={v} className={`prog-tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="app-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>GlowScore trend</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{filter === '7' ? 'Last 7 days' : 'Last 30 days'}</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={filteredData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D5C4A" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#1D5C4A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDD9D0" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#A8A49C' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[55, 100]}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#A8A49C' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #DDD9D0',
                borderRadius: '10px',
                fontFamily: 'Inter',
                fontSize: '13px',
                color: '#1A1A18'
              }}
              labelStyle={{ color: '#6B6860', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
              itemStyle={{ color: '#1A1A18' }}
              formatter={(value) => [`${value}`, 'GlowScore']}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#1D5C4A"
              strokeWidth={2.5}
              fill="url(#tealGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#1D5C4A', stroke: '#DDD9D0', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="app-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Change</th>
              <th>Status</th>
              <th className="hide-mobile">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...filteredData].reverse().map(({ fullDate, score }, i, arr) => {
              const prev = arr[i + 1]?.score;
              const change = prev !== undefined ? score - prev : null;
              return (
                <tr key={i} onClick={() => navigate('/results')} className="history-row">
                  <td>{fullDate}</td>
                  <td className="td-score">{score}</td>
                  <td>
                    {change === null ? (
                      <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                    ) : (
                      <span style={{ color: change >= 0 ? 'var(--accent-glow)' : 'var(--red)', fontWeight: 600 }}>
                        {change >= 0 ? '+' : ''}{change}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`zone-badge ${score >= 80 ? 'badge-good' : score >= 65 ? 'badge-watch' : 'badge-poor'}`}>
                      {score >= 80 ? 'Good' : score >= 65 ? 'Fair' : 'Low'}
                    </span>
                  </td>
                  <td className="hide-mobile"><Link to="/results" style={{ color: 'var(--accent)', fontSize: 13 }}>View →</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
