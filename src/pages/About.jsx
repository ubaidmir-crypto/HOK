export default function About() {
  return (
    <section className="about">
      <div className="container about-grid">
        <div className="about-portrait" />
        <div>
          <div className="eyebrow" style={{ color: 'var(--saffron-soft)' }}>
            The practitioner
          </div>
          <h2>
            Dr. Mir Waleed <em>Mansoor</em>
          </h2>
          <p>
            A highly esteemed Aesthetic Physician, Cosmetologist, and Trichologist with over a decade
            of experience. Dr. Waleed is committed to holistic healthcare, combining traditional
            herbal approaches with cutting-edge modern practices.
          </p>
          <p>
            Equipped with USFDA-approved laser technology, he delivers a comprehensive range of
            treatments tailored to each individual — from precise laser hair removal and tattoo
            removal to PRP, anti-aging therapy, and skin rejuvenation.
          </p>
          <div className="about-creds">
            <div className="cred-item">
              <strong>10+ yrs</strong>Clinical practice
            </div>
            <div className="cred-item">
              <strong>MBCT</strong>British Board of Complementary Therapies
            </div>
            <div className="cred-item">
              <strong>Greifswald</strong>Institute of Laser & Aesthetic Medicine, Germany
            </div>
            <div className="cred-item">
              <strong>PG</strong>Skin & Venereal Disease, Inamdar Hospital
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}