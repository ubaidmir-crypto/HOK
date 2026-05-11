import { CLINIC } from '../../lib/constants';

export default function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-mark" style={{ color: 'var(--saffron-soft)', fontSize: 30 }}>
              Hair of Kashmir
            </div>
            <p style={{ marginTop: 14, maxWidth: 360 }}>
              An aesthetic clinic in Srinagar specialising exclusively in hair and skin
              concerns - where research, education, and refined practice meet.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><button onClick={() => go('treatments')}>Treatments</button></li>
              <li><button onClick={() => go('products')}>Shop</button></li>
              <li><button onClick={() => go('book')}>Book appointment</button></li>
              <li><button onClick={() => go('ask')}>Ask a question</button></li>
            </ul>
          </div>

          <div>
            <h4>Visit</h4>
            <ul>
              <li>Chanpora Bypass, Srinagar</li>
              <li>J&K 190015</li>
              <li><a href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>(c) {new Date().getFullYear()} Hair of Kashmir. All rights reserved.</span>
          <a
            href="#admin"
            onClick={() => (window.location.hash = 'admin')}
            style={{ color: 'rgba(246,241,232,.4)' }}
          >
            Staff login
          </a>
        </div>
      </div>
    </footer>
  );
}
