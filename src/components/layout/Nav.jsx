import { useState, useEffect } from 'react';
import { CLINIC } from '../../lib/constants';
import Icon from '../ui/Icon';

const LINKS = [
  ['home', 'Home'],
  ['treatments', 'Treatments'],
  ['products', 'Shop'],
  ['stories', 'Stories'],
  ['book', 'Book'],
  ['ask', 'Ask'],
  ['about', 'About'],
  ['contact', 'Contact'],
];

export default function Nav({ route, go, cartCount, openCart }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [route]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleLinkClick = (key) => {
    setDrawerOpen(false);
    go(key);
  };

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <div className="brand" onClick={() => go('home')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark">Hair of Kashmir</span>
            <span className="brand-sub">Srinagar</span>
          </div>

          {/* Desktop nav links (hidden on mobile via CSS) */}
          <div className="nav-links">
            {LINKS.map(([key, label]) => (
              <button
                key={key}
                className={route === key ? 'active' : ''}
                onClick={() => go(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <button className="cart-btn" onClick={openCart}>
              <Icon name="cart" size={14} />
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Hamburger button (shown only on mobile via CSS) */}
            <button
              className="nav-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer + backdrop */}
      <div
        className={`nav-drawer-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="nav-drawer-head">
          <span className="nav-drawer-title">Menu</span>
          <button
            className="nav-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <div className="nav-drawer-links">
          {LINKS.map(([key, label]) => (
            <button
              key={key}
              className={`nav-drawer-link ${route === key ? 'active' : ''}`}
              onClick={() => handleLinkClick(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="nav-drawer-foot">
          <div className="nav-drawer-brand">Hair of Kashmir</div>
          <div className="nav-drawer-sub">Srinagar</div>
        </div>
      </div>
    </>
  );
}
