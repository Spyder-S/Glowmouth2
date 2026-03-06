import { useState } from 'react';

function AuthModal({ mode, onClose, onSwap }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const isUp = mode === "signup";

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{isUp ? "Create account" : "Welcome back"}</h3>
        <p className="modal-sub">{isUp ? "Start your 14-day free trial — no card needed." : "Sign in to your GlowMouth account."}</p>
        {isUp && (
          <div className="field">
            <label>Name</label>
            <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        {isUp && (
          <div className="check-row">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I agree to the Terms of Service and Privacy Policy. I understand GlowMouth is not a medical device.</span>
          </div>
        )}
        <button className="modal-btn" onClick={() => alert(`${isUp ? "Account created" : "Signed in"}! (Connect to backend to activate.)`)}>
          {isUp ? "Create Account" : "Sign In"}
        </button>
        <div className="modal-swap">
          {isUp ? "Already have an account? " : "No account yet? "}
          <button onClick={onSwap}>{isUp ? "Sign in" : "Sign up free"}</button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;