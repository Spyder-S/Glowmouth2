export default function Logo({ variant = 'light', size = 36 }) {
  const wordmarkColor = variant === 'light' ? '#fff' : '#1A1A1A';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="9" fill="#0D2B26"/>
        <path d="M10 22 Q18 29 26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M18 10 L19.2 13.8 L23.1 13.8 L20 16.1 L21.2 19.9 L18 17.6 L14.8 19.9 L16 16.1 L12.9 13.8 L16.8 13.8 Z" fill="white"/>
      </svg>
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: wordmarkColor, lineHeight: 1 }}>
        GlowMouth
      </span>
    </div>
  );
}
