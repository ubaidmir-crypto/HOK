import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminOverview from './AdminOverview';
import AdminAppointments from './AdminAppointments';
import AdminOrders from './AdminOrders';
import AdminQuestions from './AdminQuestions';
import AdminBlog from './AdminBlog';
import AdminGallery from './AdminGallery';
import AdminVideos from './AdminVideos';
import AdminProducts from './AdminProducts';
import AdminTreatments from './AdminTreatments';

const TABS = [
  ['overview', AdminOverview],
  ['appointments', AdminAppointments],
  ['orders', AdminOrders],
  ['questions', ({ notify }) => <AdminQuestions notify={notify} />],
  ['blog', ({ notify }) => <AdminBlog notify={notify} />],
  ['gallery', ({ notify }) => <AdminGallery notify={notify} />],
  ['videos', ({ notify }) => <AdminVideos notify={notify} />],
  ['treatments', ({ notify }) => <AdminTreatments notify={notify} />],
  ['products', ({ notify }) => <AdminProducts notify={notify} />],
];

export default function AdminPanel({ onExit, notify }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem('hok_admin') === 'ok');
  const [tab, setTab] = useState('overview');

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} onExit={onExit} />;

  const ActiveTab = TABS.find(([k]) => k === tab)?.[1];

  return (
    <div className="admin-shell">
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div className="section-kicker">Staff console</div>
            <h1 className="serif" style={{ fontSize: 36 }}>
              Hair of Kashmir · Admin
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="mini-btn" onClick={onExit}>← View site</button>
            <button
              className="mini-btn danger"
              onClick={() => {
                sessionStorage.removeItem('hok_admin');
                setAuthed(false);
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          {TABS.map(([key]) => (
            <button
              key={key}
              className={`admin-tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              {key}
            </button>
          ))}
        </div>

        {ActiveTab && <ActiveTab notify={notify} />}
      </div>
    </div>
  );
}
