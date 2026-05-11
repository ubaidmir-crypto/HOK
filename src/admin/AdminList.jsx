import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';

export default function AdminList({ type }) {
  const table = type === 'treatment' ? 'hok_treatments' : 'hok_products';
  const [rows, setRows] = useState([]);

  const load = async () => {
    const { data } = await sb.from(table).select('*').order('sort_order');
    setRows(data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const toggle = async (r) => {
    await sb.from(table).update({ is_active: !r.is_active }).eq('id', r.id);
    load();
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>{type === 'product' ? 'Category' : 'Duration'}</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <strong>{r.name}</strong>
                <br />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {r.short_description || r.description?.slice(0, 70)}
                </span>
              </td>
              <td>{type === 'product' ? r.category : `${r.duration_minutes} min`}</td>
              <td style={{ fontFamily: 'Fraunces,serif', color: 'var(--emerald)' }}>
                {money(r.price_inr)}
              </td>
              <td>
                <span className={`status-pill ${r.is_active ? 'st-completed' : 'st-cancelled'}`}>
                  {r.is_active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td>
                <button className="mini-btn" onClick={() => toggle(r)}>
                  {r.is_active ? 'Hide' : 'Show'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ padding: 16, fontSize: 12, color: 'var(--muted)' }}>
        Tip: to add/edit {type}s directly, use the Supabase dashboard for now.
      </p>
    </div>
  );
}