import { useState, useEffect } from 'react';
import { sb } from '../../lib/supabase';
import { money } from '../../lib/format';

export default function FeaturedProducts({ go }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    sb.from('hok_products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order')
      .limit(4)
      .then(({ data }) => setProducts(data || []));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section" style={{ background: 'var(--ivory-2)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Kashmir Keratin</div>
            <h2 className="section-title">
              At-home <em>ritual</em>
            </h2>
          </div>
          <button className="btn-ghost" onClick={() => go('products')}>
            Shop all →
          </button>
        </div>

        <div className="prod-grid">
          {products.map((p) => (
            <div
              key={p.id}
              className="prod-card"
              style={{ cursor: 'pointer' }}
              onClick={() => go('products')}
            >
              <div className="prod-img">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div className="prod-img-label">{p.name}</div>
                )}
              </div>
              <div className="prod-body">
                {p.category && <div className="prod-cat">{p.category}</div>}
                <div className="prod-name">{p.name}</div>
                {p.short_description && <p className="prod-desc">{p.short_description}</p>}
                <div className="prod-foot">
                  <div className="prod-price">{money(p.price_inr)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
