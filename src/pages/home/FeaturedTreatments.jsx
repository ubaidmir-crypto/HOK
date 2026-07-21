import { useState, useEffect } from 'react';
import { sb } from '../../lib/supabase';
import { money } from '../../lib/format';

export default function FeaturedTreatments({ go }) {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    sb.from('hok_treatments')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order')
      .limit(4)
      .then(({ data }) => setTreatments(data || []));
  }, []);

  if (treatments.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Signature treatments</div>
            <h2 className="section-title">
              Our <em>most sought</em>
            </h2>
          </div>
          <button className="btn-ghost" onClick={() => go('treatments')}>
            See all →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {treatments.map((t) => (
            <article
              key={t.id}
              onClick={() => go('treatments')}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 24px 48px -24px rgba(15,61,46,.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                {t.image_url ? (
                  <img
                    src={t.image_url}
                    alt={t.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(160deg, var(--ivory-2), #D4C5A8)',
                    }}
                  />
                )}
              </div>

              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="serif" style={{ fontSize: 20, lineHeight: 1.2, marginBottom: 8 }}>
                  {t.name}
                </h3>
                {t.short_description && (
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, flex: 1, marginBottom: 12 }}>
                    {t.short_description}
                  </p>
                )}
                <div
                  className="serif"
                  style={{ fontSize: 18, color: 'var(--emerald)', marginTop: 'auto' }}
                >
                  {money(t.price_inr)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
