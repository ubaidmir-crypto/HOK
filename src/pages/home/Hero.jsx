export default function Hero({ go }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Aesthetic Clinic · Srinagar</div>
          <h1>
            Care for hair <br />
            & skin, refined <br />
            over a <em>decade</em>.
          </h1>
          <p className="hero-sub">
            Led by Dr. Mir Waleed Mansoor — Aesthetic Physician, Cosmetologist & Trichologist.
            FDA-approved lasers, PRP, keratin therapy, and personalised treatments, all under one roof.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => go('book')}>Book an appointment</button>
            <button className="btn-ghost" onClick={() => go('treatments')}>Explore treatments</button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">10+</div><div className="stat-lbl">Years</div></div>
            <div><div className="stat-num">1000s</div><div className="stat-lbl">Patients</div></div>
            <div><div className="stat-num">FDA</div><div className="stat-lbl">Approved</div></div>
          </div>
        </div>

        <div>
          <div className="hero-visual">
            <div className="hero-visual-mark">HOK · 01</div>
            <div className="hero-visual-label">
              "Combining traditional craft with modern precision — every patient, every time."
            </div>
          </div>
        </div>
      </div>
      <div className="decorative-dots" />
    </section>
  );
}