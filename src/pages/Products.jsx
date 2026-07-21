import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';
import Icon from '../components/ui/Icon';

export default function Products({ cart, notify }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    sb.from('hok_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setProducts(data || []));
  }, []);

  const add = (p) => {
    cart.add(p);
    notify(`Added ${p.name} to cart`, 'ok');
  };

  const inCart = (id) => cart.items.some((i) => i.product_id === id);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Take home the ritual</div>
            <h2 className="section-title">
              Kashmir <em>Keratin</em>
            </h2>
          </div>
          <p className="section-desc">
            Our proprietary haircare line, formulated in the clinic and blended with traditional Kashmir botanicals.
          </p>
        </div>

        <div className="prod-grid">
          {products.map((p) => (
            <div key={p.id} className="prod-card">
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
                  <button
                    className={`prod-add ${inCart(p.id) ? 'in' : ''}`}
                    onClick={() => add(p)}
                  >
                    {inCart(p.id) ? (
                      <>
                        <Icon name="check" size={11} /> In Cart
                      </>
                    ) : (
                      'Add'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', marginTop: 40 }}>
            No products available right now. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
