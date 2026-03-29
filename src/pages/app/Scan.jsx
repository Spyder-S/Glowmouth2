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
      localStorage.setItem('gm_last_score', score);
      localStorage.setItem('gm_last_scan', JSON.stringify({ score, date: new Date().toISOString() }));
      navigate('/results');
    }, 1800);
  }, [step, navigate]);

  const circum = 2 * Math.PI * 54;
  const dash = ((100 - progress) / 100) * circum;

  return (
    <AppShell title="Scan">
      {step === 0 && (
        <div className="scan-step">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto 24px' }}>
            <circle cx="32" cy="32" r="30" stroke="#0D9488" strokeWidth="2.5" fill="none" strokeOpacity="0.3"/>
            <circle cx="32" cy="32" r="14" stroke="#0D9488" strokeWidth="2" fill="none"/>
            <circle cx="32" cy="32" r="5" fill="#0D9488"/>
            <line x1="32" y1="2" x2="32" y2="10" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="32" y1="54" x2="32" y2="62" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="2" y1="32" x2="10" y2="32" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="54" y1="32" x2="62" y2="32" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <h2>Start today's scan</h2>
          <p>Position your device and follow the guide. The scan takes approximately 2 minutes and covers all tooth surfaces.</p>
          <ul className="scan-checklist">
            {['Device connected and charged', 'Good lighting on your face', 'Brush teeth at least 20 minutes ago', 'No food or drink in the last 30 minutes'].map(item => (
              <li key={item}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#F0FDFA"/>
                  <path d="M5.5 9l2.5 2.5L12.5 6" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={() => setStep(1)}>Begin Scan →</button>
        </div>
      )}

      {step === 1 && (
        <div className="scan-step">
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#E5E7EB" strokeWidth="8" fill="none"/>
              <circle cx="60" cy="60" r="54" stroke="#0D9488" strokeWidth="8" fill="none"
                strokeDasharray={`${circum} ${circum}`}
                strokeDashoffset={dash}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.08s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, color: 'var(--teal)', lineHeight: 1 }}>{countdown}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>seconds</span>
            </div>
          </div>
          <h2>Scanning...</h2>
          <p style={{ marginBottom: 12 }}>{PHASE_LABELS[phase]}</p>
          <div style={{ width: '100%', height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', background: 'var(--teal)', borderRadius: 3, width: `${progress}%`, transition: 'width 0.08s linear' }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Keep the device in contact and hold steady.</p>
        </div>
      )}

      {step === 2 && (
        <div className="scan-step">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ margin: '0 auto 24px' }}>
            <circle cx="40" cy="40" r="38" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2"/>
            <path d="M24 40l10 10 22-22" stroke="#0D9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Scan complete</h2>
          <p>Your GlowScore is being calculated...<br />Redirecting to your results.</p>
          <div style={{ width: 40, height: 4, background: 'var(--teal)', borderRadius: 2, margin: '24px auto 0', animation: 'pulse 1s ease-in-out infinite' }} />
        </div>
      )}
    </AppShell>
  );
}
