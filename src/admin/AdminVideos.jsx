import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';

const EMPTY = {
  title: '',
  description: '',
  youtube_url: '',
  sort_order: 0,
  is_published: true,
};

// Extract video ID from various YouTube URL formats
function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2];
      return u.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

// Get thumbnail URL from video ID
function getThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function AdminVideos({ notify }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await sb.from('hok_videos').select('*').order('sort_order').order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm({ ...EMPTY, sort_order: items.length });
    setEditing('new');
  };

  const startEdit = (v) => {
    setForm({
      title: v.title,
      description: v.description || '',
      youtube_url: v.youtube_url,
      sort_order: v.sort_order || 0,
      is_published: v.is_published,
    });
    setEditing(v.id);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    if (!form.title.trim() || !form.youtube_url.trim()) {
      notify('Title and YouTube URL are required', 'err');
      return;
    }
    if (!getYouTubeId(form.youtube_url)) {
      notify('That does not look like a valid YouTube URL', 'err');
      return;
    }

    setSaving(true);

    // Set thumbnail_url automatically from the YouTube URL
    const dataToSave = { ...form, thumbnail_url: getThumbnail(form.youtube_url) };

    if (editing === 'new') {
      const { error } = await sb.from('hok_videos').insert(dataToSave);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Video added', 'ok');
    } else {
      const { error } = await sb.from('hok_videos').update(dataToSave).eq('id', editing);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Video updated', 'ok');
    }

    cancel();
    load();
  };

  const del = async (v) => {
    if (!confirm(`Delete "${v.title}"?`)) return;
    const { error } = await sb.from('hok_videos').delete().eq('id', v.id);
    if (error) return notify('Delete failed: ' + error.message, 'err');
    notify('Video deleted', 'ok');
    load();
  };

  const togglePublished = async (v) => {
    const { error } = await sb.from('hok_videos').update({ is_published: !v.is_published }).eq('id', v.id);
    if (error) return notify('Update failed: ' + error.message, 'err');
    load();
  };

  // === EDIT / NEW form ===
  if (editing) {
    const preview = getThumbnail(form.youtube_url);
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="serif" style={{ fontSize: 28 }}>
            {editing === 'new' ? 'New video' : 'Edit video'}
          </h2>
          <button className="mini-btn" onClick={cancel}>← Back</button>
        </div>

        <div className="panel">
          <div className="field">
            <label>Title *</label>
            <input value={form.title} onChange={set('title')} placeholder="e.g. How PRP works" />
          </div>

          <div className="field">
            <label>YouTube URL *</label>
            <input
              value={form.youtube_url}
              onChange={set('youtube_url')}
              placeholder="e.g. https://youtube.com/watch?v=abc123"
            />
            {preview && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
                  Preview
                </div>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: 320, aspectRatio: '16/9', objectFit: 'cover', border: '1px solid var(--line)', borderRadius: 2 }}
                />
              </div>
            )}
          </div>

          <div className="field">
            <label>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="A short description shown below the video."
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
            {saving ? 'Saving…' : editing === 'new' ? 'Add video' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  // === LIST view ===
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="serif" style={{ fontSize: 28 }}>Videos</h2>
        <button
          className="mini-btn"
          onClick={startNew}
          style={{ background: 'var(--emerald)', color: 'var(--ivory)', borderColor: 'var(--emerald)', padding: '10px 16px', fontSize: 13 }}
        >
          + Add video
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ marginBottom: 16 }}>No videos yet.</p>
          <button className="mini-btn" onClick={startNew}>Add your first video</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((v) => (
            <div
              key={v.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 16,
                alignItems: 'center',
                background: 'var(--white)',
                border: '1px solid var(--line)',
                padding: 16,
              }}
            >
              {v.thumbnail_url ? (
                <img
                  src={v.thumbnail_url}
                  alt=""
                  style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 2 }}
                />
              ) : (
                <div style={{ width: 100, height: 60, background: 'var(--ivory-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, borderRadius: 2 }}>
                  ▶
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 16, marginBottom: 4 }}>
                  {v.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {v.is_published ? 'Published' : 'Draft'} · Order {v.sort_order}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="mini-btn" onClick={() => startEdit(v)}>Edit</button>
                <button className="mini-btn" onClick={() => togglePublished(v)}>{v.is_published ? 'Hide' : 'Publish'}</button>
                <button className="mini-btn danger" onClick={() => del(v)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
