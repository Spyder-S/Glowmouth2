import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import Home from './pages/Home.jsx';
import Features from './pages/Features.jsx';
import Pricing from './pages/Pricing.jsx';
import FAQ from './pages/FAQ.jsx';

function App() {
  const [modal, setModal] = useState(null); // "signin" | "signup"
  const [score, setScore] = useState(78);

  // slowly drift score for demo feel
  useEffect(() => {
    const t = setInterval(() => setScore(s => Math.max(68, Math.min(90, s + (Math.random() > .5 ? 1 : -1)))), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <Router>
      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSwap={() => setModal(modal === "signup" ? "signin" : "signup")}
        />
      )}

      <Nav modal={modal} setModal={setModal} />

      <Routes>
        <Route path="/" element={<Home score={score} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;