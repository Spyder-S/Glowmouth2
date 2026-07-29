import { Zap, Activity, Shield, ScanLine, Waves, Brain, Target } from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import OralHealthMap from '../../components/OralHealthMap';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const sciencePillars = [
  {
    icon: Zap,
    title: 'QLF technology',
    body: 'Blue-violet fluorescence helps reveal bacterial activity and early biological changes before symptoms surface.',
  },
  {
    icon: Activity,
    title: 'Biological detection',
    body: 'GlowMouth translates light patterns into regional activity signals that are easier to understand and act on.',
  },
  {
    icon: Shield,
    title: 'Preventative monitoring',
    body: 'The platform is built to spot recurring patterns, not just record scans, so users can improve over time.',
  },
];

const pipeline = [
  { icon: ScanLine, label: 'Scan', desc: 'Capture raw image' },
  { icon: Waves, label: 'Signal', desc: 'Read fluorescence' },
  { icon: Brain, label: 'Model', desc: 'AI pattern analysis' },
  { icon: Target, label: 'Action', desc: 'Personalized plan' },
];

const validationTimeline = [
  { title: 'Discovery', body: 'Fluorescence patterns reveal where bacterial load is concentrated.' },
  { title: 'Modeling', body: 'AI compares present scans to previous scans and identifies risk direction.' },
  { title: 'Interpretation', body: 'Users receive contextual summaries, not raw data alone.' },
  { title: 'Action', body: 'Reports and recommendations turn insights into preventive behavior.' },
];

export default function Science() {
  useDocumentTitle('Science');
  return (
    <>
      <Nav />
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="hero-badge">Scientific validation</span>
              <span className="eyebrow">Biotech presentation</span>
              <h1>Science first. Marketing last.</h1>
              <p className="hero-sub">
                GlowMouth is designed around a simple premise: detect meaningful change early, explain it clearly, and help people prevent problems before they become symptoms.
              </p>
            </div>
            <div className="oral-map">
              <div className="oral-map-header">
                <div>
                  <span className="eyebrow">Historical comparison</span>
                  <h3 className="oral-map-title">Two scans, six weeks apart.</h3>
                </div>
                <span className="status-pill status-pill-live">Live</span>
              </div>
              <div className="oral-map-tabs">
                <div className="oral-map-tab">
                  <span>May 20</span>
                  <strong>74</strong>
                </div>
                <div className="oral-map-tab active">
                  <span>Jun 20</span>
                  <strong>84</strong>
                </div>
              </div>
              <div className="oral-map-metrics">
                <div><span>Front</span><strong>+7</strong></div>
                <div><span>Left</span><strong>+4</strong></div>
                <div><span>Right</span><strong>+8</strong></div>
                <div><span>Rear</span><strong>+6</strong></div>
              </div>
              <p className="oral-map-note">
                Longitudinal detection in action: the same four zones, tracked over time, showing measurable improvement across every region.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="feat-row section-rule">
        <div className="container">
          <div className="section-center">
            <span className="eyebrow">Core science</span>
            <h2 className="section-h2">A premium biotech narrative built on detection and interpretation.</h2>
          </div>
          <div className="sci-grid">
            {sciencePillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="sci-card">
                <Icon size={20} color="var(--accent)" strokeWidth={1.75} aria-hidden />
                <div className="eyebrow" style={{ marginTop: 14 }}>{title}</div>
                <p className="sci-card-body" style={{ marginTop: 4 }}>{body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 40, fontSize: 15, color: 'var(--text-body)', maxWidth: 640, marginInline: 'auto', textAlign: 'center', lineHeight: 1.7 }}>
            405nm QLF technology was originally developed for clinical plaque detection in dental research settings. GlowMouth's sensor applies the same optical principle for daily home use.
          </p>
          <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            Research context: [Citation placeholder for VCU Philips Institute partnership — replace with actual citation before launch]
          </p>
        </div>
      </section>

      <section className="pub-section section-rule">
        <div className="container">
          <div className="feat-grid">
            <div>
              <span className="eyebrow">Research process</span>
              <h2 className="feat-h2">From fluorescence to actionable intelligence.</h2>
              <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
                {validationTimeline.map((item, index) => (
                  <div key={item.title} className="hero-mini-card">
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div className="hero-mini-stat" style={{ fontSize: 26 }}>{index + 1}</div>
                      <div>
                        <h3 style={{ margin: 0 }}>{item.title}</h3>
                        <p style={{ marginTop: 6 }}>{item.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pipeline-card">
              <span className="eyebrow" style={{ color: 'var(--accent-glow)' }}>Scientific workflow</span>
              <h3 style={{ marginTop: 8, color: '#fff' }}>A process built to feel credible, calm, and precise.</h3>
              <div className="pipeline-row">
                {pipeline.map(({ icon: Icon, label, desc }, i) => (
                  <div key={label} className="pipeline-step">
                    {i > 0 && <span className="pipeline-arrow" aria-hidden>→</span>}
                    <div className="pipeline-node">
                      <Icon size={20} color="var(--accent-glow)" strokeWidth={1.75} aria-hidden />
                    </div>
                    <span className="pipeline-label">{label}</span>
                    <span className="pipeline-desc">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.7, maxWidth: 640, marginInline: 'auto' }}>
            GlowMouth is a wellness intelligence platform. It does not diagnose, treat, or cure disease. Clinical concerns should always be reviewed by a licensed dental professional.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
