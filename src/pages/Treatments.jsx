import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';

export default function Treatments({ onBook }) {
  const [categories, setCategories] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [activeCat, setActiveCat] = useState('all');

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: trs }] = await Promise.all([
        sb.from('hok_treatment_categories').select('*').order('sort_order'),
        sb.from('hok_treatments').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setCategories(cats || []);
      setTreatments(trs || []);
    })();
  }, []);

  const filtered =
    activeCat === 'all' ? treatments : treatments.filter((t) => t.category_id === activeCat);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Full catalogue</div>
            <h2 className="section-title">
              Treatments for <em>hair & skin</em>
            </h2>
          </div>
          <p className="section-desc">
            From laser to rejuvenation — choose a category, pick a treatment, and book in a couple of taps.
          </p>
        </div>

        <div className="cat-tabs">
          <button
            className={`cat-tab ${activeCat === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`cat-tab ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="treat-grid">
          {filtered.map((t) => (
            <div key={t.id} className="treat-card">
              <div className="treat-icon">✦</div>
              <div className="treat-name">{t.name}</div>
              <div className="treat-short">{t.full_description || t.short_description}</div>
              <div className="treat-foot">
                <div>
                  <div className="treat-price">{money(t.price_inr)}</div>
                  <div className="treat-dur">{t.duration_minutes} min</div>
                </div>
                <button className="treat-book" onClick={() => onBook(t)}>Book →</button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
            No treatments in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}