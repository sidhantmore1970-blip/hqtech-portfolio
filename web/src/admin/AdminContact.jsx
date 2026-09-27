import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader, Check, Mail, Phone, MapPin } from 'lucide-react';
import { api } from '../api';

export default function AdminContact() {
  const [form, setForm] = useState({ contact_email: '', contact_phone: '', contact_location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then(data => {
      setForm({
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        contact_location: data.contact_location || '',
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

  if (loading) return <div style={{ color: 'var(--text-2)', padding: '60px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Contact Info</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Update your public contact details.</p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        {[
          { icon: Mail, label: 'Email Address *', id: 'admin-contact-email', key: 'contact_email', type: 'email', placeholder: 'hello@hqtech.dev' },
          { icon: Phone, label: 'Phone / WhatsApp (optional)', id: 'admin-contact-phone', key: 'contact_phone', type: 'tel', placeholder: '+91 98765 43210' },
          { icon: MapPin, label: 'Location (optional)', id: 'admin-contact-location', key: 'contact_location', type: 'text', placeholder: 'e.g. Mumbai, India' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: 20 }}>
            <label htmlFor={field.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
              <field.icon size={14} color="var(--accent)" />
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              style={inp}
              value={form[field.key]}
              onChange={set(field.key)}
              placeholder={field.placeholder}
              onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ))}

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
