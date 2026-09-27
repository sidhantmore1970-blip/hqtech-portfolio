import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      // Scrollspy
      const sections = ['home', 'services', 'about', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY + 100 >= el.offsetTop) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 'var(--header-h)',
        transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        background: scrolled ? 'rgba(10, 8, 18, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      }}
    >
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-heading)',
            letterSpacing: '-0.03em',
          }}
        >
          HQ<span style={{ color: 'var(--accent)' }}>Tech</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" style={{ display: 'flex', gap: 4 }} className="desktop-nav">
          {NAV_LINKS.map(link => {
            const isCurrent = active === link.href.replace('#', '');
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="btn btn-ghost"
                aria-current={isCurrent ? 'page' : undefined}
                style={{
                  fontSize: '0.9rem',
                  color: isCurrent ? 'var(--text-heading)' : 'var(--text)',
                  fontWeight: isCurrent ? 600 : 400,
                  position: 'relative',
                }}
              >
                {link.label}
                {isCurrent && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA */}
        <button
          onClick={() => scrollTo('#contact')}
          className="btn btn-primary desktop-nav"
          style={{ padding: '10px 22px', fontSize: '0.875rem' }}
        >
          Get in Touch
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="btn btn-ghost mobile-menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{ padding: 10 }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(10,8,18,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px 24px',
            }}
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: active === link.href.replace('#', '') ? 600 : 400,
                  color: active === link.href.replace('#', '') ? 'var(--accent)' : 'var(--text-heading)',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#contact')}
              className="btn btn-primary"
              style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}
            >
              Get in Touch
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
