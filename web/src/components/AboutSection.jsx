import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, ExternalLink, Users } from 'lucide-react';
import { BRAND_ICON_MAP } from './BrandIcons';

const ICON_MAP = BRAND_ICON_MAP;

const STATS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '4', label: 'Service Lines' },
  { value: '100%', label: 'On-time Delivery' },
  { value: '24h', label: 'Response Time' },
];

export default function AboutSection({ content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  const socialLinks = content?.social_links || [
    { platform: 'github', url: 'https://github.com', label: 'GitHub' },
    { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    { platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <section id="about" style={{ padding: '120px 0 60px', background: 'var(--bg)' }}>
      <div className="container" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <span className="tag">
            <Users size={12} />
            Who We Are
          </span>
          <h2>About HQTech</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left: about text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p style={{ fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text)', marginBottom: 32 }}>
              {content?.about_text || 'HQTech is a passionate freelance tech studio specializing in building digital products across web, mobile, desktop, and gaming platforms. With years of experience shipping production-ready software, we help founders, startups, and established teams bring their ideas to life.'}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="card"
                  style={{ padding: '20px 24px' }}
                >
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    background: 'linear-gradient(135deg, #896abd, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: social links */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card" style={{ padding: 36 }}>
              <h3 style={{ marginBottom: 8, fontSize: '1rem', color: 'var(--text-2)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Connect With Us
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                {socialLinks.map((link, i) => {
                  const Icon = ICON_MAP[link.platform?.toLowerCase()] || Globe;
                  return (
                    <motion.a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        transition: 'all 0.2s ease',
                        color: 'var(--text-heading)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--accent-bg)';
                        e.currentTarget.style.borderColor = 'var(--border-accent)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--accent-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={16} color="var(--accent)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                          {link.label || link.platform}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginTop: 1 }}>
                          {link.url?.replace(/^https?:\/\//, '').split('/')[0]}
                        </div>
                      </div>
                      <ExternalLink size={14} color="var(--text-2)" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 80, padding: '32px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-heading)' }}>
            HQ<span style={{ color: 'var(--accent)' }}>Tech</span>
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
            © {new Date().getFullYear()} HQTech. All rights reserved.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about .container > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
