export default function Logo({ variant = 'light', size = 36 }) {
  const wordmarkColor = variant === 'light' ? '#F5F3EE' : '#1A1A18';

  return (
    <div className="brand-lockup" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <defs>
          <linearGradient id="gm-brand-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E7D5E" />
            <stop offset="100%" stopColor="#1D5C4A" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#gm-brand-grad)" />
        <path d="M11 24.5C14.5 29 18.2 31 20 31C21.8 31 25.5 29 29 24.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M20 10.5L21.3 14.5L25.5 14.5L22.1 17L23.4 21L20 18.5L16.6 21L17.9 17L14.5 14.5L18.7 14.5Z" fill="white" />
      </svg>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: Math.round(size * 0.55),
          fontWeight: 700,
          color: wordmarkColor,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        GlowMouth
      </span>
    </div>
  );
}
