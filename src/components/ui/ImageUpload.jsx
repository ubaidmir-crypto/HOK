import { useState, useRef } from 'react';
import { sb } from '../../lib/supabase';

const BUCKET = 'hok-media';

export default function ImageUpload({ value, onChange, label = 'Image', notify }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify?.('Please choose an image file', 'err');
      return;
    }

    setUploading(true);

    // Build a unique filename: timestamp + original name (cleaned)
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${cleanName}`;

    const { error } = await sb.storage
      .from(BUCKET)
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (error) {
      setUploading(false);
      notify?.('Upload failed: ' + error.message, 'err');
      return;
    }

    // Get the public URL
    const { data } = sb.storage.from(BUCKET).getPublicUrl(filename);
    setUploading(false);
    onChange(data.publicUrl);
    notify?.('Image uploaded', 'ok');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files[0]);
  };

  return (
    <div className="field">
      <label>{label}</label>

      {value ? (
        <div style={{ position: 'relative', maxWidth: 320 }}>
          <img
            src={value}
            alt="Preview"
            style={{
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
              border: '1px solid var(--line)',
              borderRadius: 2,
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(26,24,20,.8)',
              color: 'var(--ivory)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontSize: 16,
            }}
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--emerald)' : 'var(--line)'}`,
            background: dragOver ? 'var(--ivory-2)' : 'var(--ivory)',
            padding: '32px 20px',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            transition: '0.15s',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              fontSize: 32,
              marginBottom: 8,
              color: 'var(--muted)',
              lineHeight: 1,
            }}
          >
            {uploading ? '⏳' : '📸'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
            {uploading ? 'Uploading…' : 'Tap to choose an image'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {uploading ? '' : 'or drag & drop from your files'}
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => upload(e.target.files?.[0])}
      />
    </div>
  );
}
