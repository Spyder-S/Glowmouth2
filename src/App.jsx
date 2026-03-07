import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import Home from './pages/Home.jsx';
import Features from './pages/Features.jsx';
import Pricing from './pages/Pricing.jsx';
import FAQ from './pages/FAQ.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Scan from './pages/Scan.jsx';
import Results from './pages/Results.jsx';
import History from './pages/History.jsx';
import About from './pages/About.jsx';
import Support from './pages/Support.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Consent from './pages/Consent.jsx';
import Cookie from './pages/Cookie.jsx';
import Refund from './pages/Refund.jsx';
import Blog from './pages/Blog.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppContent() {
  const [modal, setModal] = useState(null); // "signin" | "signup"
  const [score, setScore] = useState(78);
  const { user } = useAuth();

  // slowly drift score for demo feel
  useEffect(() => {
    const t = setInterval(() => setScore(s => Math.max(68, Math.min(90, s + (Math.random() > .5 ? 1 : -1)))), 2600);
    return () => clearInterval(t);
  }, []);

  // listen for external requests to show auth modal
  useEffect(() => {
    const handler = e => {
      const m = e.detail?.mode;
      if (m === 'signin' || m === 'signup') {
        setModal(m);
      }
    };
    window.addEventListener('openAuth', handler);
    return () => window.removeEventListener('openAuth', handler);
  }, []);

  return (
    <>
      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSwap={() => setModal(modal === "signup" ? "signin" : "signup")}
        />
      )}
      <Nav modal={modal} setModal={setModal} />

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Home score={score} onGetStarted={() => setModal('signup')} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing openModal={setModal} />} />
        <Route path="/faq" element={<FAQ openModal={setModal} />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute redirectTo="/" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* catch all fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;