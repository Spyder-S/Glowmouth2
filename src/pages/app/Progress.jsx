import { useState } from 'react';
import AppShell from '../../components/AppShell';
import useChartResizeFix from '../../hooks/useChartResizeFix';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList
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

// Days of scan history actually recorded for this account.
const DAYS_RECORDED = 34;

const DATA = {
  30: genAreaData(30),
};

const zoneData = [
  { zone: 'Front', start: 74, current: 85 },
  { zone: 'Left', start: 58, current: 62 },
  { zone: 'Right', start: 71, current: 79 },
  { zone: 'Back', start: 65, current: 71 },
];

const RANGE_LABELS = { 30: '30 Days', 60: '60 Days', 90: '90 Days' };

export default function Progress() {
  useChartResizeFix();
  const [range, setRange] = useState('30');
  const hasData = range === '30' || DAYS_RECORDED >= Number(range);
  const data = DATA[range] || DATA[30];
  const scores = data.map(d => d.score);
  const avg = 79;
  const best = 91;

  return (
    <AppShell title="Progress">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="eyebrow">Improvement over time</span>
          <h2 style={{ marginTop: 6 }}>Progress</h2>
        </div>
        <div className="prog-toggle">
          {[['30', '30 Days'], ['60', '60 Days'], ['90', '90 Days']].map(([v, l]) => (
            <button key={v} className={`prog-tab ${range === v ? 'active' : ''}`} onClick={() => setRange(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="stats-cards" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <div className="stat-card"><span className="stat-card-label">Avg Score (30d)</span><span className="stat-card-val" style={{ fontFamily: 'var(--mono)' }}>{avg}</span><span className="stat-card-sub">+6 vs. prior period</span></div>
        <div className="stat-card"><span className="stat-card-label">Best Score</span><span className="stat-card-val" style={{ fontFamily: 'var(--mono)' }}>{best}</span><span className="stat-card-sub">All time</span></div>
        <div className="stat-card"><span className="stat-card-label">Longest Streak</span><span className="stat-card-val" style={{ fontFamily: 'var(--mono)' }}>12</span><span className="stat-card-sub">days</span></div>
        <div className="stat-card"><span className="stat-card-label">Scans This Month</span><span className="stat-card-val" style={{ fontFamily: 'var(--mono)' }}>18</span><span className="stat-card-sub">of 31 days</span></div>
      </div>

      {!hasData ? (
        <div className="app-card" style={{ marginTop: 24, textAlign: 'center', padding: '48px 32px' }}>
          <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>Not enough data yet.</p>
          <p className="dashboard-copy" style={{ marginTop: 8, maxWidth: 420, marginInline: 'auto' }}>
            You'll need {range}+ days of scans to unlock this view. You've recorded {DAYS_RECORDED} of {range} days.
          </p>
          <div className="zone-bar-track" style={{ maxWidth: 320, margin: '20px auto 0' }}>
            <div className="zone-bar-fill" style={{ width: `${Math.min(100, (DAYS_RECORDED / Number(range)) * 100)}%`, background: 'var(--accent-glow)' }} />
          </div>
        </div>
      ) : (
        <div className="app-card" style={{ marginTop: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>GlowScore Trend</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last {RANGE_LABELS[range]}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D5C4A" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#1D5C4A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#A8A49C' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
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
                fill="url(#progressGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#1D5C4A', stroke: '#DDD9D0', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>Zone improvements</h3>
      <div className="app-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#DDD9D0', display: 'inline-block' }} />
            Previous period
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#1D5C4A', display: 'inline-block' }} />
            Current period
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11,
            color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase',
            paddingRight: 8, paddingBottom: 24, flexShrink: 0
          }}>GlowScore</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={zoneData} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="zone"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#A8A49C' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#A8A49C' }}
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
                labelStyle={{ color: '#6B6860', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                itemStyle={{ color: '#1A1A18' }}
                formatter={(value, name) => [value, name === 'start' ? 'Previous period' : 'Current period']}
              />
              <Bar dataKey="start" fill="#DDD9D0" radius={[4, 4, 0, 0]} name="start">
                <LabelList dataKey="start" position="top" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#A8A49C' }} />
              </Bar>
              <Bar dataKey="current" fill="#1D5C4A" radius={[4, 4, 0, 0]} name="current">
                <LabelList dataKey="current" position="top" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#1D5C4A' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
