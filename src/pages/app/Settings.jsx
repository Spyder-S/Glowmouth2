import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';

function Toast({ msg }) { return <div className="toast">{msg}</div>; }

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name });
    showToast('Profile updated.');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure? This cannot be undone. All your data will be permanently deleted.')) {
      logout();
      localStorage.removeItem('gm_last_score');
      localStorage.removeItem('gm_last_scan');
      navigate('/');
    }
  };

  return (
    <AppShell title="Settings">
      {toast && <Toast msg={toast} />}
      <div style={{ maxWidth: 680 }}>
        {/* Profile */}
        <div className="app-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--heading)', marginBottom: 20 }}>Profile</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field"><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required/></div>
              <div className="field"><label>Email</label><input type="email" value={user?.email} disabled style={{ opacity: 0.6 }}/></div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
          </form>
        </div>

        {/* Plan */}
        <div className="app-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--heading)', marginBottom: 16 }}>Subscription</h3>
          {user?.plan === 'free' ? (
            <>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>You're on the <strong style={{ color: 'var(--heading)' }}>Free plan</strong>. Upgrade to unlock unlimited scans, AI insights, and dentist reports.</p>
              <Link to="/upgrade" className="btn btn-primary btn-sm">Upgrade to Premium →</Link>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>You're on <strong style={{ color: 'var(--teal)' }}>Premium</strong>. All features unlocked.</p>
              <button className="ghost-cta" style={{ margin: 0, fontSize: 14 }}>Manage subscription →</button>
            </>
          )}
        </div>

        {/* Device */}
        <div className="app-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--heading)', marginBottom: 16 }}>Connected Device</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--heading)', marginBottom: 4 }}>GlowMouth Sensor v1</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Bluetooth · Battery 78% · Last sync: 2h ago</div>
            </div>
            <span className="zone-badge badge-good">Connected</span>
          </div>
        </div>

        {/* Account */}
        <div className="app-card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--heading)', marginBottom: 16 }}>Account</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <button className="btn btn-ghost-light btn-sm">Change Password</button>
            <button className="btn btn-ghost-light btn-sm">Export My Data</button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="app-card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#DC2626', marginBottom: 8 }}>Danger Zone</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
            Deleting your account permanently removes all your scan data, history, and settings. This cannot be undone.
          </p>
          <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1.5px solid rgba(239,68,68,0.3)' }} onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </AppShell>
  );
}
