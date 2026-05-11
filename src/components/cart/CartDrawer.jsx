import { useState } from 'react';
import { sb } from '../../lib/supabase';
import { money } from '../../lib/format';
import Icon from '../ui/Icon';

export default function CartDrawer({ open, onClose, cart, notify }) {
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    shipping_address: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const submit = async () => {
    if (!form.full_name || !form.phone || !form.shipping_address) {
      return notify('Name, phone, and address are required', 'err');
    }
    if (cart.items.length === 0) return notify('Your cart is empty', 'err');

    setSaving(true);
    const { data, error } = await sb
      .from('hok_orders')
      .insert({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email || null,
        shipping_address: form.shipping_address,
        items: cart.items.map((i) => ({ product_id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal: cart.subtotal,
        total: cart.subtotal,
        notes: form.notes || null,
      })
      .select()
      .single();
    setSaving(false);

    if (error) return notify('Order failed: ' + error.message, 'err');
    setSuccess(data);
    cart.clear();
  };

  const resetAndClose = () => {
    setCheckout(false);
    setSuccess(null);
    setForm({ full_name: '', phone: '', email: '', shipping_address: '', notes: '' });
    onClose();
  };

  return (
    <>
      <div className={`drawer-bg ${open ? 'open' : ''}`} onClick={resetAndClose} />
      <div className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3>{success ? 'Order placed' : checkout ? 'Checkout' : 'Your cart'}</h3>
          <button className="drawer-close" onClick={resetAndClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        {success ? (
          <SuccessView order={success} onContinue={resetAndClose} />
        ) : checkout ? (
          <CheckoutView
            form={form}
            setForm={setForm}
            subtotal={cart.subtotal}
            saving={saving}
            onBack={() => setCheckout(false)}
            onSubmit={submit}
          />
        ) : (
          <CartView cart={cart} onCheckout={() => setCheckout(true)} />
        )}
      </div>
    </>
  );
}

function CartView({ cart, onCheckout }) {
  if (cart.items.length === 0) {
    return (
      <div className="drawer-body">
        <div className="empty-cart">Your cart is empty.</div>
      </div>
    );
  }

  return (
    <>
      <div className="drawer-body">
        {cart.items.map((i) => (
          <div key={i.id} className="cart-item">
            <div>
              <div className="cart-item-name">{i.name}</div>
              <div className="cart-item-meta">{money(i.price)} × {i.qty}</div>
              <div className="qty-ctrl">
                <button onClick={() => cart.updateQty(i.id, -1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => cart.updateQty(i.id, 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => cart.remove(i.id)}>Remove</button>
            </div>
            <div className="serif" style={{ fontSize: 16, color: 'var(--emerald)' }}>
              {money(i.price * i.qty)}
            </div>
          </div>
        ))}
      </div>

      <div className="drawer-foot">
        <div className="total-row">
          <span className="lbl">Subtotal</span>
          <span className="val">{money(cart.subtotal)}</span>
        </div>
        <button className="submit-btn" onClick={onCheckout}>Checkout</button>
      </div>
    </>
  );
}

function CheckoutView({ form, setForm, subtotal, saving, onBack, onSubmit }) {
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="drawer-body">
        <div className="field"><label>Full name *</label><input value={form.full_name} onChange={set('full_name')} /></div>
        <div className="field"><label>Phone *</label><input type="tel" value={form.phone} onChange={set('phone')} /></div>
        <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} /></div>
        <div className="field"><label>Shipping address *</label><textarea value={form.shipping_address} onChange={set('shipping_address')} /></div>
        <div className="field"><label>Order notes</label><textarea style={{ minHeight: 70 }} value={form.notes} onChange={set('notes')} /></div>

        <div style={{ background: 'var(--ivory)', padding: 14, fontSize: 13, marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span><strong>{money(subtotal)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span>Shipping</span><strong>Calculated at confirmation</strong>
          </div>
        </div>
      </div>

      <div className="drawer-foot">
        <button className="mini-btn" onClick={onBack}>← Back to cart</button>
        <button className="submit-btn" onClick={onSubmit} disabled={saving}>
          {saving ? 'Placing order…' : `Place order · ${money(subtotal)}`}
        </button>
      </div>
    </>
  );
}

function SuccessView({ order, onContinue }) {
  return (
    <div className="drawer-body">
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--emerald)', color: 'var(--ivory)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
        }}>
          <Icon name="check" size={22} />
        </div>
        <div className="serif" style={{ fontSize: 22, marginBottom: 6 }}>Thank you</div>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
          We'll call you to confirm. Pay on delivery or via UPI after confirmation.
        </p>
        <div style={{ background: 'var(--ivory)', padding: 16, borderRadius: 2, textAlign: 'left' }}>
          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Order number
          </div>
          <div className="serif" style={{ fontSize: 18, color: 'var(--emerald)' }}>{order.order_number}</div>
          <div style={{ fontSize: 13, marginTop: 10 }}>Total: <strong>{money(order.total)}</strong></div>
        </div>
        <button className="btn-primary" onClick={onContinue} style={{ marginTop: 20 }}>
          Continue shopping
        </button>
      </div>
    </div>
  );
}