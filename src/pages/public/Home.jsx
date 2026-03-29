import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import emailjs from '@emailjs/browser';

function GlowScoreCard() {
  return (
    <div className="gs-card">
      <div className="gs-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden>
            <rect width="36" height="36" rx="9" fill="#1A1A1A"/>
            <path d="M10 22 Q18 29 26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M18 10 L19.2 13.8 L23.1 13.8 L20 16.1 L21.2 19.9 L18 17.6 L14.8 19.9 L16 16.1 L12.9 13.8 L16.8 13.8 Z" fill="white"/>
          </svg>
          <span style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--text)', fontSize: 14 }}>GlowMouth</span>
        </div>
        <div className="gs-avatar">A</div>
      </div>
      <div className="gs-card-divider" />
      <p className="gs-score-label">Your GlowScore</p>
      <div className="gs-numeral">84</div>
      <div className="gs-change">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        +3 from yesterday
      </div>
      <div style={{ marginTop: 20 }}>
        <div className="gs-bar-row">
          <span className="gs-bar-label">Biological Score</span>
          <span className="gs-bar-val">84/100</span>
        </div>
        <div className="gs-bar-track"><div className="gs-bar-fill" style={{ width: '84%' }} /></div>
      </div>
      <div className="gs-zones">
        <div className="gs-zone"><div className="gs-zone-label">FRONT</div><div className="gs-zone-val">Good</div></div>
        <div className="gs-zone"><div className="gs-zone-label">LEFT</div><div className="gs-zone-val" style={{color:'#FBBF24'}}>Watch</div></div>
        <div className="gs-zone"><div className="gs-zone-label">RIGHT</div><div className="gs-zone-val">Good</div></div>
      </div>
      <Link to="/scan" className="btn btn-primary btn-full" style={{ marginTop: 24, justifyContent: 'center' }}>
        ▶&nbsp;&nbsp;Start Today&apos;s Scan
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l3.2 3.2L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState('idle');

  const handleWaitlistSubmit = async () => {
    if (!email || !email.includes('@')) return;
    setSubmitState('loading');
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          user_name: email,
          reply_to: email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitState('success');
      setEmail('');
    } catch (err) {
      console.error('EmailJS error:', err);
      setSubmitState('error');
    }
  };

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="hero-badge">FDA general wellness · patent pending</span>
              <span className="eyebrow">Oral Health Intelligence</span>
              <h1>See what brushing<br />can&apos;t show you.</h1>
              <p className="hero-sub">
                GlowMouth uses QLF technology and AI to reveal what&apos;s actually happening biologically
                inside your mouth — every single day.
              </p>
              <div className="hero-actions">
                <Link to="/pricing" className="btn btn-primary">Get Early Access</Link>
                <Link to="/how-it-works" className="btn btn-secondary">See How It Works</Link>
              </div>
              <p className="hero-fine">Not a medical device. Wellness screening only.</p>
            </div>
            <div><GlowScoreCard /></div>
          </div>
        </div>
      </section>

      {/* PROBLEM STATS */}
      <section className="pub-section section-rule" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-center">
            <span className="eyebrow">The Problem</span>
            <h2 className="section-h2">Oral disease is invisible.<br />That&apos;s why it wins.</h2>
          </div>
          <div className="stats-row">
            <div className="stat-cell">
              <span className="stat-num">3.5B</span>
              <span className="stat-label">People affected by oral disease globally</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">60%</span>
              <span className="stat-label">Of tooth surfaces invisible while brushing</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">$710B</span>
              <span className="stat-label">Annual economic burden, preventable oral disease</span>
            </div>
          </div>
          <p className="stats-quote">&ldquo;The problem isn&apos;t that people don&apos;t care. It&apos;s that they can&apos;t see.&rdquo;</p>
        </div>
      </section>

      {/* FEATURE ROW 1 — SCAN */}
      <section className="feat-row" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="feat-grid">
            <div>
              <span className="eyebrow">Step 01 — Scan</span>
              <h2 className="feat-h2">Two minutes.<br />Every surface.</h2>
              <p className="feat-body">
                The GlowMouth device uses a 405-nanometer blue-violet LED to cause bacterial
                porphyrins to fluoresce — making plaque and harmful bacteria glow in a way
                normal light simply cannot reveal.
              </p>
              <div className="feat-callout">
                Peer-reviewed QLF technology, validated in Nature Scientific Reports (2023).
              </div>
              <Link to="/science" className="ghost-cta">See the full science →</Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 420 340" fill="none" style={{ width: '100%', maxWidth: 420 }} aria-hidden>
                <rect x="40" y="36" width="340" height="268" rx="20" fill="#EDE8E3" stroke="#E5E0DB" />
                <rect x="160" y="60" width="100" height="200" rx="20" fill="#FFFFFF" stroke="#E5E0DB" strokeWidth="1.5" />
                <rect x="175" y="75" width="70" height="120" rx="10" fill="#F5F0EB" stroke="#E5E0DB" />
                <rect x="182" y="82" width="56" height="106" rx="7" fill="#FFFFFF" />
                <circle cx="210" cy="135" r="6" fill="#0D9488" />
                <rect x="197" y="220" width="26" height="12" rx="6" fill="#E5E0DB" />
                <ellipse cx="210" cy="260" rx="14" ry="8" fill="#FFFFFF" stroke="#D0CBC6" strokeWidth="1.5" />
                <circle cx="210" cy="260" r="5" fill="#0D9488" />
                <path d="M140 310 Q160 280 180 285 Q200 295 210 285 Q220 295 240 285 Q260 280 280 310 Q270 330 255 325 Q245 320 230 325 Q220 328 210 325 Q200 328 190 325 Q175 320 165 325 Q150 330 140 310Z" fill="#FFFFFF" stroke="#D0CBC6" strokeWidth="1.5" />
                <circle cx="185" cy="305" r="4" fill="#0D9488" fillOpacity="0.85" />
                <circle cx="235" cy="300" r="3" fill="#0D9488" fillOpacity="0.65" />
                <circle cx="260" cy="308" r="5" fill="#0D9488" fillOpacity="0.75" />
                <text x="115" y="48" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#8A8A8A">405nm QLF</text>
                <text x="115" y="62" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A8A8A">blue-violet LED</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE ROW 2 — ANALYZE */}
      <section className="feat-row" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="feat-grid">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
                <svg viewBox="0 0 360 240" fill="none" style={{ width: '100%' }} aria-hidden>
                  {[[60,40],[60,120],[60,200],[180,80],[180,160],[300,120]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="14" fill="#F5F0EB" stroke="#E5E0DB" strokeWidth="1.5" />
                  ))}
                  {[[60,40,180,80],[60,40,180,160],[60,120,180,80],[60,120,180,160],[60,200,180,80],[60,200,180,160],[180,80,300,120],[180,160,300,120]].map(([x1,y1,x2,y2],i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D0CBC6" strokeWidth="1" />
                  ))}
                  {[[60,40],[60,120],[60,200],[180,80],[180,160],[300,120]].map(([x,y],i) => (
                    <circle key={`c${i}`} cx={x} cy={y} r="5" fill="#0D9488" />
                  ))}
                  {[['FRONT',85,'#0D9488'],['LEFT',62,'#B45309'],['RIGHT',79,'#0D9488'],['BACK',71,'#0D9488']].map(([label,val,color],i) => (
                    <g key={label}>
                      <text x={20 + i*88} y={232} fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#8A8A8A" textAnchor="middle">{label}</text>
                      <rect x={20+i*88-20} y={240 - val*0.5} width="40" height={val*0.5 - 10} rx="3" fill={color} fillOpacity="0.85" />
                    </g>
                  ))}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  {[['FRONT','85'],['LEFT','62'],['RIGHT','79'],['BACK','71']].map(([z,v]) => (
                    <div key={z} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{z}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--text)', marginTop: 2, fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <span className="eyebrow">Step 02 — Analyze</span>
              <h2 className="feat-h2">AI reads what<br />your eyes can&apos;t.</h2>
              <p className="feat-body">
                Computer vision maps fluorescence patterns across all tooth surfaces in real time,
                identifying bacterial concentration, plaque distribution, and early gum risk indicators
                within seconds of scan completion.
              </p>
              <Link to="/how-it-works" className="ghost-cta">How the technology works →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE ROW 3 — SCORE */}
      <section className="feat-row" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="feat-grid">
            <div>
              <span className="eyebrow">Step 03 — Score</span>
              <h2 className="feat-h2">Your GlowScore.<br />Simple. Actionable.</h2>
              <p className="feat-body">
                A 1–100 daily wellness indicator. Not a clinical diagnosis — a biological window into
                your oral health that no amount of brushing could ever give you.
              </p>
              <Link to="/pricing" className="ghost-cta">Start tracking yours →</Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="gs-card" style={{ width: '100%', maxWidth: 320 }}>
                <p className="gs-score-label">Your GlowScore</p>
                <div className="gs-numeral" style={{ fontSize: 64 }}>84</div>
                <div className="gs-bar-track"><div className="gs-bar-fill" style={{ width: '84%' }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, gap: 8 }}>
                  {[['pH', '7.2'],['Microbiome','High'],['Inflam.','Low']].map(([k,v]) => (
                    <div key={k} className="gs-zone" style={{ flex: 1 }}>
                      <div className="gs-zone-label">{k}</div>
                      <div className="gs-zone-val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SURVEY DATA */}
      <section className="pub-section section-rule" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-center" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <span className="eyebrow">Validated Demand</span>
            <h2 className="section-h2">120 people. Real data.</h2>
            <p className="section-sub">Primary research, Dec 2025–Feb 2026. Ages 16–40.</p>
          </div>
          <div className="survey-grid">
            <div className="survey-cell"><span className="survey-num">68%</span><span className="survey-label">Rated interest 4 or 5 out of 5</span></div>
            <div className="survey-cell"><span className="survey-num">63%</span><span className="survey-label">Already concerned about unnoticed oral problems</span></div>
            <div className="survey-cell"><span className="survey-num">40%</span><span className="survey-label">Purchase intent at actual price point</span></div>
            <div className="survey-cell"><span className="survey-num">68%</span><span className="survey-label">Would use the device regularly if they owned it</span></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--text-muted)' }}>
            N=120 · GlowMouth Primary Research Survey · John Randolph Tucker High School DECA
          </p>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="pub-section section-rule" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-center">
            <h2 className="section-h2">Simple pricing.</h2>
            <p className="section-sub">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <span className="plan-label">Freemium</span>
              <div className="plan-price">Free</div>
              <div className="plan-per">forever</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['Basic scans via smartphone camera','Daily GlowScore (simplified)','7-day score history','Basic oral health tips'].map(f => (
                  <li key={f}><CheckIcon />{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="btn btn-ghost-light btn-full">Get Started Free</Link>
            </div>
            {/* Device */}
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <span className="plan-label">Device</span>
              <div className="plan-price">$49.99</div>
              <div className="plan-per">one-time purchase</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['GlowMouth 405nm QLF device','Enhanced scan accuracy','30-day Premium trial included','1-year warranty'].map(f => (
                  <li key={f}><CheckIcon />{f}</li>
                ))}
              </ul>
              <Link to="/pricing" className="btn btn-primary btn-full">Order Device</Link>
            </div>
            {/* Premium */}
            <div className="pricing-card">
              <span className="plan-label">Premium</span>
              <div className="plan-price">$9.99</div>
              <div className="plan-per">/month or $100/year</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['Everything in Freemium','Advanced AI fluorescence analysis','Early detection indicators','Full 365-day score history','Shareable dentist reports'].map(f => (
                  <li key={f}><CheckIcon />{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="btn btn-outline-teal btn-full">Start Free Trial</Link>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/pricing" className="ghost-cta" style={{ margin: '0 auto' }}>Compare all features →</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container">
          <h2 className="section-h2 section-h2-lg" style={{ marginBottom: 20 }}>
            Know what&apos;s actually<br />happening in your mouth.
          </h2>
          <p className="section-sub" style={{ marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Join the waitlist. Be first when GlowMouth launches.
          </p>
          {submitState !== 'success' ? (
            <div className="waitlist-form">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={submitState === 'loading'}
                className="waitlist-input"
                onKeyDown={e => e.key === 'Enter' && handleWaitlistSubmit()}
              />
              <button
                onClick={handleWaitlistSubmit}
                disabled={submitState === 'loading' || !email}
                className="waitlist-btn"
              >
                {submitState === 'loading' ? (
                  <><span className="spinner" /> Sending...</>
                ) : 'Join Waitlist'}
              </button>
            </div>
          ) : (
            <div className="waitlist-success">
              <span className="waitlist-check">✓</span>
              <span>You&apos;re on the list. We&apos;ll be in touch.</span>
            </div>
          )}

          {submitState === 'error' && (
            <p className="waitlist-error">Something went wrong. Please try again.</p>
          )}

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
            Not a medical device. For wellness awareness only.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
