import { useState, useEffect } from 'react';
import './styles/theme.css';

import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';

import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import Toast from './components/ui/Toast';

import Home from './pages/Home';
import Treatments from './pages/Treatments';
import Products from './pages/Products';
import Booking from './pages/Booking';
import Ask from './pages/Ask';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminPanel from './admin/AdminPanel';

export default function App() {
  const [route, setRoute] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [preselectTreatment, setPreselectTreatment] = useState(null);

  const cart = useCart();
  const toast = useToast();

  // Hash-based admin route
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#admin') setRoute('admin');
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const go = (r) => {
    setRoute(r);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const goToBooking = (treatment) => {
    setPreselectTreatment(treatment);
    go('book');
  };

  // Admin is a separate full-screen view
  if (route === 'admin') {
    return (
      <AdminPanel
        onExit={() => {
          window.location.hash = '';
          setRoute('home');
        }}
      />
    );
  }

  const pages = {
    home: <Home go={go} />,
    treatments: <Treatments onBook={goToBooking} />,
    products: <Products cart={cart} notify={toast.notify} />,
    book: <Booking preselect={preselectTreatment} notify={toast.notify} />,
    ask: <Ask notify={toast.notify} />,
    about: <About />,
    contact: <Contact />,
  };

  return (
    <div className="hok-root">
      <Nav route={route} go={go} cartCount={cart.count} openCart={() => setCartOpen(true)} />
      {pages[route]}
      <Footer go={go} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        notify={toast.notify}
      />
      <Toast toast={toast.current} />
    </div>
  );
}