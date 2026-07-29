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
      <div style={{ maxWidth: 800, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }} className="settings-grid">
        <div style={{ display: 'grid', gap: 20 }}>
          <div className="app-card">
            <span className="eyebrow">Profile</span>
            <form onSubmit={handleSave}>
              <div className="field" style={{ marginTop: 12 }}><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required/></div>
              <div className="field"><label>Email</label><input type="email" value={user?.email} disabled style={{ opacity: 0.6 }}/></div>
              <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
            </form>
          </div>

          <div className="app-card">
            <span className="eyebrow">Subscription</span>
            {user?.plan === 'free' ? (
              <>
                <p style={{ fontSize: 15, color: 'var(--text-body)', marginTop: 12, marginBottom: 16 }}>You're on the <strong style={{ color: 'var(--text)' }}>Free plan</strong>. Upgrade to unlock unlimited scans, AI insights, and dentist reports.</p>
                <Link to="/upgrade" className="btn btn-primary btn-sm">Upgrade to Premium →</Link>
              </>
            ) : (
              <>
                <p style={{ fontSize: 15, color: 'var(--text-body)', marginTop: 12, marginBottom: 16 }}>You're on <strong style={{ color: 'var(--accent)' }}>Premium</strong>. All features unlocked.</p>
                <button className="ghost-cta" style={{ margin: 0, fontSize: 14 }}>Manage subscription →</button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div className="app-card">
            <span className="eyebrow">Connected device</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>GlowMouth Sensor v1</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Bluetooth · Battery 78% · Last sync: 2h ago</div>
              </div>
              <span className="zone-badge badge-good">Connected</span>
            </div>
          </div>

          <div className="app-card">
            <span className="eyebrow">Account</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', marginTop: 12 }}>
              <button className="btn btn-ghost-light btn-sm">Change Password</button>
              <button className="btn btn-ghost-light btn-sm">Export My Data</button>
            </div>
          </div>
        </div>

        <div className="app-card" style={{ gridColumn: '1 / -1', borderColor: 'rgba(185,64,64,0.3)' }}>
          <span className="eyebrow" style={{ color: 'var(--red)' }}>Danger zone</span>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12, marginBottom: 16 }}>
            Deleting your account permanently removes all your scan data, history, and settings. This cannot be undone.
          </p>
          <button className="btn btn-sm" style={{ background: 'rgba(185,64,64,0.08)', color: 'var(--red)', border: '1.5px solid rgba(185,64,64,0.3)' }} onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </AppShell>
  );
}
