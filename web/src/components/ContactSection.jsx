import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Loader, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '../api';

const SERVICE_OPTIONS = [
  'Web Development',
  'App Development',
  'Desktop App Development',
  'Mobile Game Development',
  'Other / Not sure',
];

export default function ContactSection({ content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-heading)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    boxSizing: 'border-box',
  };

  return (
    <section id="contact" style={{ padding: '120px 0', background: 'var(--bg-2)' }}>
      <div className="container" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <span className="tag">
            <MessageSquare size={12} />
            Get In Touch
          </span>
          <h2>Let's Build Something</h2>
          <p>Tell us about your project and we'll get back to you within 24 hours.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, alignItems: 'flex-start' }}>
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>HQTech Studio</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7 }}>
                Ready to transform your idea into a product? Drop us a message and let's discuss how we can help.
              </p>
            </div>

            {[
              { icon: Mail, label: 'Email', value: content?.contact_email || 'hello@hqtech.dev', href: `mailto:${content?.contact_email || 'hello@hqtech.dev'}` },
              ...(content?.contact_phone ? [{ icon: Phone, label: 'Phone / WhatsApp', value: content.contact_phone, href: `tel:${content.contact_phone}` }] : []),
              ...(content?.contact_location ? [{ icon: MapPin, label: 'Location', value: content.contact_location, href: null }] : []),
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'var(--accent-bg)',
                  border: '1px solid var(--border-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 2 }}>{label}</div>
                  {href
                    ? <a href={href} style={{ color: 'var(--text-heading)', fontSize: '0.9rem', fontWeight: 500 }}>{value}</a>
                    : <span style={{ color: 'var(--text-heading)', fontSize: '0.9rem', fontWeight: 500 }}>{value}</span>
                  }
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card" style={{ padding: 36 }}>
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 20px' }}
                >
                  <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ marginBottom: 10, color: 'var(--success)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text)' }}>We've received your message and will get back to you within 24 hours.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn btn-secondary"
                    style={{ marginTop: 24 }}
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
                        Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        aria-required="true"
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={set('name')}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.background = 'rgba(168,85,247,0.04)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        aria-required="true"
                        autoComplete="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={set('email')}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.background = 'rgba(168,85,247,0.04)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label htmlFor="contact-phone" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
                        Phone (optional)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set('phone')}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-service" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
                        Service interested in
                      </label>
                      <select
                        id="contact-service"
                        value={form.service}
                        onChange={set('service')}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                      >
                        <option value="" style={{ background: '#0f0c1a' }}>Select a service</option>
                        {SERVICE_OPTIONS.map(s => (
                          <option key={s} value={s} style={{ background: '#0f0c1a' }}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      aria-required="true"
                      rows={5}
                      placeholder="Tell us about your project, timeline, and budget..."
                      value={form.message}
                      onChange={set('message')}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.background = 'rgba(168,85,247,0.04)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    />
                  </div>

                  {status === 'error' && (
                    <motion.div
                      role="alert"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                        background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
                        borderRadius: 'var(--radius-sm)', marginBottom: 16,
                        color: 'var(--error)', fontSize: '0.85rem',
                      }}
                    >
                      <AlertCircle size={16} />
                      {errorMsg}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    id="contact-submit"
                    disabled={status === 'loading'}
                    style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Loader size={16} />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact .container > div[style] {
            grid-template-columns: 1fr !important;
          }
          #contact-form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
