import { useState, useEffect, useRef } from "react";

const FAQS = [
  { q: "Is GlowMouth a medical device?", a: "No. GlowMouth is a wellness screening tool. GlowScore and all indicators are for awareness only — not medical diagnosis. Always consult a dentist for health concerns." },
  { q: "How accurate are the scans?", a: "Accuracy depends on image quality. Each result includes a confidence level (High / Medium / Low) so you always know how reliable your reading is." },
  { q: "Who can see my scan data?", a: "Only you. Scans are encrypted at rest and in transit. You can delete any scan or your entire account from Settings at any time." },
  { q: "Do I need the physical device?", a: "No — the app works with any smartphone camera. The GlowMouth device provides enhanced optics for higher consistency." },
  { q: "How often should I scan?", a: "3–7 times per week builds the richest trend baseline. Same time each day gives the most comparable results." },
  { q: "What's the refund policy?", a: "Subscriptions cancel anytime; access continues to end of billing period. The device has a 30-day satisfaction guarantee from delivery." },
];

function useFade(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    ref.current.querySelectorAll(".fade").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);
  const pageRef = useRef(null);
  useFade(pageRef);

  return (
    <div ref={pageRef}>
      {/* ── FAQ ── */}
      <section id="faq">
        <div className="wrap">
          <div className="fade center">
            <span className="tag">FAQ</span>
            <h2>Questions<br /><em>answered</em></h2>
          </div>
          <div className="faq-grid fade" style={{ transitionDelay: ".12s" }}>
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-q">
                  <span className="faq-qt">{f.q}</span>
                  <span className={`faq-plus${openFaq === i ? " open" : ""}`}>+</span>
                </div>
                {openFaq === i && <p className="faq-ans">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-sec">
        <div className="cta-glow" />
        <div className="wrap fade">
          <span className="tag">Get started</span>
          <h2>Start <em>glowing</em> today</h2>
          <p className="lead">Join thousands building better oral wellness habits. 14-day free trial, no card needed.</p>
          <div className="cta-btns">
            <button className="btn btn-teal btn-teal-lg" onClick={() => alert("Signup modal")}>Get Started Free →</button>
            <button className="btn btn-outline" onClick={() => alert("Signin modal")}>Sign In</button>
          </div>
          <p className="cta-note">⚕ Not a medical device · Not for diagnosis · Always consult your dentist</p>
        </div>
      </section>
    </div>
  );
}

export default FAQ;