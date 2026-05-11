import { useState } from 'react';
import { ADMIN_PASS } from '../lib/constants';

export default function AdminLogin({ onAuth, onExit }) {
  const [pass, setPass] = useState('');

  const tryAuth = () => {
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('hok_admin', 'ok');
      onAuth();
    } else {
      alert('Wrong passcode');
    }
  };

  return (
    <div className="admin-shell">
      <div className="container">
        <div className="admin-login">
          <h2 className="serif">Staff access</h2>
          <p>Enter the admin passcode to view orders, appointments, and questions.</p>
          <div className="field">
            <label>Passcode</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && tryAuth()}
            />
          </div>
          <button className="submit-btn" onClick={tryAuth}>Sign in</button>
          <button className="mini-btn" style={{ marginTop: 14, width: '100%' }} onClick={onExit}>
            ← Back to site
          </button>
        </div>
      </div>
    </div>
  );
}