import { useState } from 'react';
import AppShell from '../../components/AppShell';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

function genAreaData(n, startScore = 72) {
  const days = [];
  let score = startScore;
  for (let i = 0; i < n; i++) {
    score = Math.max(60, Math.min(95, score + Math.round(12 / n) + Math.round(Math.sin(i / 4) * 1.5)));
    days.push({ day: `Day ${i + 1}`, score });
  }
  return days;
}

const DATA = {
  30: genAreaData(30),
  60: genAreaData(60),
  90: genAreaData(90),
};

const zoneData = [
  { zone: 'Front', start: 74, current: 88 },
  { zone: 'Left',  start: 68, current: 79 },
  { zone: 'Right', start: 71, current: 83 },
  { zone: 'Back',  start: 65, current: 76 },
];

export default function Progress() {
  const [range, setRange] = useState('30');
  const data = DATA[range];
  const scores = data.map(d => d.score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return (
    <AppShell title="Progress">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: 'var(--heading)' }}>Progress</h2>
        <div className="prog-toggle">
          {[['30','30 Days'], ['60','60 Days'], ['90','90 Days']].map(([v, l]) => (
            <button key={v} className={`prog-tab ${range === v ? 'active' : ''}`} onClick={() => setRange(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="stats-cards" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <div className="stat-card"><span className="stat-card-label">Avg Score ({range}d)</span><span className="stat-card-val">{avg}</span><span className="stat-card-sub">+6 vs. prior period</span></div>
        <div className="stat-card"><span className="stat-card-label">Best Score</span><span className="stat-card-val">{Math.max(...scores)}</span><span className="stat-card-sub">All time</span></div>
        <div className="stat-card"><span className="stat-card-label">Longest Streak</span><span className="stat-card-val">12</span><span className="stat-card-sub">days</span></div>
        <div className="stat-card"><span className="stat-card-label">Scans This Month</span><span className="stat-card-val">18</span><span className="stat-card-sub">of 31 days</span></div>
      </div>

      <div className="app-card" style={{ marginTop: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--heading)' }}>GlowScore Trend</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Last {range} days</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
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
              fill="url(#progressGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#0D9488', stroke: '#E5E0DB', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--heading)', marginBottom: 16 }}>Zone Improvements</h3>
      <div className="app-card">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={zoneData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="zone"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
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
              formatter={(value, name) => [value, name === 'start' ? 'Baseline' : 'Current']}
            />
            <Bar dataKey="start" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="start" />
            <Bar dataKey="current" fill="#0D9488" radius={[4, 4, 0, 0]} name="current" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppShell>
  );
}
