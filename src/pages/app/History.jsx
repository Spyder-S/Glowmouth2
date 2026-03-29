import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateHistory = () => {
  const days = [];
  let score = 76;
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    score = Math.max(60, Math.min(95, score + (Math.random() > 0.4 ? 1 : -1) * Math.floor(Math.random() * 4)));
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      score,
    });
  }
  return days;
};

const HISTORY_DATA = generateHistory();

export default function History() {
  const [filter, setFilter] = useState('30');
  const filteredData = filter === '7' ? HISTORY_DATA.slice(-7) : HISTORY_DATA;

  return (
    <AppShell title="History">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: 'var(--heading)', marginBottom: 4 }}>Scan History</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>{HISTORY_DATA.length} total scans recorded</p>
        </div>
        <div className="prog-toggle">
          {[['7', '7 Days'], ['30', 'All Time']].map(([v, l]) => (
            <button key={v} className={`prog-tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="app-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--heading)' }}>GlowScore Trend</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{filter === '7' ? 'Last 7 days' : 'Last 30 days'}</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={filteredData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[55, 100]}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#9CA3AF' }}
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
              labelStyle={{ color: '#8A8A8A', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
              itemStyle={{ color: '#1A1A1A' }}
              formatter={(value) => [`${value}`, 'GlowScore']}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#0D9488"
              strokeWidth={2.5}
              fill="url(#tealGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#0D9488', stroke: '#E5E0DB', strokeWidth: 2 }}
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...filteredData].reverse().map(({ fullDate, score }, i) => (
              <tr key={i}>
                <td>{fullDate}</td>
                <td className="td-score">{score}</td>
                <td>
                  <span className={`zone-badge ${score >= 80 ? 'badge-good' : score >= 65 ? 'badge-watch' : 'badge-poor'}`}>
                    {score >= 80 ? 'Good' : score >= 65 ? 'Fair' : 'Low'}
                  </span>
                </td>
                <td><Link to="/results" style={{ color: 'var(--teal)', fontSize: 13 }}>View →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
