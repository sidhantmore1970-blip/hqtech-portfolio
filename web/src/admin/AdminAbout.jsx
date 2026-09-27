import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader, Check, Plus, Trash2, Globe } from 'lucide-react';
import { api } from '../api';

const PLATFORMS = ['github', 'linkedin', 'instagram', 'twitter', 'x', 'youtube', 'whatsapp', 'behance', 'dribbble', 'website'];

export default function AdminAbout() {
  const [about_text, setAboutText] = useState('');
  const [social_links, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then(data => {
      setAboutText(data.about_text || '');
      setSocialLinks(data.social_links || []);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const full = await api.getContent();
      await api.updateContent({ ...full, about_text, social_links });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setSocialLinks(l => [...l, { platform: 'github', url: '', label: '' }]);
  const removeLink = (i) => setSocialLinks(l => l.filter((_, idx) => idx !== i));
  const updateLink = (i, key, val) => setSocialLinks(l => l.map((item, idx) => idx === i ? { ...item, [key]: val } : item));

  const inp = {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-heading)',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  };

  if (loading) return <div style={{ color: 'var(--text-2)', padding: '60px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>About Section</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Edit your about text and social media links.</p>
      </div>

      {/* About text */}
      <div className="card" style={{ padding: 32, marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}>About Copy</h3>
        <label htmlFor="about-text" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
          About HQTech paragraph(s)
        </label>
        <textarea
          id="about-text"
          style={{ ...inp, resize: 'vertical', minHeight: 140 }}
          value={about_text}
          onChange={e => setAboutText(e.target.value)}
          placeholder="Write about your studio, experience, specializations..."
          onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Social links */}
      <div className="card" style={{ padding: 32, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.95rem' }}>Social Media Links</h3>
          <button onClick={addLink} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <Plus size={14} /> Add Link
          </button>
        </div>

        <AnimatePresence>
          {social_links.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto',
                gap: 10, alignItems: 'center', marginBottom: 10,
                padding: 14, background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              }}
            >
              <select
                value={link.platform}
                onChange={e => updateLink(i, 'platform', e.target.value)}
                style={{ ...inp, cursor: 'pointer' }}
              >
                {PLATFORMS.map(p => <option key={p} value={p} style={{ background: '#0f0c1a' }}>{p}</option>)}
              </select>
              <input
                style={inp}
                value={link.label}
                onChange={e => updateLink(i, 'label', e.target.value)}
                placeholder="Display label"
              />
              <input
                style={inp}
                value={link.url}
                onChange={e => updateLink(i, 'url', e.target.value)}
                placeholder="https://..."
              />
              <button
                onClick={() => removeLink(i)}
                style={{ background: 'none', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', cursor: 'pointer', color: 'var(--error)', display: 'flex', alignItems: 'center' }}
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {social_links.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: '0.85rem', padding: '20px 0' }}>
            No social links yet. Add one above.
          </div>
        )}
      </div>

      <motion.button
        onClick={handleSave}
        className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
        disabled={saving}
        style={{ padding: '12px 24px' }}
        whileTap={{ scale: 0.97 }}
      >
        {saving ? <Loader size={16} /> : saved ? <Check size={16} color="var(--success)" /> : <Save size={16} />}
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
