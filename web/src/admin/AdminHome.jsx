import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader, Check } from 'lucide-react';
import { api } from '../api';

export default function AdminHome() {
  const [form, setForm] = useState({
    hero_title: '',
    hero_tagline: '',
    hero_cta_primary: '',
    hero_cta_secondary: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then(data => {
      setForm({
        hero_title: data.hero_title || '',
        hero_tagline: data.hero_tagline || '',
        hero_cta_primary: data.hero_cta_primary || '',
        hero_cta_secondary: data.hero_cta_secondary || '',
      });
      setLoading(false);
    });
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const full = await api.getContent();
      await api.updateContent({ ...full, ...form, social_links: full.social_links || [] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-heading)',
    fontSize: '0.9rem', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const Field = ({ label, id, children }) => (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );

  if (loading) return <div style={{ color: 'var(--text-2)', padding: '60px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Home / Hero Content</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Edit the hero section that visitors see first.</p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <Field label="Brand Name" id="hero-title-input">
          <input id="hero-title-input" style={inp} value={form.hero_title} onChange={set('hero_title')} placeholder="HQTech"
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </Field>

        <Field label="Tagline / About blurb" id="hero-tagline-input">
          <textarea id="hero-tagline-input" style={{ ...inp, resize: 'vertical', minHeight: 100 }}
            value={form.hero_tagline} onChange={set('hero_tagline')}
            placeholder="We design and build..."
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Primary CTA Label" id="hero-cta1-input">
            <input id="hero-cta1-input" style={inp} value={form.hero_cta_primary} onChange={set('hero_cta_primary')} placeholder="Get in Touch"
              onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
          <Field label="Secondary CTA Label" id="hero-cta2-input">
            <input id="hero-cta2-input" style={inp} value={form.hero_cta_secondary} onChange={set('hero_cta_secondary')} placeholder="Our Services"
              onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
        </div>

        <motion.button
          onClick={handleSave}
          className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
          disabled={saving}
          style={{ marginTop: 8, padding: '12px 24px' }}
          whileTap={{ scale: 0.97 }}
        >
          {saving ? <Loader size={16} /> : saved ? <Check size={16} color="var(--success)" /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  );
}
