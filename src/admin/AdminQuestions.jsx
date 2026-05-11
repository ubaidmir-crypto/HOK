import { useState, useEffect, Fragment } from 'react';
import { sb } from '../lib/supabase';
import { formatDateShort } from '../lib/format';
import StatusPill from '../components/ui/StatusPill';

export default function AdminQuestions() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const load = async () => {
    const { data } = await sb
      .from('hok_questions')
      .select('*')
      .order('created_at', { ascending: false });
    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (r) => {
    setEditing(r.id);
    setAnswer(r.answer || '');
    setIsPublic(r.is_public);
  };

  const saveAnswer = async (id) => {
    await sb
      .from('hok_questions')
      .update({
        answer,
        is_public: isPublic,
        status: 'answered',
        answered_at: new Date().toISOString(),
      })
      .eq('id', id);
    setEditing(null);
    setAnswer('');
    setIsPublic(false);
    load();
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>Question</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Fragment key={r.id}>
              <tr>
                <td style={{ fontSize: 12 }}>{formatDateShort(r.created_at)}</td>
                <td>
                  <strong>{r.full_name}</strong>
                  <br />
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {r.phone || r.email || '—'}
                  </span>
                </td>
                <td style={{ maxWidth: 400 }}>
                  <strong style={{ fontSize: 13 }}>{r.subject}</strong>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{r.question}</div>
                  {r.answer && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--emerald)',
                        marginTop: 8,
                        paddingLeft: 10,
                        borderLeft: '2px solid var(--saffron)',
                      }}
                    >
                      ↳ {r.answer}
                    </div>
                  )}
                </td>
                <td>
                  <StatusPill status={r.status} />
                  {r.is_public && (
                    <div style={{ fontSize: 10, marginTop: 4, color: 'var(--saffron)' }}>PUBLIC FAQ</div>
                  )}
                </td>
                <td>
                  {editing !== r.id && (
                    <button className="mini-btn" onClick={() => startEdit(r)}>
                      {r.answer ? 'Edit' : 'Answer'}
                    </button>
                  )}
                </td>
              </tr>
              {editing === r.id && (
                <tr>
                  <td colSpan={5} style={{ background: 'var(--ivory)' }}>
                    <textarea
                      style={{
                        width: '100%',
                        minHeight: 80,
                        padding: 10,
                        border: '1px solid var(--line)',
                        fontFamily: 'inherit',
                      }}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Write your answer..."
                    />
                    <label style={{ display: 'block', margin: '10px 0', fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />{' '}
                      Publish to public FAQ page
                    </label>
                    <button
                      className="mini-btn"
                      onClick={() => saveAnswer(r.id)}
                      style={{
                        background: 'var(--emerald)',
                        color: 'var(--ivory)',
                        borderColor: 'var(--emerald)',
                      }}
                    >
                      Save answer
                    </button>
                    <button className="mini-btn" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                No questions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}