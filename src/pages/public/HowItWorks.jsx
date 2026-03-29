import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export default function HowItWorks() {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: 72 }}>
        {/* HERO */}
        <section style={{ padding: '100px 0 80px', background: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">How It Works</span>
            <h1 className="section-h2" style={{ fontSize: 'clamp(36px,5vw,64px)' }}>From scan to score<br />in under two minutes.</h1>
            <p className="section-sub" style={{ maxWidth: 600, margin: '16px auto 0' }}>
              GlowMouth combines QLF technology with AI computer vision to give you a daily biological
              picture of your oral health — something no toothbrush has ever been able to do.
            </p>
          </div>
        </section>

        {/* STEP 1 */}
        <section className="feat-row" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div className="feat-grid">
              <div>
                <span className="eyebrow">Step 01</span>
                <h2 className="feat-h2">Connect your device.</h2>
                <p className="feat-body">Open the GlowMouth app and pair your device via Bluetooth. The app verifies the device is charged and calibrated before your scan begins — ensuring accuracy every time.</p>
                <div className="feat-callout">First-time setup takes under 90 seconds.</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 360 280" fill="none" style={{ width: '100%', maxWidth: 360 }}>
                  {/* Phone */}
                  <rect x="100" y="20" width="160" height="240" rx="20" fill="#1A2E2B" stroke="#0D9488" strokeWidth="1.5" strokeOpacity="0.4"/>
                  <rect x="112" y="36" width="136" height="208" rx="12" fill="#0D2B26"/>
                  {/* App UI */}
                  <rect x="120" y="50" width="120" height="40" rx="6" fill="#0D9488" fillOpacity="0.15"/>
                  <text x="180" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#0D9488">DEVICE CONNECTED</text>
                  <circle cx="180" cy="140" r="40" fill="none" stroke="#0D9488" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="8 4"/>
                  <circle cx="180" cy="140" r="26" fill="#0D9488" fillOpacity="0.1" stroke="#0D9488" strokeWidth="1.5"/>
                  <circle cx="180" cy="140" r="8" fill="#0D9488"/>
                  <text x="180" y="200" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="rgba(255,255,255,0.6)">Tap to begin scan</text>
                  {/* Bluetooth symbol */}
                  <path d="M290 80 L310 100 L290 120 L290 80Z M310 100 L290 120 M310 100 L290 80" stroke="#0D9488" strokeWidth="2" strokeOpacity="0.8" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className="feat-row" style={{ background: 'var(--bg-white)' }}>
          <div className="container">
            <div className="feat-grid">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', order: 1 }}>
                <svg viewBox="0 0 360 280" fill="none" style={{ width: '100%', maxWidth: 360 }}>
                  {/* Mouth cross-section */}
                  <ellipse cx="180" cy="160" rx="140" ry="80" fill="#0D2B26" stroke="#0D9488" strokeWidth="1" strokeOpacity="0.3"/>
                  {/* Teeth */}
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <rect key={i} x={60+i*20} y={100} width="16" height="30" rx="4" fill="#1A2E2B" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  ))}
                  {/* Bacteria glow */}
                  <circle cx="105" cy="112" r="5" fill="#0D9488" fillOpacity="0.9"/>
                  <circle cx="240" cy="108" r="7" fill="#0D9488" fillOpacity="0.8"/>
                  <circle cx="220" cy="115" r="4" fill="#0D9488" fillOpacity="0.7"/>
                  {/* LED arc lines */}
                  <path d="M180 50 Q200 80 210 110" stroke="#0D9488" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" fill="none"/>
                  <path d="M180 50 Q165 82 160 112" stroke="#0D9488" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" fill="none"/>
                  <circle cx="180" cy="45" r="8" fill="#0D9488" fillOpacity="0.9"/>
                  <text x="180" y="255" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.4)">405nm illumination</text>
                </svg>
              </div>
              <div style={{ order: 2 }}>
                <span className="eyebrow">Step 02</span>
                <h2 className="feat-h2">Scan each zone<br />with the device.</h2>
                <p className="feat-body">Guide the GlowMouth sensor around your mouth. The 405nm LED illuminates bacterial porphyrins, making harmful bacteria visibly glow — the app tracks your position and captures data from every surface.</p>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3 */}
        <section className="feat-row" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div className="feat-grid">
              <div>
                <span className="eyebrow">Step 03</span>
                <h2 className="feat-h2">AI analyzes the<br />fluorescence map.</h2>
                <p className="feat-body">Our computer vision model processes the fluorescence data, identifying bacterial concentration by zone, quantifying plaque coverage, and flagging early indicators of gum disease risk.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 360 260" fill="none" style={{ width: '100%', maxWidth: 360 }}>
                  <rect x="20" y="20" width="320" height="220" rx="16" fill="#1A2E2B"/>
                  <text x="40" y="50" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(255,255,255,0.4)">FLUORESCENCE MAP</text>
                  {/* Heatmap grid */}
                  {[...Array(8)].map((_,row) => [...Array(10)].map((_,col) => {
                    const val = [0.3,0.8,0.2,0.9,0.1,0.7,0.4,0.6,0.2,0.5][col] * [0.5,0.9,0.3,0.7,0.4,0.8,0.6,0.2][row];
                    return <rect key={`${row}-${col}`} x={40+col*25} y={60+row*18} width="23" height="16" rx="3" fill="#0D9488" fillOpacity={Math.max(0.05,val)}/>;
                  }))}
                  <text x="40" y="218" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.3)">LOW RISK</text>
                  <rect x="80" y="210" width="200" height="4" rx="2" fill="url(#heatGrad)"/>
                  <defs><linearGradient id="heatGrad" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#0D9488" stopOpacity="0.2"/><stop offset="100%" stopColor="#0D9488" stopOpacity="1"/></linearGradient></defs>
                  <text x="285" y="218" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.3)">HIGH</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 4 */}
        <section className="feat-row" style={{ background: 'var(--bg-white)' }}>
          <div className="container">
            <div className="feat-grid">
              <div style={{ display: 'flex', justifyContent: 'center', order: 1 }}>
                <div className="gs-card" style={{ maxWidth: 300, width: '100%' }}>
                  <p className="gs-score-label">Your GlowScore</p>
                  <div className="gs-numeral" style={{ fontSize: 64 }}>84</div>
                  <div className="gs-bar-track" style={{ marginBottom: 12 }}>
                    <div className="gs-bar-fill" style={{ width: '84%' }} />
                  </div>
                  <div className="gs-change">↑ +3 from yesterday</div>
                </div>
              </div>
              <div style={{ order: 2 }}>
                <span className="eyebrow">Step 04</span>
                <h2 className="feat-h2">Your GlowScore<br />is ready.</h2>
                <p className="feat-body">Within seconds of completing the scan, your GlowScore updates. Track trends over days, weeks, and months to see whether your oral health is improving — and which zones to focus on.</p>
                <Link to="/pricing" className="ghost-cta">Start tracking today →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* DEVICE SECTION */}
        <section className="pub-section" style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="feat-grid">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 380" fill="none" style={{ width: '100%', maxWidth: 300 }} aria-hidden>
                  <rect x="90" y="40" width="120" height="260" rx="24" fill="#FFFFFF" stroke="#E5E0DB" strokeWidth="1.5"/>
                  <rect x="105" y="58" width="90" height="140" rx="12" fill="#F5F0EB" stroke="#E5E0DB" strokeWidth="1"/>
                  <circle cx="150" cy="128" r="32" fill="none" stroke="#D0CBC6" strokeWidth="1.5"/>
                  <circle cx="150" cy="128" r="20" fill="#EDE8E3" stroke="#E5E0DB" strokeWidth="1"/>
                  <circle cx="150" cy="128" r="7" fill="#0D9488"/>
                  <rect x="135" y="230" width="30" height="10" rx="5" fill="#E5E0DB"/>
                  <ellipse cx="150" cy="308" rx="18" ry="10" fill="#FFFFFF" stroke="#D0CBC6" strokeWidth="1.5"/>
                  <circle cx="150" cy="308" r="6" fill="#0D9488"/>
                  {[30,22,15].map((r,i) => (
                    <ellipse key={i} cx="150" cy="340" rx={r} ry={r*0.4} fill="none" stroke="#D0CBC6" strokeWidth="1" strokeOpacity={0.9-i*0.25}/>
                  ))}
                  <text x="150" y="30" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="14" fill="#1A1A1A">GlowMouth Sensor</text>
                </svg>
              </div>
              <div>
                <span className="eyebrow">The Device</span>
                <h2 className="feat-h2">Engineered for<br />daily use.</h2>
                <p className="feat-body" style={{ marginBottom: 28 }}>
                  The GlowMouth Sensor delivers clinical-grade QLF analysis in a pocket-sized form factor.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    '405nm blue-violet QLF LED',
                    'Bluetooth 5.0 wireless sync',
                    'USB-C charging, 30-day battery',
                    'IPX4 water resistance',
                    '1-year manufacturer warranty',
                    'FDA wellness device registration pending',
                  ].map(spec => (
                    <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--accent)' }}>→</span>
                      <span style={{ fontSize: 15, color: 'var(--text-body)' }}>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
