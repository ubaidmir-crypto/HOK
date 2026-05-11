import { useState, useEffect } from 'react';
import { sb } from '../../lib/supabase';
import { money } from '../../lib/format';

export default function FeaturedProducts({ go }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    sb.from('hok_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(4)
      .then(({ data }) => setProducts(data || []));
  }, []);

  return (
    <section className="section" style={{ background: 'var(--ivory-2)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Home care</div>
            <h2 className="section-title">
              Kashmir <em>Keratin</em> — take the results home
            </h2>
          </div>
          <p className="section-desc">
            A sulfate- and paraben-free system built around pure keratin. Extend your in-clinic
            results, every day.
          </p>
        </div>

        <div className="prod-grid">
          {products.map((p) => (
            <div key={p.id} className="prod-card">
              <div className="prod-img">
                <div className="prod-img-label">{p.name}</div>
              </div>
              <div className="prod-body">
                <div className="prod-cat">{p.category}</div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-foot">
                  <div className="prod-price">{money(p.price_inr)}</div>
                  <button className="prod-add" onClick={() => go('products')}>Shop →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}