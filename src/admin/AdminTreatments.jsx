import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { money } from '../lib/format';
import ImageUpload from '../components/ui/ImageUpload';

const EMPTY = {
  category_id: '',
  name: '',
  short_description: '',
  description: '',
  price_inr: 0,
  duration_minutes: 60,
  image_url: '',
  sort_order: 0,
  is_active: true,
  is_featured: false,
};

export default function AdminTreatments({ notify }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: t }, { data: c }] = await Promise.all([
      sb.from('hok_treatments').select('*').order('sort_order').order('created_at', { ascending: false }),
      sb.from('hok_treatment_categories').select('*').order('sort_order'),
    ]);
    setItems(t || []);
    setCategories(c || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm({ ...EMPTY, sort_order: items.length });
    setEditing('new');
  };

  const startEdit = (t) => {
    setForm({
      category_id: t.category_id || '',
      name: t.name,
      short_description: t.short_description || '',
      description: t.description || '',
      price_inr: Number(t.price_inr || 0),
      duration_minutes: Number(t.duration_minutes || 60),
      image_url: t.image_url || '',
      sort_order: t.sort_order || 0,
      is_active: t.is_active,
      is_featured: t.is_featured,
    });
    setEditing(t.id);
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

    const payload = {
      ...form,
      price_inr: Number(form.price_inr),
      duration_minutes: Number(form.duration_minutes),
      category_id: form.category_id || null,
    };

    if (editing === 'new') {
      const { error } = await sb.from('hok_treatments').insert(payload);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Treatment created', 'ok');
    } else {
      const { error } = await sb.from('hok_treatments').update(payload).eq('id', editing);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Treatment updated', 'ok');
    }

    cancel();
    load();
  };

  const del = async (t) => {
    if (!confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    const { error } = await sb.from('hok_treatments').delete().eq('id', t.id);
    if (error) return notify('Delete failed: ' + error.message, 'err');
    notify('Treatment deleted', 'ok');
    load();
  };

  const toggleActive = async (t) => {
    const { error } = await sb.from('hok_treatments').update({ is_active: !t.is_active }).eq('id', t.id);
    if (error) return notify('Update failed: ' + error.message, 'err');
    load();
  };

  // === EDIT / NEW form ===
  if (editing) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="serif" style={{ fontSize: 28 }}>
            {editing === 'new' ? 'New treatment' : 'Edit treatment'}
          </h2>
          <button className="mini-btn" onClick={cancel}>← Back</button>
        </div>

        <div className="panel">
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            label="Treatment image"
            notify={notify}
          />

          <div className="field">
            <label>Name *</label>
            <input value={form.name} onChange={set('name')} placeholder="e.g. PRP Hair Treatment" />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Category</label>
              <select value={form.category_id} onChange={set('category_id')}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                placeholder="60"
              />
            </div>
          </div>

          <div className="field">
            <label>Price (INR) *</label>
            <input
              type="number"
              value={form.price_inr}
              onChange={(e) => setForm({ ...form, price_inr: e.target.value })}
              placeholder="6000"
            />
          </div>

          <div className="field">
            <label>Short description</label>
            <input
              value={form.short_description}
              onChange={set('short_description')}
              placeholder="One-line teaser shown on the treatment card"
            />
          </div>

          <div className="field">
            <label>Full description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Detailed description shown when customer hovers or opens the treatment"
              style={{ minHeight: 120 }}
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
                  <span>Active (visible on site)</span>
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
            {saving ? 'Saving…' : editing === 'new' ? 'Create treatment' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  // === LIST view ===
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="serif" style={{ fontSize: 28 }}>Treatments</h2>
        <button
          className="mini-btn"
          onClick={startNew}
          style={{ background: 'var(--emerald)', color: 'var(--ivory)', borderColor: 'var(--emerald)', padding: '10px 16px', fontSize: 13 }}
        >
          + New treatment
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ marginBottom: 16 }}>No treatments yet.</p>
          <button className="mini-btn" onClick={startNew}>Add your first treatment</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((t) => {
            const cat = categories.find((c) => c.id === t.category_id);
            return (
              <div
                key={t.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto',
                  gap: 16,
                  alignItems: 'center',
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  padding: 16,
                  opacity: t.is_active ? 1 : 0.5,
                }}
              >
                {t.image_url ? (
                  <img src={t.image_url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                ) : (
                  <div style={{ width: 60, height: 60, background: 'linear-gradient(160deg, var(--ivory-2), #D4C5A8)', borderRadius: 2 }} />
                )}

                <div style={{ minWidth: 0 }}>
                  {cat && (
                    <div style={{ fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 4 }}>
                      {cat.name}
                    </div>
                  )}
                  <div className="serif" style={{ fontSize: 16, marginBottom: 4 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    {t.duration_minutes} min · {t.is_active ? 'Active' : 'Hidden'}
                    {t.is_featured && ' · Featured'}
                  </div>
                </div>

                <div className="serif" style={{ fontSize: 18, color: 'var(--emerald)', whiteSpace: 'nowrap' }}>
                  {money(t.price_inr)}
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="mini-btn" onClick={() => startEdit(t)}>Edit</button>
                  <button className="mini-btn" onClick={() => toggleActive(t)}>{t.is_active ? 'Hide' : 'Show'}</button>
                  <button className="mini-btn danger" onClick={() => del(t)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
