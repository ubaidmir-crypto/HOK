import { useState, useEffect } from 'react';
import { sb } from '../../lib/supabase';
import { money } from '../../lib/format';

export default function FeaturedTreatments({ onView, onBook }) {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    sb.from('hok_treatments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(6)
      .then(({ data }) => setTreatments(data || []));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Signature care</div>
            <h2 className="section-title">
              Our most-requested <em>treatments</em>
            </h2>
          </div>
          <p className="section-desc">
            Every treatment is administered personally by Dr. Waleed or one of our qualified
            practitioners, with world-class equipment.
          </p>
        </div>

        <div className="treat-grid">
          {treatments.map((t) => (
            <div key={t.id} className="treat-card">
              <div className="treat-icon">✦</div>
              <div className="treat-name">{t.name}</div>
              <div className="treat-short">{t.short_description}</div>
              <div className="treat-foot">
                <div>
                  <div className="treat-price">{money(t.price_inr)}</div>
                  <div className="treat-dur">{t.duration_minutes} min</div>
                </div>
                <button className="treat-book" onClick={onBook}>Book →</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn-ghost" onClick={onView}>See all treatments</button>
        </div>
      </div>
    </section>
  );
}