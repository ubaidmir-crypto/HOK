import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { formatDate } from '../lib/format';
import ImageUpload from '../components/ui/ImageUpload';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  hero_image_url: '',
  author: 'Hair of Kashmir',
  is_published: true,
};

export default function AdminBlog({ notify }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | postId
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await sb
      .from('hok_blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm(EMPTY);
    setEditing('new');
  };

  const startEdit = (p) => {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      body: p.body,
      hero_image_url: p.hero_image_url || '',
      author: p.author || 'Hair of Kashmir',
      is_published: p.is_published,
    });
    setEditing(p.id);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  // Auto-generate slug from title (only when creating new)
  const set = (k) => (e) => {
    const value = e.target.value;
    if (k === 'title' && editing === 'new' && !form.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 60);
      setForm({ ...form, title: value, slug: autoSlug });
    } else {
      setForm({ ...form, [k]: value });
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.body.trim()) {
      notify('Title, slug, and body are all required', 'err');
      return;
    }
    setSaving(true);

    if (editing === 'new') {
      const { error } = await sb.from('hok_blog_posts').insert(form);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Post created', 'ok');
    } else {
      const { error } = await sb.from('hok_blog_posts').update(form).eq('id', editing);
      setSaving(false);
      if (error) return notify('Save failed: ' + error.message, 'err');
      notify('Post updated', 'ok');
    }

    cancel();
    load();
  };

  const del = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await sb.from('hok_blog_posts').delete().eq('id', p.id);
    if (error) return notify('Delete failed: ' + error.message, 'err');
    notify('Post deleted', 'ok');
    load();
  };

  const togglePublished = async (p) => {
    const { error } = await sb
      .from('hok_blog_posts')
      .update({ is_published: !p.is_published })
      .eq('id', p.id);
    if (error) return notify('Update failed: ' + error.message, 'err');
    load();
  };

  // === EDIT / NEW form ===
  if (editing) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 className="serif" style={{ fontSize: 28 }}>
            {editing === 'new' ? 'New post' : 'Edit post'}
          </h2>
          <button className="mini-btn" onClick={cancel}>
            ← Back
          </button>
        </div>

        <div className="panel">
          <ImageUpload
            value={form.hero_image_url}
            onChange={(url) => setForm({ ...form, hero_image_url: url })}
            label="Hero image (optional)"
            notify={notify}
          />

          <div className="field">
            <label>Title *</label>
            <input value={form.title} onChange={set('title')} placeholder="e.g. How PRP actually works" />
          </div>

          <div className="field">
            <label>Slug *</label>
            <input
              value={form.slug}
              onChange={set('slug')}
              placeholder="e.g. how-prp-actually-works"
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              URL-friendly identifier. Auto-generated from title.
            </div>
          </div>

          <div className="field">
            <label>Excerpt (short summary)</label>
            <textarea
              value={form.excerpt}
              onChange={set('excerpt')}
              placeholder="A 1-2 sentence teaser shown on the blog list page."
              style={{ minHeight: 60 }}
            />
          </div>

          <div className="field">
            <label>Body *</label>
            <textarea
              value={form.body}
              onChange={set('body')}
              placeholder="Write your full post here..."
              style={{ minHeight: 240 }}
            />
          </div>

          <div className="field">
            <label>Author</label>
            <input value={form.author} onChange={set('author')} />
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

          <button
            className="submit-btn"
            onClick={save}
            disabled={saving}
            style={{ marginTop: 16 }}
          >
            {saving ? 'Saving…' : editing === 'new' ? 'Create post' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  // === LIST view ===
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h2 className="serif" style={{ fontSize: 28 }}>
          Blog posts
        </h2>
        <button
          className="mini-btn"
          onClick={startNew}
          style={{
            background: 'var(--emerald)',
            color: 'var(--ivory)',
            borderColor: 'var(--emerald)',
            padding: '10px 16px',
            fontSize: 13,
          }}
        >
          + New post
        </button>
      </div>

      {posts.length === 0 ? (
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            padding: 40,
            textAlign: 'center',
            color: 'var(--muted)',
          }}
        >
          <p style={{ marginBottom: 16 }}>No blog posts yet.</p>
          <button className="mini-btn" onClick={startNew}>
            Write your first post
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {posts.map((p) => (
            <div
              key={p.id}
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
              {p.hero_image_url ? (
                <img
                  src={p.hero_image_url}
                  alt=""
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 60,
                    background: 'var(--ivory-2)',
                    borderRadius: 2,
                  }}
                />
              )}

              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 16, marginBottom: 4 }}>
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {formatDate(p.published_at)} · {p.is_published ? 'Published' : 'Draft'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="mini-btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="mini-btn" onClick={() => togglePublished(p)}>
                  {p.is_published ? 'Hide' : 'Publish'}
                </button>
                <button className="mini-btn danger" onClick={() => del(p)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
