import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export default function Science() {
  return (
    <>
      <Nav />
      <section className="hero" style={{ minHeight: 0, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ maxWidth: 720, paddingTop: 48 }}>
            <span className="eyebrow">The Science</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--text)', lineHeight: 1.08, marginBottom: 24, fontWeight: 400, letterSpacing: '-0.02em' }}>
              Built on published research,<br />not marketing claims.
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-body)', lineHeight: 1.7, maxWidth: 540 }}>
              QLF technology has been validated across dozens of peer-reviewed clinical studies.
              GlowMouth applies it for the first time as a consumer daily-use device.
            </p>
          </div>
        </div>
      </section>

      <section className="feat-row" style={{ background: 'var(--bg-white)', borderTop: 'none' }}>
        <div className="container">
          <div className="feat-grid">
            <div>
              <span className="eyebrow">QLF Technology</span>
              <h2 className="feat-h2">How 405nm light<br />reveals the invisible.</h2>
              <p className="feat-body">
                Quantitative Light-induced Fluorescence (QLF) exploits the natural fluorescence of
                bacterial porphyrins — metabolic byproducts produced by harmful oral bacteria. When
                illuminated with 405nm blue-violet light, these compounds emit red fluorescence,
                making bacterial deposits visible without dyes, contrast agents, or clinical training.
              </p>
              <div className="feat-callout" style={{ marginTop: 24 }}>
                &ldquo;QLF provides a reliable, non-invasive method for quantifying oral bacterial load.&rdquo;
                — <span style={{ fontStyle: 'normal', color: 'var(--text-body)' }}>Nature Scientific Reports, 2023</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 380 320" fill="none" style={{ width: '100%', maxWidth: 380 }} aria-hidden>
                <ellipse cx="190" cy="180" rx="120" ry="100" fill="#F5F0EB" stroke="#E5E0DB" strokeWidth="1.5"/>
                <ellipse cx="190" cy="175" rx="80" ry="60" fill="#FFFFFF" stroke="#E5E0DB" strokeWidth="1"/>
                <text x="190" y="180" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#8A8A8A">Dentin</text>
                <text x="70" y="190" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A8A8A">Enamel</text>
                <line x1="95" y1="187" x2="115" y2="181" stroke="#E5E0DB" strokeWidth="1"/>
                <circle cx="145" cy="100" r="7" fill="#0D9488" fillOpacity="0.85"/>
                <circle cx="155" cy="93" r="5" fill="#0D9488" fillOpacity="0.75"/>
                <circle cx="235" cy="98" r="8" fill="#0D9488" fillOpacity="0.7"/>
                <circle cx="248" cy="106" r="5" fill="#0D9488" fillOpacity="0.8"/>
                <path d="M190 20 L145 100" stroke="#D0CBC6" strokeWidth="2" strokeDasharray="5 3"/>
                <path d="M190 20 L155 93" stroke="#D0CBC6" strokeWidth="1.5" strokeDasharray="5 3"/>
                <path d="M190 20 L235 98" stroke="#D0CBC6" strokeWidth="2" strokeDasharray="5 3"/>
                <circle cx="190" cy="16" r="10" fill="#0D9488"/>
                <text x="190" y="12" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#fff">405nm</text>
                <circle cx="50" cy="280" r="6" fill="#0D9488" fillOpacity="0.8"/>
                <text x="64" y="285" fontFamily="Inter, sans-serif" fontSize="11" fill="#4A4A4A">Bacterial fluorescence</text>
                <circle cx="50" cy="300" r="6" fill="#F5F0EB" stroke="#E5E0DB" strokeWidth="1.5"/>
                <text x="64" y="305" fontFamily="Inter, sans-serif" fontSize="11" fill="#4A4A4A">Clean enamel (no glow)</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section section-rule" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-center">
            <span className="eyebrow">Oral-Systemic Link</span>
            <h2 className="section-h2">Your mouth is the gateway<br />to your body.</h2>
            <p className="section-sub">Decades of research connect oral bacteria to systemic disease. GlowMouth makes this early-warning data accessible outside a clinic.</p>
          </div>
          <div className="sci-grid">
            {[
              { icon: '❤️', title: 'Cardiovascular Disease', body: 'Periodontal pathogens enter the bloodstream and have been linked to a 2–3× increased risk of heart disease and stroke in multiple longitudinal studies.' },
              { icon: '🧠', title: 'Cognitive Health', body: "Porphyromonas gingivalis — a common gum disease bacteria — has been found in the brains of Alzheimer's patients. Research is ongoing but the connection is significant." },
              { icon: '🩸', title: 'Diabetes Bidirectionality', body: 'Periodontal inflammation worsens insulin resistance, and high blood sugar worsens gum disease. Monitoring oral inflammation is directly relevant to metabolic health.' },
              { icon: '🤱', title: 'Pregnancy Outcomes', body: 'Preterm birth and low birth weight are significantly more common in mothers with untreated periodontal disease, making early detection especially important.' },
              { icon: '🫁', title: 'Respiratory Health', body: 'Aspiration of oral bacteria is a leading cause of hospital-acquired pneumonia and worsens COPD outcomes. Daily oral hygiene monitoring matters beyond the mouth.' },
              { icon: '🦴', title: 'Bone Density', body: 'Chronic periodontal inflammation is associated with systemic bone loss. Tracking gum health through bacterial load provides an accessible proxy metric.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="sci-card">
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div className="sci-card-title">{title}</div>
                <p className="sci-card-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section section-rule" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-center">
            <span className="eyebrow">Scientific Validation</span>
            <h2 className="section-h2">Research-first.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            {[
              { name: 'Published Foundation', desc: 'The QLF method underpinning GlowMouth has been peer-reviewed in journals including Caries Research, the Journal of Dentistry, and Nature Scientific Reports.' },
              { name: 'Independent Validation', desc: 'Bench testing of the GlowMouth sensor protocol against clinical gold standards (ICDAS scoring) is ongoing. Results will be published openly.' },
            ].map(({ name, desc }) => (
              <div key={name} className="app-card">
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>{name}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="disc" style={{ marginTop: 32, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            GlowMouth is a wellness screening device. It does not diagnose, treat, or cure any disease.
            Always consult a licensed dental professional for clinical concerns.
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
