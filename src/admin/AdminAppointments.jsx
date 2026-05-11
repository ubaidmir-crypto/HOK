import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { trimSeconds } from '../lib/format';
import { APPOINTMENT_STATUSES } from '../lib/constants';
import StatusPill from '../components/ui/StatusPill';

export default function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    let q = sb
      .from('hok_appointments')
      .select('*')
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setRows(data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id, s) => {
    await sb.from('hok_appointments').update({ status: s }).eq('id', id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...APPOINTMENT_STATUSES].map((s) => (
          <button
            key={s}
            className="mini-btn"
            onClick={() => setFilter(s)}
            style={
              filter === s
                ? { background: 'var(--emerald)', color: 'var(--ivory)', borderColor: 'var(--emerald)' }
                : undefined
            }
          >
            {s}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Date · Time</th>
              <th>Customer</th>
              <th>Treatment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontFamily: 'Fraunces,serif', color: 'var(--emerald)' }}>
                  {r.appointment_number}
                </td>
                <td>
                  {r.appointment_date}
                  <br />
                  <span style={{ color: 'var(--muted)' }}>{trimSeconds(r.appointment_time)}</span>
                </td>
                <td>
                  <strong>{r.full_name}</strong>
                  <br />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>{r.phone}</span>
                </td>
                <td>{r.treatment_name}</td>
                <td><StatusPill status={r.status} /></td>
                <td>
                  {r.status === 'pending' && (
                    <button className="mini-btn" onClick={() => setStatus(r.id, 'confirmed')}>Confirm</button>
                  )}
                  {(r.status === 'pending' || r.status === 'confirmed') && (
                    <button className="mini-btn" onClick={() => setStatus(r.id, 'completed')}>Complete</button>
                  )}
                  {r.status !== 'cancelled' && (
                    <button className="mini-btn danger" onClick={() => setStatus(r.id, 'cancelled')}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}