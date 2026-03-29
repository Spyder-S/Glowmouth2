import { useState } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

const FAQS = [
  { q: 'Is GlowMouth a medical device?', a: 'No. GlowMouth is a wellness screening tool only. It is not FDA-cleared as a medical device, does not diagnose any condition, and should not replace regular dental check-ups. If you have clinical concerns, please consult a licensed dentist.' },
  { q: 'How accurate is the GlowScore?', a: 'The GlowScore is derived from fluorescence intensity patterns that correlate with bacterial load and plaque distribution — metrics validated in peer-reviewed QLF research. It is a wellness indicator, not a clinical measurement. Accuracy improves with consistent daily scanning.' },
  { q: 'What is QLF technology?', a: 'Quantitative Light-induced Fluorescence (QLF) uses a 405nm blue-violet LED to cause bacterial porphyrins — byproducts of harmful oral bacteria — to fluoresce red. This makes plaque and bacterial deposits visible in a way normal light cannot, without any dyes or contrast agents.' },
  { q: 'Do I need the device to use GlowMouth?', a: 'The physical GlowMouth sensor ($49.99) is required for enhanced scanning and full 8-zone analysis. The free app tier provides simplified scanning using your smartphone camera, giving you a basic GlowScore.' },
  { q: 'How does the Premium subscription work?', a: 'Premium is $9.99/month or $100/year (saving $19.88). It unlocks AI-powered analysis, full 365-day history, trend insights, and shareable PDF reports. You can cancel anytime — no lock-in.' },
  { q: 'Can I share my results with my dentist?', a: 'Yes — Premium subscribers can generate a clean PDF report summarizing GlowScore trends, zone analysis, and key metrics over any time period. Many dentists find this longitudinal data valuable between appointments.' },
  { q: 'How do I interpret my GlowScore?', a: 'A GlowScore above 80 indicates low bacterial load across most surfaces. 65–79 suggests moderate activity worth addressing. Below 65 indicates elevated bacterial presence — a signal to improve oral hygiene or consult a dentist. Scores improve as your oral hygiene habits improve.' },
  { q: 'Is my scan data private?', a: 'Yes. Scan data is stored locally on your device by default. If you enable cloud sync, data is encrypted in transit and at rest. GlowMouth does not sell personal health data. See our Privacy Policy for full details.' },
  { q: 'What is your refund policy?', a: 'The GlowMouth device comes with a 30-day satisfaction guarantee — if you\'re not happy, return it for a full refund. Premium subscriptions can be cancelled anytime and will not auto-renew after cancellation.' },
  { q: 'When will GlowMouth launch?', a: 'GlowMouth is currently in late development. Join the waitlist on our homepage to be notified first when pre-orders open. Early waitlist members receive priority access and a 20% discount.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <Nav />
      <div style={{ paddingTop: 72 }}>
        <section style={{ padding: '100px 0 80px', background: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">FAQ</span>
            <h1 className="section-h2" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>Common questions, honest answers.</h1>
          </div>
        </section>
        <section style={{ padding: '0 0 120px', background: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  {faq.q}
                  <span className="faq-icon" style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {open === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
