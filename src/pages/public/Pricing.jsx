import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function CheckIcon() {
  return (
    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l3.2 3.2L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const ANNUAL_PRICE = 89.88; // $9.99 x 12 = $119.88 — annual saves $30.00 exactly.
const MONTHLY_PRICE = 9.99;
const ANNUAL_SAVINGS = (MONTHLY_PRICE * 12 - ANNUAL_PRICE).toFixed(2);

export default function Pricing() {
  useDocumentTitle('Pricing');
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Nav />
      <div style={{ paddingTop: 88 }}>
        <section className="pub-section" style={{ paddingBottom: 60 }}>
          <div className="container" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">Pricing</span>
            <h1 className="section-h2" style={{ fontSize: 'clamp(32px,5vw,52px)' }}>Pricing that matches the product ambition.</h1>
            <p className="section-sub" style={{ marginTop: 12 }}>
              Three separate decisions: start free with your phone, add the sensor when you're ready, subscribe to unlock the full intelligence layer.
            </p>
          </div>
        </section>

        {/* STAGE 1 — THE APP, FREE */}
        <section className="pub-section section-rule">
          <div className="container">
            <div className="feat-grid">
              <div>
                <span className="eyebrow">Start free</span>
                <h2 className="feat-h2">Download the app. Start tracking with your phone.</h2>
                <p className="feat-body">
                  The GlowMouth app works with your existing smartphone camera for basic tracking. Get your daily GlowScore, 7-day history, and oral health tips at no cost.
                </p>
                <Link to="/signup" className="ghost-cta">Get the free app →</Link>
              </div>
              <div className="app-card">
                <ul className="plan-features">
                  {['Daily GlowScore', '7-day history', 'Basic oral health tips', 'Works without the sensor'].map(f => (
                    <li key={f}><CheckIcon />{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 2 — THE SENSOR, DARK SECTION */}
        <section className="pub-section pricing-sensor-section">
          <div className="container">
            <div className="feat-grid">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-glow)' }}>The sensor</span>
                <h2 className="feat-h2" style={{ color: '#fff' }}>$49.99</h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: -8, marginBottom: 16 }}>One-time. No subscription required.</p>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, maxWidth: 480 }}>
                  The GlowMouth Sensor adds 405nm QLF analysis, zone-level biological mapping, and scan confidence scoring. It includes a 30-day Premium trial.
                </p>
                <Link to="/signup" className="btn btn-primary" style={{ marginTop: 24 }}>Order the Sensor →</Link>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28 }}>
                <ul className="plan-features">
                  {[
                    'GlowMouth 405nm QLF sensor',
                    'Enhanced scan accuracy',
                    'Zone-level biological mapping',
                    '30-day Premium trial included',
                    '1-year warranty + free firmware updates',
                  ].map(f => (
                    <li key={f} style={{ color: 'rgba(255,255,255,0.82)' }}><span className="check-icon" style={{ color: 'var(--accent-glow)' }}><CheckIcon /></span>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 3 — PREMIUM SUBSCRIPTION */}
        <section className="pub-section section-rule">
          <div className="container">
            <div className="section-center" style={{ marginBottom: 32 }}>
              <span className="eyebrow">Premium</span>
              <h2 className="section-h2">Unlock the full intelligence layer.</h2>
            </div>
            <div className="price-toggle">
              <span style={{ fontWeight: annual ? 400 : 600, color: annual ? 'var(--text-muted)' : 'var(--text)' }}>Monthly</span>
              <button type="button" className={`toggle-switch ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)} aria-label="Toggle annual billing">
                <div className="toggle-knob" />
              </button>
              <span style={{ fontWeight: annual ? 600 : 400, color: annual ? 'var(--text)' : 'var(--text-muted)' }}>
                Annual <span style={{ color: annual ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12 }}>(save ${ANNUAL_SAVINGS})</span>
              </span>
            </div>
            <div className="pricing-card" style={{ maxWidth: 480, margin: '0 auto' }}>
              <span className="plan-label">Premium</span>
              <div className="plan-price">{annual ? `$${(ANNUAL_PRICE / 12).toFixed(2)}` : `$${MONTHLY_PRICE}`}</div>
              <div className="plan-per">{annual ? `/month · billed $${ANNUAL_PRICE}/year` : '/month'}</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['Everything in Free', 'Advanced AI fluorescence interpretation', 'Early biological change indicators', 'Full 365-day score history', 'Shareable dentist PDF reports', 'Priority support'].map(f => (
                  <li key={f}><CheckIcon />{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="btn btn-primary btn-full" style={{ marginTop: 'auto' }}>Start 30-day trial →</Link>
              <button className="ghost-cta" style={{ marginTop: 12 }}>Already have the sensor? Subscribe →</button>
            </div>
            <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: 'var(--text-muted)' }}>
              No long-term contract. Cancel your Premium subscription anytime. The sensor is yours to keep.
            </p>
          </div>
        </section>

        <section className="pub-section section-rule">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="eyebrow">Put It in Context</span>
              <h2 className="section-h2">A cavity repair costs $200+.<br />GlowMouth Premium costs $9.99/month.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 700, margin: '0 auto' }}>
              <div style={{ background: 'var(--bg-white)', borderRadius: 16, padding: 32, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 42, fontWeight: 500, color: 'var(--text)' }}>$200</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Average cavity repair cost</div>
              </div>
              <div style={{ background: 'var(--bg-white)', borderRadius: 16, padding: 32, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 42, fontWeight: 500, color: 'var(--text)' }}>$9.99</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>GlowMouth Premium per month</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
