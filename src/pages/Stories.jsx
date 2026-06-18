import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';
import { formatDate } from '../lib/format';

const TABS = [
  ['blog', 'Blog'],
  ['gallery', 'Gallery'],
  ['videos', 'Videos'],
];

export default function Stories() {
  const [tab, setTab] = useState('blog');

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Notes from the clinic</div>
            <h2 className="section-title">
              Our <em>stories</em>
            </h2>
          </div>
          <p className="section-desc">
            Articles, real results, and a look behind the science of the treatments we offer.
          </p>
        </div>

        <div className="cat-tabs" style={{ marginBottom: 40 }}>
          {TABS.map(([key, label]) => (
            <button
              key={key}
              className={`cat-tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'blog' && <BlogList />}
        {tab === 'gallery' && <GalleryGrid />}
        {tab === 'videos' && <VideosGrid />}
      </div>
    </section>
  );
}

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    sb.from('hok_blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;
  if (posts.length === 0)
    return (
      <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
        No blog posts yet. Check back soon.
      </p>
    );

  // If a post is selected, show full post view
  if (active) {
    return (
      <div className="panel" style={{ maxWidth: 720, margin: '0 auto' }}>
        <button
          className="mini-btn"
          onClick={() => setActive(null)}
          style={{ marginBottom: 24 }}
        >
          ← Back to list
        </button>
        {active.hero_image_url && (
          <img
            src={active.hero_image_url}
            alt={active.title}
            style={{
              width: '100%',
              aspectRatio: '16/9',
              objectFit: 'cover',
              marginBottom: 24,
              borderRadius: 2,
            }}
          />
        )}
        <h1 className="serif" style={{ fontSize: 36, lineHeight: 1.1, marginBottom: 12 }}>
          {active.title}
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
          {formatDate(active.published_at)} · {active.author}
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{active.body}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 28,
      }}
    >
      {posts.map((p) => (
        <article
          key={p.id}
          onClick={() => setActive(p)}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            cursor: 'pointer',
            transition: '0.2s',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 24px 48px -24px rgba(15,61,46,.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {p.hero_image_url ? (
            <img
              src={p.hero_image_url}
              alt={p.title}
              style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                background: 'linear-gradient(160deg, var(--ivory-2), #D4C5A8)',
              }}
            />
          )}
          <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: 8,
              }}
            >
              {formatDate(p.published_at)}
            </div>
            <h3 className="serif" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 10 }}>
              {p.title}
            </h3>
            {p.excerpt && (
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, flex: 1 }}>
                {p.excerpt}
              </p>
            )}
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'var(--saffron)',
                marginTop: 16,
              }}
            >
              Read more →
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function GalleryGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.from('hok_gallery')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;
  if (items.length === 0)
    return (
      <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
        No before/after stories yet. Check back soon.
      </p>
    );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 28,
      }}
    >
      {items.map((g) => (
        <div
          key={g.id}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--line)' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={g.before_image_url}
                alt="Before"
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(26,24,20,.7)',
                  color: 'var(--ivory)',
                  fontSize: 10,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                }}
              >
                Before
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                src={g.after_image_url}
                alt="After"
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'var(--emerald)',
                  color: 'var(--ivory)',
                  fontSize: 10,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                }}
              >
                After
              </span>
            </div>
          </div>
          <div style={{ padding: 18 }}>
            {g.treatment_name && (
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: 'var(--saffron)',
                  marginBottom: 6,
                }}
              >
                {g.treatment_name}
              </div>
            )}
            {g.title && (
              <h3 className="serif" style={{ fontSize: 18, marginBottom: 8 }}>
                {g.title}
              </h3>
            )}
            {g.caption && (
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{g.caption}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function VideosGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.from('hok_videos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;
  if (items.length === 0)
    return (
      <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
        No videos yet. Check back soon.
      </p>
    );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 28,
      }}
    >
      {items.map((v) => {
        const embedUrl = toYouTubeEmbed(v.youtube_url);
        return (
          <div
            key={v.id}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={v.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'var(--ivory-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    fontSize: 13,
                  }}
                >
                  Invalid YouTube URL
                </div>
              )}
            </div>
            <div style={{ padding: 18 }}>
              <h3 className="serif" style={{ fontSize: 18, marginBottom: 8 }}>
                {v.title}
              </h3>
              {v.description && (
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{v.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Converts a YouTube URL of any common form into an embeddable URL
function toYouTubeEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // youtu.be/VIDEO_ID
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    // youtube.com/watch?v=VIDEO_ID
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      // youtube.com/embed/VIDEO_ID already
      if (u.pathname.startsWith('/embed/')) return url;
    }
    return null;
  } catch {
    return null;
  }
}
