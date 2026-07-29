import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import OralHealthMap from '../../components/OralHealthMap';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function HowItWorks() {
  useDocumentTitle('How It Works');
  return (
    <>
      <Nav />
      <div style={{ paddingTop: 88 }}>
        <section className="hero" style={{ minHeight: 0, paddingBottom: 40 }}>
          <div className="container">
            <div className="hero-grid">
              <div>
                <span className="eyebrow">How it works</span>
                <h1>Four steps from scan to prevention.</h1>
                <p className="hero-sub">The device does the sensing. The platform does the thinking. You get the picture.</p>
                <div className="stat-inline-row">
                  <div className="stat-inline"><strong>90 sec</strong><span>first setup</span></div>
                  <div className="stat-inline-divider" />
                  <div className="stat-inline"><strong>405nm</strong><span>QLF sensor</span></div>
                  <div className="stat-inline-divider" />
                  <div className="stat-inline"><strong>94%</strong><span>scan confidence</span></div>
                </div>
              </div>
              <OralHealthMap />
            </div>
          </div>
        </section>

        <section className="feat-row section-rule">
          <div className="container">
            <div className="feat-grid">
              <div>
                <span className="step-number">01</span>
                <h2 className="feat-h2">Scan.</h2>
                <p className="feat-body">Open the app, connect the device, and start a guided capture experience built for consistency and clarity.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 360 280" fill="none" style={{ width: '100%', maxWidth: 360 }}>
                  {/* Phone */}
                  <rect x="100" y="20" width="160" height="240" rx="20" fill="#1A2E2B" stroke="#1D5C4A" strokeWidth="1.5" strokeOpacity="0.4"/>
                  <rect x="112" y="36" width="136" height="208" rx="12" fill="#0D2B26"/>
                  {/* App UI */}
                  <rect x="120" y="50" width="120" height="40" rx="6" fill="#1D5C4A" fillOpacity="0.15"/>
                  <text x="180" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#1D5C4A">DEVICE CONNECTED</text>
                  <circle cx="180" cy="140" r="40" fill="none" stroke="#1D5C4A" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="8 4"/>
                  <circle cx="180" cy="140" r="26" fill="#1D5C4A" fillOpacity="0.1" stroke="#1D5C4A" strokeWidth="1.5"/>
                  <circle cx="180" cy="140" r="8" fill="#1D5C4A"/>
                  <text x="180" y="200" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="rgba(255,255,255,0.6)">Tap to begin scan</text>
                  {/* Bluetooth symbol */}
                  <path d="M290 80 L310 100 L290 120 L290 80Z M310 100 L290 120 M310 100 L290 80" stroke="#1D5C4A" strokeWidth="2" strokeOpacity="0.8" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className="feat-row section-rule">
          <div className="container">
            <div className="feat-grid">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', order: 1 }}>
                <svg viewBox="0 0 360 280" fill="none" style={{ width: '100%', maxWidth: 360 }}>
                  {/* Mouth cross-section */}
                  <ellipse cx="180" cy="160" rx="140" ry="80" fill="#0D2B26" stroke="#1D5C4A" strokeWidth="1" strokeOpacity="0.3"/>
                  {/* Teeth */}
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <rect key={i} x={60+i*20} y={100} width="16" height="30" rx="4" fill="#1A2E2B" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  ))}
                  {/* Bacteria glow */}
                  <circle cx="105" cy="112" r="5" fill="#1D5C4A" fillOpacity="0.9"/>
                  <circle cx="240" cy="108" r="7" fill="#1D5C4A" fillOpacity="0.8"/>
                  <circle cx="220" cy="115" r="4" fill="#1D5C4A" fillOpacity="0.7"/>
                  {/* LED arc lines */}
                  <path d="M180 50 Q200 80 210 110" stroke="#1D5C4A" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" fill="none"/>
                  <path d="M180 50 Q165 82 160 112" stroke="#1D5C4A" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" fill="none"/>
                  <circle cx="180" cy="45" r="8" fill="#1D5C4A" fillOpacity="0.9"/>
                  <text x="180" y="255" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.4)">405nm illumination</text>
                </svg>
              </div>
              <div style={{ order: 2 }}>
                <span className="step-number">02</span>
                <h2 className="feat-h2">Analyze.</h2>
                <p className="feat-body">GlowMouth maps biological activity across the mouth and converts fluorescence into meaningful regional insight.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="feat-row section-rule">
          <div className="container">
            <div className="feat-grid">
              <div>
                <span className="step-number">03</span>
                <h2 className="feat-h2">Understand.</h2>
                <p className="feat-body">The system converts raw signal into score context, trend direction, and prevention-focused recommendations.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox="0 0 360 260" fill="none" style={{ width: '100%', maxWidth: 360 }}>
                  <rect x="20" y="20" width="320" height="220" rx="16" fill="#1A2E2B"/>
                  <text x="40" y="50" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(255,255,255,0.4)">FLUORESCENCE MAP</text>
                  {/* Heatmap grid */}
                  {[...Array(8)].map((_,row) => [...Array(10)].map((_,col) => {
                    const val = [0.3,0.8,0.2,0.9,0.1,0.7,0.4,0.6,0.2,0.5][col] * [0.5,0.9,0.3,0.7,0.4,0.8,0.6,0.2][row];
                    return <rect key={`${row}-${col}`} x={40+col*25} y={60+row*18} width="23" height="16" rx="3" fill="#1D5C4A" fillOpacity={Math.max(0.05,val)}/>;
                  }))}
                  <text x="40" y="218" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.3)">LOW RISK</text>
                  <rect x="80" y="210" width="200" height="4" rx="2" fill="url(#heatGrad)"/>
                  <defs><linearGradient id="heatGrad" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#1D5C4A" stopOpacity="0.2"/><stop offset="100%" stopColor="#1D5C4A" stopOpacity="1"/></linearGradient></defs>
                  <text x="285" y="218" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.3)">HIGH</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="feat-row section-rule">
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
                <span className="step-number">04</span>
                <h2 className="feat-h2">Improve.</h2>
                <p className="feat-body">Use insights, trends, and recommendations to make small changes that compound into better awareness over time.</p>
                <Link to="/pricing" className="ghost-cta">Start tracking today →</Link>
              </div>
            </div>
            <div className="hiw-faq-row">
              <strong>Does it work without the sensor?</strong>
              <span>The app runs basic tracking via your smartphone camera. The sensor adds zone-level biological analysis and full GlowScore confidence.</span>
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
                  <circle cx="150" cy="128" r="7" fill="#1D5C4A"/>
                  <rect x="135" y="230" width="30" height="10" rx="5" fill="#E5E0DB"/>
                  <ellipse cx="150" cy="308" rx="18" ry="10" fill="#FFFFFF" stroke="#D0CBC6" strokeWidth="1.5"/>
                  <circle cx="150" cy="308" r="6" fill="#1D5C4A"/>
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
                  The GlowMouth Sensor delivers precise QLF analysis in a pocket-sized form factor.
                </p>
                <div className="spec-grid">
                  {[
                    ['WAVELENGTH', '405nm blue-violet LED'],
                    ['CONNECTIVITY', 'Bluetooth 5.0 wireless sync'],
                    ['CHARGING', 'USB-C, 30-day battery'],
                    ['WATER RESISTANCE', 'IPX4 rated'],
                    ['WARRANTY', '1-year manufacturer warranty'],
                    ['CERTIFICATION', 'FDA wellness device registration pending'],
                    ['FORM FACTOR', 'Pocket-sized, clip-mount compatible'],
                  ].map(([label, value]) => (
                    <div key={label} className="spec-card">
                      <span className="spec-label">{label}</span>
                      <span className="spec-value">{value}</span>
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
