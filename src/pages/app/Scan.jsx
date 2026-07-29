import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';

const PHASE_LABELS = [
  'Analyzing front surfaces...',
  'Analyzing left side...',
  'Analyzing right side...',
  'Analyzing rear surfaces...',
];

function genScore() {
  const stored = localStorage.getItem('gm_last_score');
  if (stored) {
    const prev = parseInt(stored);
    const delta = Math.floor(Math.random() * 7) - 3;
    return Math.min(95, Math.max(60, prev + delta));
  }
  return Math.floor(Math.random() * 16) + 75;
}

export default function Scan() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(20);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (step !== 1) return;
    setProgress(0); setCountdown(20);
    let pct = 0;
    let count = 20;
    let phaseCount = 0;
    intervalRef.current = setInterval(() => {
      pct += 1.25;
      count = Math.max(0, 20 - Math.floor(pct * 0.2));
      if (pct >= 25 && phaseCount === 0) { setPhase(1); phaseCount = 1; }
      if (pct >= 50 && phaseCount === 1) { setPhase(2); phaseCount = 2; }
      if (pct >= 75 && phaseCount === 2) { setPhase(3); phaseCount = 3; }
      setProgress(Math.min(100, pct));
      setCountdown(count);
      if (pct >= 100) {
        clearInterval(intervalRef.current);
        setTimeout(() => setStep(2), 400);
      }
    }, 80);
    return () => clearInterval(intervalRef.current);
  }, [step]);

  useEffect(() => {
    if (step !== 2) return;
    setTimeout(() => {
      const score = genScore();
      const count = parseInt(localStorage.getItem('gm_scan_count') || '0', 10) + 1;
      localStorage.setItem('gm_last_score', score);
      localStorage.setItem('gm_last_scan', JSON.stringify({ score, date: new Date().toISOString() }));
      localStorage.setItem('gm_scan_count', String(count));
      navigate('/results');
    }, 1800);
  }, [step, navigate]);

  const circum = 2 * Math.PI * 54;
  const dash = ((100 - progress) / 100) * circum;

  return (
    <AppShell title="Scan">
      {step === 0 && (
        <div className="scan-step">
          <span className="eyebrow">Preparation</span>
          <h2>Set up your scan.</h2>
          <p>Check device connection, hold steady, and let GlowMouth capture the biological signal that brushing can&apos;t reveal.</p>
          <div className="hero-showcase" style={{ marginTop: 24 }}>
            <div className="hero-strip" style={{ marginTop: 0 }}>
              {['Connected', 'Charged', 'Lighting ready', 'Last meal 30m+'].map((item) => (
                <div className="mini-metric" key={item}><span>Status</span><strong>{item}</strong></div>
              ))}
            </div>
          </div>
          <ul className="scan-checklist" style={{ marginTop: 24 }}>
            {['Device connected and charged', 'Good lighting on your face', 'Brush teeth at least 20 minutes ago', 'No food or drink in the last 30 minutes'].map(item => (
              <li key={item}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="rgba(29,92,74,0.08)"/>
                  <path d="M5.5 9l2.5 2.5L12.5 6" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={() => setStep(1)}>Begin guided scan</button>
        </div>
      )}

      {step === 1 && (
        <div className="scan-step">
          <span className="eyebrow">Live analysis</span>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '18px auto 24px' }}>
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#E5E7EB" strokeWidth="8" fill="none"/>
              <circle cx="60" cy="60" r="54" stroke="var(--accent)" strokeWidth="8" fill="none"
                strokeDasharray={`${circum} ${circum}`}
                strokeDashoffset={dash}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.08s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--metric)', fontSize: 42, color: 'var(--teal)', lineHeight: 1 }}>{countdown}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>seconds</span>
            </div>
          </div>
          <h2>Scanning surfaces...</h2>
          <p style={{ marginBottom: 12 }}>{PHASE_LABELS[phase]}</p>
          <div style={{ width: '100%', height: 8, background: 'rgba(17,24,39,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-hover), var(--accent-glow))', borderRadius: 999, width: `${progress}%`, transition: 'width 0.08s linear' }} />
          </div>
          <div className="hero-mini-card" style={{ marginTop: 16 }}>
            <strong>Current phase</strong>
            <p style={{ marginTop: 8 }}>{PHASE_LABELS[phase]}</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="scan-step">
          <span className="eyebrow">Completion</span>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ margin: '0 0 24px' }}>
            <circle cx="40" cy="40" r="38" fill="rgba(29,92,74,0.08)" stroke="var(--accent)" strokeWidth="2"/>
            <path d="M24 40l10 10 22-22" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Scan complete.</h2>
          <p>Your oral intelligence report is being prepared. Redirecting to results now.</p>
          <div style={{ width: 72, height: 4, background: 'rgba(29,92,74,0.2)', borderRadius: 999, marginTop: 24, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--accent-hover), var(--accent-glow))' }} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
