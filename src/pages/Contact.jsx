import { CLINIC } from '../lib/constants';

export default function Contact() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Visit (.) Call (.) Write</div>
            <h2 className="section-title">
              Find <em>us</em>
            </h2>
          </div>
          <p className="section-desc">
            We're in the heart of Lal Nagar, Chanapora Bypass - above the National Centre of Diabetes & Hormone.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Hair of Kashmir</h3>
            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-val">
                {CLINIC.address.line1}
                <br />
                {CLINIC.address.line2}
                <br />
                {CLINIC.address.line3}
                <br />
                {CLINIC.address.line4}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Phone</div>
              <div className="info-val">
                <a href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Hours</div>
              <div className="info-val">
                {CLINIC.hours.weekdays}
                <br />
                {CLINIC.hours.saturday}
                <br />
                {CLINIC.hours.sunday}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Landmark</div>
              <div className="info-val">
                Above National Centre of Diabetes & Hormone, opposite timber shops.
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(160deg, var(--ivory-2), #D4C5A8)',
              minHeight: 400,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.3em',
                  textTransform: 'uppercase',
                  color: 'var(--emerald)',
                  marginBottom: 12,
                }}
              >
                Location
              </div>
              <div
                className="serif italic"
                style={{ fontSize: 28, color: 'var(--emerald)', lineHeight: 1.2, marginBottom: 20 }}
              >
                Srinagar,
                <br />
                Jammu &amp; Kashmir
              </div>
              <a
                href="https://maps.google.com/?q=Hair+of+Kashmir+Chanpora+Bypass+Srinagar"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block' }}
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
