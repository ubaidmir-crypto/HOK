import { useState, useEffect, useMemo } from 'react';
import { sb } from '../lib/supabase';
import { money, formatDate, trimSeconds } from '../lib/format';
import { CLINIC } from '../lib/constants';
import Icon from '../components/ui/Icon';

const EMPTY_FORM = {
  full_name: '',
  phone: '',
  email: '',
  treatment_id: '',
  appointment_date: '',
  appointment_time: '',
  notes: '',
};

export default function Booking({ preselect, notify }) {
  const [treatments, setTreatments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [booked, setBooked] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM, treatment_id: preselect?.id || '' });
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: t }, { data: a }, { data: b }] = await Promise.all([
        sb.from('hok_treatments').select('*').eq('is_active', true).order('sort_order'),
        sb.from('hok_availability').select('*').eq('is_active', true),
        sb.from('hok_blocked_dates').select('*'),
      ]);
      setTreatments(t || []);
      setAvailability(a || []);
      setBlocked(b || []);
    })();
  }, []);

  useEffect(() => {
    if (preselect) setForm((f) => ({ ...f, treatment_id: preselect.id }));
  }, [preselect]);

  useEffect(() => {
    if (!form.appointment_date) return setBooked([]);
    sb.from('hok_appointments')
      .select('appointment_time, status')
      .eq('appointment_date', form.appointment_date)
      .in('status', ['pending', 'confirmed'])
      .then(({ data }) =>
        setBooked((data || []).map((x) => trimSeconds(x.appointment_time)))
      );
  }, [form.appointment_date]);

  const slots = useMemo(() => {
    if (!form.appointment_date) return [];
    const dow = new Date(form.appointment_date + 'T00:00:00').getDay();
    const rule = availability.find((a) => a.day_of_week === dow);
    if (!rule) return [];
    const toMin = (s) => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m;
    };
    const fmt = (n) =>
      `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
    const out = [];
    for (
      let t = toMin(rule.start_time);
      t + rule.slot_duration_minutes <= toMin(rule.end_time);
      t += rule.slot_duration_minutes
    ) {
      out.push(fmt(t));
    }
    return out;
  }, [form.appointment_date, availability]);

  const isBlocked =
    form.appointment_date && blocked.some((b) => b.blocked_date === form.appointment_date);
  const minDate = new Date().toISOString().slice(0, 10);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (
      !form.full_name ||
      !form.phone ||
      !form.appointment_date ||
      !form.appointment_time ||
      !form.treatment_id
    ) {
      return notify('Please complete all required fields', 'err');
    }
    setSaving(true);
    const treatment = treatments.find((t) => t.id === form.treatment_id);
    const { data, error } = await sb
      .from('hok_appointments')
      .insert({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email || null,
        treatment_id: form.treatment_id,
        treatment_name: treatment?.name,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        notes: form.notes || null,
      })
      .select()
      .single();
    setSaving(false);

    if (error) return notify('Booking failed: ' + error.message, 'err');
    setConfirmed(data);
    notify('Appointment booked!', 'ok');
  };

  if (confirmed) return <ConfirmedView confirmed={confirmed} onBookAnother={() => { setConfirmed(null); setForm(EMPTY_FORM); }} />;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">Appointment</div>
            <h2 className="section-title">
              Book with <em>Dr. Waleed</em>
            </h2>
          </div>
          <p className="section-desc">
            Pick a treatment, a date, and a time. You'll get a call back shortly to confirm.
          </p>
        </div>

        <div className="booking-grid">
          <div className="panel">
            <div className="form-row">
              <div className="field">
                <label>Full name *</label>
                <input value={form.full_name} onChange={set('full_name')} />
              </div>
              <div className="field">
                <label>Phone *</label>
                <input type="tel" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className="field">
              <label>Email (optional)</label>
              <input type="email" value={form.email} onChange={set('email')} />
            </div>

            <div className="field">
              <label>Treatment *</label>
              <select value={form.treatment_id} onChange={set('treatment_id')}>
                <option value="">Select a treatment…</option>
                {treatments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {money(t.price_inr)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Date *</label>
                <input
                  type="date"
                  min={minDate}
                  value={form.appointment_date}
                  onChange={(e) =>
                    setForm({ ...form, appointment_date: e.target.value, appointment_time: '' })
                  }
                />
              </div>
            </div>

            {form.appointment_date && (
              <div className="field">
                <label>Time slot *</label>
                {isBlocked ? (
                  <p style={{ fontSize: 13, color: 'var(--rose)' }}>
                    This date is unavailable. Please pick another.
                  </p>
                ) : slots.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>Clinic closed this day.</p>
                ) : (
                  <div className="slot-grid">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={booked.includes(s)}
                        className={`slot ${form.appointment_time === s ? 'sel' : ''}`}
                        onClick={() => setForm({ ...form, appointment_time: s })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="field">
              <label>Notes</label>
              <textarea
                placeholder="Anything we should know..."
                value={form.notes}
                onChange={set('notes')}
              />
            </div>

            <button className="submit-btn" onClick={submit} disabled={saving}>
              {saving ? 'Booking…' : 'Confirm appointment'}
            </button>
          </div>

          <BookingAside />
        </div>
      </div>
    </section>
  );
}

function BookingAside() {
  return (
    <aside className="booking-aside">
      <h3>What to expect</h3>
      <div className="tidbit">
        <strong>01</strong>
        <div>We'll call you within business hours to confirm your slot and share pre-care instructions.</div>
      </div>
      <div className="tidbit">
        <strong>02</strong>
        <div>Consultation is included with every first visit — treatments are administered by qualified clinicians only.</div>
      </div>
      <div className="tidbit">
        <strong>03</strong>
        <div>
          Need to reschedule? Just call us at{' '}
          <strong style={{ color: 'var(--ivory)' }}>{CLINIC.phoneDisplay}</strong> — no charges.
        </div>
      </div>
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 28,
          borderTop: '1px solid rgba(246,241,232,.2)',
          fontSize: 12,
          color: 'rgba(246,241,232,.7)',
        }}
      >
        {CLINIC.address.line1}, {CLINIC.address.line2},
        <br />
        {CLINIC.address.line3} {CLINIC.address.line4.split(' ').pop()}
      </div>
    </aside>
  );
}

function ConfirmedView({ confirmed, onBookAnother }) {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="panel" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'var(--emerald)',
              color: 'var(--ivory)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Icon name="check" size={28} />
          </div>
          <h2 className="serif" style={{ fontSize: 36, marginBottom: 12 }}>
            Appointment confirmed
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We've received your request. Our team will call you shortly to confirm.
          </p>
          <div style={{ background: 'var(--ivory)', padding: 24, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Reference
            </div>
            <div className="serif" style={{ fontSize: 22, color: 'var(--emerald)', marginBottom: 14 }}>
              {confirmed.appointment_number}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              <strong>{confirmed.full_name}</strong>
              <br />
              {confirmed.treatment_name}
              <br />
              {formatDate(confirmed.appointment_date)} · {trimSeconds(confirmed.appointment_time)}
            </div>
          </div>
          <button className="btn-primary" onClick={onBookAnother}>
            Book another
          </button>
        </div>
      </div>
    </section>
  );
}