import { useMemo, useState } from 'react';

const DEFAULT_REGIONS = [
  {
    id: 'front',
    label: 'Front Surface',
    score: 92,
    status: 'Healthy',
    trend: '+4%',
    risk: 'Low',
    note: 'Stable enamel reflection and low plaque accumulation.',
    tone: '#22C55E',
  },
  {
    id: 'left',
    label: 'Left Surface',
    score: 68,
    status: 'Monitor',
    trend: '-2%',
    risk: 'Moderate',
    note: 'Recurring bacterial activity near posterior left molars.',
    tone: '#F59E0B',
  },
  {
    id: 'right',
    label: 'Right Surface',
    score: 84,
    status: 'Healthy',
    trend: '+1%',
    risk: 'Low',
    note: 'Recovery trend is consistent across the right arch.',
    tone: '#22C55E',
  },
  {
    id: 'rear',
    label: 'Rear Surface',
    score: 73,
    status: 'Elevated',
    trend: '-3%',
    risk: 'Elevated',
    note: 'Higher fluorescence activity in rear contact points.',
    tone: '#F97316',
  },
];

export default function OralHealthMap({ compact = false, title = 'Oral Health Map', subtitle = 'Biological activity by region', regions = DEFAULT_REGIONS }) {
  const [activeId, setActiveId] = useState(regions[0]?.id || 'front');
  const activeRegion = useMemo(() => regions.find((region) => region.id === activeId) || regions[0], [activeId, regions]);

  return (
    <section className={`oral-map ${compact ? 'oral-map-compact' : ''}`} aria-label={title}>
      <div className="oral-map-header">
        <div>
          <div className="eyebrow">{title}</div>
          <h3 className="oral-map-title">{subtitle}</h3>
        </div>
        <div className="oral-map-badges">
          <span className="status-pill status-pill-live">Live</span>
          <span className="status-pill">Confidence 94%</span>
        </div>
      </div>

      <p className="visually-hidden">
        {regions.map((r) => `${r.label}: ${r.score}, ${r.status}.`).join(' ')}
      </p>

      <div className="oral-map-grid">
        <div className="oral-map-visual" aria-hidden>
          <div className="oral-map-halo" />
          <svg viewBox="0 0 480 420" role="presentation">
            <defs>
              <linearGradient id="gm-mouth-shell" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F4F2EC" />
              </linearGradient>
              <linearGradient id="gm-mouth-glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3FAF7E" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1D5C4A" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <ellipse cx="240" cy="228" rx="155" ry="114" fill="url(#gm-mouth-shell)" stroke="rgba(17,24,39,0.08)" strokeWidth="2" />
            <ellipse cx="240" cy="228" rx="112" ry="76" fill="#FFFFFF" stroke="rgba(17,24,39,0.08)" strokeWidth="1.5" />
            <path d="M147 162C160 129 196 112 240 112C284 112 320 129 333 162" stroke="rgba(17,24,39,0.12)" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M147 294C160 327 196 344 240 344C284 344 320 327 333 294" stroke="rgba(17,24,39,0.12)" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6" />
            <circle cx="240" cy="228" r="41" fill="url(#gm-mouth-glow)" opacity="0.85" />
            {regions.map((region, index) => {
              const points = [
                { cx: 240, cy: 146 },
                { cx: 166, cy: 226 },
                { cx: 314, cy: 226 },
                { cx: 240, cy: 308 },
              ];
              const point = points[index] || points[0];
              const isActive = activeRegion?.id === region.id;
              return (
                <g key={region.id} transform={`translate(${point.cx}, ${point.cy})`}>
                  <circle r={isActive ? 42 : 34} fill={region.tone} fillOpacity={isActive ? 0.18 : 0.12} />
                  <circle r={isActive ? 17 : 13} fill={region.tone} fillOpacity={0.95} />
                  <circle r={isActive ? 28 : 22} fill="none" stroke={region.tone} strokeOpacity={isActive ? 0.4 : 0.22} strokeWidth="2" />
                </g>
              );
            })}
            <path d="M198 170C215 162 265 162 282 170" stroke="rgba(17,24,39,0.12)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M198 286C215 294 265 294 282 286" stroke="rgba(17,24,39,0.12)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="oral-map-panel">
          <div className="oral-map-tabs" role="tablist" aria-label="Oral health regions">
            {regions.map((region) => (
              <button
                key={region.id}
                type="button"
                role="tab"
                aria-selected={activeRegion?.id === region.id}
                className={`oral-map-tab ${activeRegion?.id === region.id ? 'active' : ''}`}
                onClick={() => setActiveId(region.id)}
                onMouseEnter={() => setActiveId(region.id)}
              >
                <span>{region.label}</span>
                <strong>{region.score}</strong>
              </button>
            ))}
          </div>

          <div className="oral-map-detail">
            <div className="oral-map-detail-top">
              <div>
                <div className="oral-map-detail-label">Selected region</div>
                <h4>{activeRegion?.label}</h4>
              </div>
              <div className="oral-map-score">{activeRegion?.score}</div>
            </div>
            <div className="oral-map-metrics">
              <div>
                <span>Health</span>
                <strong>{activeRegion?.status}</strong>
              </div>
              <div>
                <span>Trend</span>
                <strong>{activeRegion?.trend}</strong>
              </div>
              <div>
                <span>Risk</span>
                <strong>{activeRegion?.risk}</strong>
              </div>
            </div>
            <p className="oral-map-note">{activeRegion?.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
