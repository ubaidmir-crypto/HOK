import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';

export default function AdminOverview() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    (async () => {
      const [a, o, q, t, p] = await Promise.all([
        sb.from('hok_appointments').select('id, status', { count: 'exact' }),
        sb.from('hok_orders').select('id, status, total', { count: 'exact' }),
        sb.from('hok_questions').select('id, status', { count: 'exact' }),
        sb.from('hok_treatments').select('id', { count: 'exact' }).eq('is_active', true),
        sb.from('hok_products').select('id', { count: 'exact' }).eq('is_active', true),
      ]);
      setCounts({
        appts: a.count || 0,
        pendingAppts: (a.data || []).filter((x) => x.status === 'pending').length,
        orders: o.count || 0,
        pendingOrders: (o.data || []).filter((x) => x.status === 'pending').length,
        revenue: (o.data || [])
          .filter((x) => x.status !== 'cancelled')
          .reduce((s, x) => s + Number(x.total || 0), 0),
        newQs: (q.data || []).filter((x) => x.status === 'new').length,
        treatments: t.count || 0,
        products: p.count || 0,
      });
    })();
  }, []);

  if (!counts) return <p>Loading…</p>;

  const cards = [
    ['Pending appointments', counts.pendingAppts],
    ['Total appointments', counts.appts],
    ['Pending orders', counts.pendingOrders],
    ['Total orders', counts.orders],
    ['Order revenue', money(counts.revenue), 24],
    ['New questions', counts.newQs],
  ];

  return (
    <div>
      <div className="admin-counts">
        {cards.map(([label, value, fontSize]) => (
          <div key={label} className="count-card">
            <div className="count-lbl">{label}</div>
            <div className="count-val" style={fontSize ? { fontSize } : undefined}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>
        Use the tabs above to manage appointments, orders, and questions. Catalogue tabs let you toggle
        treatments/products on or off.
      </p>
    </div>
  );
}