const ITEMS = [
  ['Laser Hair Removal', 'Precise, painless, permanent'],
  ['PRP Therapy', 'Natural hair regrowth'],
  ['Anti-Aging', 'Restore youthful radiance'],
  ['Keratin Care', '6–8 months of smooth'],
];

export default function ServicesStrip() {
  return (
    <section
      className="section"
      style={{
        paddingTop: 60,
        paddingBottom: 60,
        background: 'var(--white)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="container"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 0 }}
      >
        {ITEMS.map(([title, sub], i) => (
          <div
            key={title}
            style={{
              padding: '18px 24px',
              borderLeft: i ? '1px solid var(--line)' : 'none',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'var(--saffron)',
              }}
            >
              0{i + 1}
            </div>
            <div className="serif" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.15 }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}