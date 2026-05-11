import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';

export default function Products({ cart, notify }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    sb.from('hok_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setProducts(data || []));
  }, []);

  const handleAdd = (p) => {
    cart.add(p);
    notify?.(`${p.name} added to cart`);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Shop</div>
            <h2 className="section-title">
              Home-care <em>products</em>
            </h2>
          </div>
          <p className="section-desc">
            Sulfate- and paraben-free. Safe for chemically-treated and coloured hair. Delivered across India.
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
                <div className="prod-desc">{p.description}</div>
                <div className="prod-foot">
                  <div className="prod-price">{money(p.price_inr)}</div>
                  <button
                    className={`prod-add ${cart.has(p.id) ? 'in' : ''}`}
                    onClick={() => handleAdd(p)}
                  >
                    {cart.has(p.id) ? '✓ Added' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}