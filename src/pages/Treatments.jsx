import { useState, useEffect, useMemo } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';

export default function Treatments({ onBook }) {
  const [treatments, setTreatments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState('all');

  useEffect(() => {
    Promise.all([
      sb.from('hok_treatments').select('*').eq('is_active', true).order('sort_order'),
      sb.from('hok_treatment_categories').select('*').order('sort_order'),
    ]).then(([{ data: t }, { data: c }]) => {
      setTreatments(t || []);
      setCategories(c || []);
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeCat === 'all') return treatments;
    return treatments.filter((t) => t.category_id === activeCat);
  }, [treatments, activeCat]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Our practice</div>
            <h2 className="section-title">
              Treatments <em>curated</em> for you
            </h2>
          </div>
          <p className="section-desc">
            From clinical hair restoration to targeted skin treatments — every session begins with a thorough consultation.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="cat-tabs" style={{ marginBottom: 32 }}>
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
                {c.name}
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((t) => {
            const cat = categories.find((c) => c.id === t.category_id);
            return (
              <article
                key={t.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
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
                  {cat && (
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: '.28em',
                        textTransform: 'uppercase',
                        color: 'var(--saffron)',
                        marginBottom: 6,
                      }}
                    >
                      {cat.name}
                    </div>
                  )}
                  <h3 className="serif" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}>
                    {t.name}
                  </h3>
                  {t.short_description && (
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, flex: 1, marginBottom: 16 }}>
                      {t.short_description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 16,
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    <div>
                      <div className="serif" style={{ fontSize: 20, color: 'var(--emerald)' }}>
                        {money(t.price_inr)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
                        {t.duration_minutes} min
                      </div>
                    </div>
                    <button className="mini-btn" onClick={() => onBook(t)} style={{ padding: '10px 16px' }}>
                      Book →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', marginTop: 40 }}>
            No treatments available in this category. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
