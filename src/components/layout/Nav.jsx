import Icon from '../ui/Icon';

const LINKS = [
  ['home', 'Home'],
  ['treatments', 'Treatments'],
  ['products', 'Shop'],
  ['book', 'Book'],
  ['ask', 'Ask'],
  ['about', 'About'],
  ['contact', 'Contact'],
];

export default function Nav({ route, go, cartCount, openCart }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <button className="brand" onClick={() => go('home')}>
          <span className="brand-mark">Hair of Kashmir</span>
          <span className="brand-sub">Est. Srinagar</span>
        </button>

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
            <Icon name="cart" size={14} /> Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}