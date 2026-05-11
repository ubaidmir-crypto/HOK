import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money, formatDateShort, formatTime } from '../lib/format';
import { ORDER_STATUSES } from '../lib/constants';
import StatusPill from '../components/ui/StatusPill';

export default function AdminOrders() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    let q = sb.from('hok_orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setRows(data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id, s) => {
    await sb.from('hok_orders').update({ status: s }).eq('id', id);
    load();
  };

  const nextActions = {
    pending: ['confirmed', 'Confirm'],
    confirmed: ['shipped', 'Ship'],
    shipped: ['delivered', 'Delivered'],
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...ORDER_STATUSES].map((s) => (
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
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const next = nextActions[r.status];
              return (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'Fraunces,serif', color: 'var(--emerald)' }}>
                    {r.order_number}
                  </td>
                  <td>
                    {formatDateShort(r.created_at)}
                    <br />
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{formatTime(r.created_at)}</span>
                  </td>
                  <td>
                    <strong>{r.full_name}</strong>
                    <br />
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{r.phone}</span>
                    <br />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.shipping_address}</span>
                  </td>
                  <td>
                    {(r.items || []).map((i, k) => (
                      <div key={k} style={{ fontSize: 12 }}>
                        {i.qty}× {i.name}
                      </div>
                    ))}
                  </td>
                  <td style={{ fontFamily: 'Fraunces,serif', color: 'var(--emerald)' }}>
                    {money(r.total)}
                  </td>
                  <td><StatusPill status={r.status} /></td>
                  <td>
                    {next && (
                      <button className="mini-btn" onClick={() => setStatus(r.id, next[0])}>
                        {next[1]}
                      </button>
                    )}
                    {r.status !== 'cancelled' && r.status !== 'delivered' && (
                      <button className="mini-btn danger" onClick={() => setStatus(r.id, 'cancelled')}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}