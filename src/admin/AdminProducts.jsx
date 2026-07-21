import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';
import ImageUpload from '../components/ui/ImageUpload';

const EMPTY = {
  name: '',
  category: '',
  short_description: '',
  description: '',
  price_inr: 0,
  image_url: '',
  sort_order: 0,
  is_active: true,
  is_featured: false,
};

export default function AdminProducts({ notify }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await sb.from('hok_products').select('*').order('sort_order').order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm({ ...EMPTY, sort_order: items.length });
    setEditing('new');
  };

  const startEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category || '',
      short_description: p.short_description || '',
      description: p.description || '',
      price_inr: Number(p.price_inr || 0),
      image_url: p.image_url || '',
      sort_order: p.sort_order || 0,
      is_active: p.is_active,
      is_featured: p.is_featured,
    });
    setEditing(p.id);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    if (!form.name.trim() || !form.price_inr) {
      notify('Name and price are required', 'err');
      return;
    }
    setSaving(true);

    const payload = { ...form, price_inr: Number(form.price_inr) };

    if (editing === 'new') {
      const { error } = await sb.from('hok_products').insert(payload);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Product created', 'ok');
    } else {
      const { error } = await sb.from('hok_products').update(payload).eq('id', editing);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Product updated', 'ok');
    }

    cancel();
    load();
  };

  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await sb.from('hok_products').delete().eq('id', p.id);
    if (error) return notify('Delete failed: ' + error.message, 'err');
    notify('Product deleted', 'ok');
    load();
  };

  const toggleActive = async (p) => {
    const { error } = await sb.from('hok_products').update({ is_active: !p.is_active }).eq('id', p.id);
    if (error) return notify('Update failed: ' + error.message, 'err');
    load();
  };

  // === EDIT / NEW form ===
  if (editing) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="serif" style={{ fontSize: 28 }}>
            {editing === 'new' ? 'New product' : 'Edit product'}
          </h2>
          <button className="mini-btn" onClick={cancel}>← Back</button>
        </div>

        <div className="panel">
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            label="Product image"
            notify={notify}
          />

          <div className="field">
            <label>Name *</label>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Kashmir Keratin Smoothing Shampoo" />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Category</label>
              <input value={form.category} onChange={set('category')} placeholder="e.g. Shampoo, Conditioner, Serum" />
            </div>
            <div className="field">
              <label>Price (INR) *</label>
              <input
                type="number"
                value={form.price_inr}
                onChange={(e) => setForm({ ...form, price_inr: e.target.value })}
                placeholder="1200"
              />
            </div>
          </div>

          <div className="field">
            <label>Short description</label>
            <input
              value={form.short_description}
              onChange={set('short_description')}
              placeholder="One-line teaser shown on the product card"
            />
          </div>

          <div className="field">
            <label>Full description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Detailed description shown when customer hovers or opens the product"
              style={{ minHeight: 100 }}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Sort order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Lower numbers first.</div>
            </div>
            <div className="field">
              <label>&nbsp;</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <span>Active (visible on shop)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <span>Featured on homepage</span>
                </label>
              </div>
            </div>
          </div>

          <button className="submit-btn" onClick={save} disabled={saving} style={{ marginTop: 16 }}>
            {saving ? 'Saving…' : editing === 'new' ? 'Create product' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  // === LIST view ===
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="serif" style={{ fontSize: 28 }}>Products</h2>
        <button
          className="mini-btn"
          onClick={startNew}
          style={{ background: 'var(--emerald)', color: 'var(--ivory)', borderColor: 'var(--emerald)', padding: '10px 16px', fontSize: 13 }}
        >
          + New product
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ marginBottom: 16 }}>No products yet.</p>
          <button className="mini-btn" onClick={startNew}>Add your first product</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                gap: 16,
                alignItems: 'center',
                background: 'var(--white)',
                border: '1px solid var(--line)',
                padding: 16,
                opacity: p.is_active ? 1 : 0.5,
              }}
            >
              {p.image_url ? (
                <img src={p.image_url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }} />
              ) : (
                <div style={{ width: 60, height: 60, background: 'var(--ivory-2)', borderRadius: 2 }} />
              )}

              <div style={{ minWidth: 0 }}>
                {p.category && (
                  <div style={{ fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                    {p.category}
                  </div>
                )}
                <div className="serif" style={{ fontSize: 16, marginBottom: 4 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {p.is_active ? 'Active' : 'Hidden'}
                  {p.is_featured && ' · Featured'}
                  {' · Order ' + p.sort_order}
                </div>
              </div>

              <div className="serif" style={{ fontSize: 18, color: 'var(--emerald)', whiteSpace: 'nowrap' }}>
                {money(p.price_inr)}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="mini-btn" onClick={() => startEdit(p)}>Edit</button>
                <button className="mini-btn" onClick={() => toggleActive(p)}>{p.is_active ? 'Hide' : 'Show'}</button>
                <button className="mini-btn danger" onClick={() => del(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
