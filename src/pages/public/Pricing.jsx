import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

function CheckIcon() {
  return (
    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l3.2 3.2L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const rows = [
    ['Scans per month', '5 scans', 'Enhanced unlimited', 'Unlimited'],
    ['GlowScore', 'Basic (3 zones)', 'Full (8 zones)', 'Full (8 zones)'],
    ['Scan history', '7 days', '365 days', '365 days'],
    ['AI zone analysis', '✗', '✓', '✓'],
    ['Early detection indicators', '✗', '✓ (device-only)', '✓'],
    ['Trend charts', '✗', '✓', '✓'],
    ['Dentist PDF reports', '✗', '✗', '✓'],
    ['Priority support', '✗', '✗', '✓'],
    ['30-day Premium trial', '✗', '✓', '—'],
  ];

  return (
    <>
      <Nav />
      <section className="hero" style={{ minHeight: 0, paddingBottom: 48 }}>
        <div className="container" style={{ paddingTop: 48 }}>
          <span className="eyebrow">Pricing</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--text)', lineHeight: 1.08, marginBottom: 20, fontWeight: 400, letterSpacing: '-0.02em' }}>
            Simple pricing.<br />No surprises.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-body)', lineHeight: 1.7, maxWidth: 520 }}>
            Start free. Add the device when you&apos;re ready.
          </p>
        </div>
      </section>

      <section className="pub-section" style={{ background: 'var(--bg-alt)', paddingTop: 0 }}>
        <div className="container">
          <div className="price-toggle">
            <span style={{ fontWeight: annual ? 400 : 600, color: annual ? 'var(--text-muted)' : 'var(--text)' }}>Monthly</span>
            <button type="button" className={`toggle-switch ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)} aria-label="Toggle annual billing">
              <div className="toggle-knob" />
            </button>
            <span style={{ fontWeight: annual ? 600 : 400, color: annual ? 'var(--text)' : 'var(--text-muted)' }}>
              Annual <span style={{ color: annual ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12 }}>(save $19.88)</span>
            </span>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <span className="plan-label">Freemium</span>
              <div className="plan-price">Free</div>
              <div className="plan-per">forever</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['Basic scans via smartphone camera','Daily GlowScore (simplified)','7-day score history','Basic oral health tips'].map(f => <li key={f}><CheckIcon />{f}</li>)}
              </ul>
              <Link to="/signup" className="btn btn-secondary btn-full" style={{ marginTop: 'auto' }}>Get Started Free</Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <span className="plan-label">Device</span>
              <div className="plan-price">$49.99</div>
              <div className="plan-per">one-time · includes 30-day Premium trial</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['GlowMouth 405nm QLF sensor','Enhanced scan accuracy','30-day Premium trial included','Works with free or premium plan','1-year warranty + free firmware updates'].map(f => <li key={f}><CheckIcon />{f}</li>)}
              </ul>
              <Link to="/signup" className="btn btn-primary btn-full" style={{ marginTop: 'auto' }}>Order Device</Link>
            </div>
            <div className="pricing-card">
              <span className="plan-label">Premium</span>
              <div className="plan-price">{annual ? '$100' : '$9.99'}</div>
              <div className="plan-per">{annual ? '/year · save $19.88' : '/month'}</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {['Everything in Freemium','Advanced AI fluorescence analysis','Early detection indicators','Full 365-day score history','Shareable dentist PDF reports','Priority support'].map(f => <li key={f}><CheckIcon />{f}</li>)}
              </ul>
              <Link to="/signup" className="btn btn-secondary btn-full" style={{ marginTop: 'auto' }}>Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section section-rule" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-center" style={{ marginBottom: 40 }}>
            <h2 className="section-h2" style={{ fontSize: 'clamp(26px, 3vw, 36px)' }}>Full feature comparison</h2>
          </div>
          <div className="app-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Feature</th>
                  <th>Freemium</th>
                  <th>Device</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([feat, free, device, premium]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    <td>{free}</td>
                    <td>{device}</td>
                    <td>{premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pub-section section-rule" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">Put It in Context</span>
            <h2 className="section-h2">A cavity repair costs $200+.<br />GlowMouth costs $9.99/month.</h2>
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

      <Footer />
    </>
  );
}
