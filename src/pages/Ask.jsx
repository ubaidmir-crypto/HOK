import { useState, useEffect } from 'react';
import { sb } from '../lib/supabase';

const EMPTY = { full_name: '', phone: '', email: '', subject: '', question: '' };

export default function Ask({ notify }) {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sb.from('hok_questions')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'answered')
      .order('created_at', { ascending: false })
      .then(({ data }) => setFaqs(data || []));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.full_name || !form.question) {
      return notify('Name and question are required', 'err');
    }
    setSaving(true);
    const { error } = await sb.from('hok_questions').insert(form);
    setSaving(false);
    if (error) return notify('Could not submit: ' + error.message, 'err');
    setForm(EMPTY);
    notify("Thanks — we'll get back to you soon.", 'ok');
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Ask us anything</div>
            <h2 className="section-title">
              Questions, <em>answered</em>
            </h2>
          </div>
          <p className="section-desc">
            Browse common questions below, or send us yours — Dr. Waleed's team will reply personally.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 48 }}>
          <FaqList faqs={faqs} open={open} setOpen={setOpen} />
          <QuestionForm form={form} set={set} saving={saving} onSubmit={submit} />
        </div>
      </div>
    </section>
  );
}

function FaqList({ faqs, open, setOpen }) {
  return (
    <div>
      <div className="faq-list">
        {faqs.map((f) => (
          <div key={f.id} className="faq-item">
            <button
              className={`faq-q ${open === f.id ? 'open' : ''}`}
              onClick={() => setOpen(open === f.id ? null : f.id)}
            >
              <span>{f.question}</span>
              <span className="faq-q-icon">+</span>
            </button>
            <div className={`faq-a ${open === f.id ? 'open' : ''}`}>{f.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionForm({ form, set, saving, onSubmit }) {
  return (
    <div className="panel">
      <h3 className="serif" style={{ fontSize: 24, marginBottom: 18 }}>Send a question</h3>
      <div className="form-row">
        <div className="field"><label>Name *</label><input value={form.full_name} onChange={set('full_name')} /></div>
        <div className="field"><label>Phone</label><input value={form.phone} onChange={set('phone')} /></div>
      </div>
      <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} /></div>
      <div className="field"><label>Subject</label><input value={form.subject} onChange={set('subject')} /></div>
      <div className="field"><label>Your question *</label><textarea value={form.question} onChange={set('question')} /></div>
      <button className="submit-btn" onClick={onSubmit} disabled={saving}>
        {saving ? 'Sending…' : 'Send question'}
      </button>
    </div>
  );
}