import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import ImageUpload from '../components/ui/ImageUpload';

const EMPTY = {
  title: '',
  treatment_name: '',
  before_image_url: '',
  after_image_url: '',
  caption: '',
  sort_order: 0,
  is_published: true,
};

export default function AdminGallery({ notify }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await sb.from('hok_gallery').select('*').order('sort_order').order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm({ ...EMPTY, sort_order: items.length });
    setEditing('new');
  };

  const startEdit = (g) => {
    setForm({
      title: g.title || '',
      treatment_name: g.treatment_name || '',
      before_image_url: g.before_image_url,
      after_image_url: g.after_image_url,
      caption: g.caption || '',
      sort_order: g.sort_order || 0,
      is_published: g.is_published,
    });
    setEditing(g.id);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    if (!form.before_image_url || !form.after_image_url) {
      notify('Both before and after images are required', 'err');
      return;
    }
    setSaving(true);

    if (editing === 'new') {
      const { error } = await sb.from('hok_gallery').insert(form);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Gallery entry created', 'ok');
    } else {
      const { error } = await sb.from('hok_gallery').update(form).eq('id', editing);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Gallery entry updated', 'ok');
    }

    cancel();
    load();
  };

  const del = async (g) => {
    if (!confirm(`Delete this gallery entry? This cannot be undone.`)) return;
    const { error } = await sb.from('hok_gallery').delete().eq('id', g.id);
    if (error) return notify('Delete failed: ' + error.message, 'err');
    notify('Gallery entry deleted', 'ok');
    load();
  };

  const togglePublished = async (g) => {
    const { error } = await sb.from('hok_gallery').update({ is_published: !g.is_published }).eq('id', g.id);
    if (error) return notify('Update failed: ' + error.message, 'err');
    load();
  };

  // === EDIT / NEW form ===
  if (editing) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="serif" style={{ fontSize: 28 }}>
            {editing === 'new' ? 'New gallery entry' : 'Edit gallery entry'}
          </h2>
          <button className="mini-btn" onClick={cancel}>← Back</button>
        </div>

        <div className="panel">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <ImageUpload
              value={form.before_image_url}
              onChange={(url) => setForm({ ...form, before_image_url: url })}
              label="Before image *"
              notify={notify}
            />
            <ImageUpload
              value={form.after_image_url}
              onChange={(url) => setForm({ ...form, after_image_url: url })}
              label="After image *"
              notify={notify}
            />
          </div>

          <div className="field">
            <label>Treatment name</label>
            <input
              value={form.treatment_name}
              onChange={set('treatment_name')}
              placeholder="e.g. PRP Hair Treatment"
            />
          </div>

          <div className="field">
            <label>Title (optional)</label>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. 4-session result"
            />
          </div>

          <div className="field">
            <label>Caption / description (optional)</label>
            <textarea
              value={form.caption}
              onChange={set('caption')}
              placeholder="e.g. Visible regrowth across the crown after 6 months."
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="field">
            <label>Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              style={{ width: 100 }}
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Lower numbers appear first.
            </div>
          </div>

          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              <span>Published (visible on the site)</span>
            </label>
          </div>

          <button className="submit-btn" onClick={save} disabled={saving} style={{ marginTop: 16 }}>
            {saving ? 'Saving…' : editing === 'new' ? 'Create entry' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  // === LIST view ===
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="serif" style={{ fontSize: 28 }}>Gallery</h2>
        <button
          className="mini-btn"
          onClick={startNew}
          style={{ background: 'var(--emerald)', color: 'var(--ivory)', borderColor: 'var(--emerald)', padding: '10px 16px', fontSize: 13 }}
        >
          + Add before/after
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ marginBottom: 16 }}>No gallery entries yet.</p>
          <button className="mini-btn" onClick={startNew}>Add your first entry</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((g) => (
            <div
              key={g.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto 1fr auto',
                gap: 16,
                alignItems: 'center',
                background: 'var(--white)',
                border: '1px solid var(--line)',
                padding: 16,
              }}
            >
              <img
                src={g.before_image_url}
                alt="Before"
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }}
              />
              <img
                src={g.after_image_url}
                alt="After"
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }}
              />
              <div style={{ minWidth: 0 }}>
                {g.treatment_name && (
                  <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 4 }}>
                    {g.treatment_name}
                  </div>
                )}
                {g.title && (
                  <div className="serif" style={{ fontSize: 16, marginBottom: 2 }}>
                    {g.title}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {g.is_published ? 'Published' : 'Draft'} · Order {g.sort_order}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="mini-btn" onClick={() => startEdit(g)}>Edit</button>
                <button className="mini-btn" onClick={() => togglePublished(g)}>{g.is_published ? 'Hide' : 'Publish'}</button>
                <button className="mini-btn danger" onClick={() => del(g)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
