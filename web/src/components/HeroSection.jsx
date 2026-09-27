import { motion } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';
import AeroShards from './AeroShards';
import GradientCarousel from './GradientCarousel';

export default function HeroSection({ content }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 'var(--header-h)',
      }}
    >
      {/* AeroShards background */}
      <AeroShards />

      {/* Content layer */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 80,
          paddingBottom: 100,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 60,
          alignItems: 'center',
        }}
      >
        {/* Left: Main content */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="tag">
              <Zap size={12} />
              Freelance Tech Studio
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ marginTop: 24, marginBottom: 0 }}
          >
            {content?.hero_title || 'HQTech'}
          </motion.h1>

          {/* Gradient underline text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginTop: 4,
              marginBottom: 28,
              background: 'linear-gradient(135deg, #896abd, #a855f7, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
            }}
          >
            Build. Launch. Scale.
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{
              fontSize: '1.15rem',
              color: 'var(--text)',
              maxWidth: 520,
              lineHeight: 1.75,
              marginBottom: 44,
            }}
          >
            {content?.hero_tagline || 'We design and build web apps, mobile apps, desktop software, and mobile games for founders and teams who need to ship fast.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <button
              onClick={() => scrollTo('contact')}
              className="btn btn-primary"
              id="hero-cta-primary"
            >
              {content?.hero_cta_primary || 'Get in Touch'}
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="btn btn-secondary"
              id="hero-cta-secondary"
            >
              {content?.hero_cta_secondary || 'Our Services'}
              <ArrowDown size={16} />
            </button>
          </motion.div>
        </div>

        {/* Right: Carousel stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
          className="hero-carousel-wrap"
        >
          {/* Glowing container */}
          <div style={{
            padding: '32px 40px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px rgba(168,85,247,0.1)',
          }}>
            <GradientCarousel />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: '0.7rem', color: 'var(--text-2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} color="var(--text-2)" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        background: 'linear-gradient(to bottom, transparent, var(--bg))',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <style>{`
        @media (max-width: 768px) {
          #home .container {
            grid-template-columns: 1fr !important;
          }
          .hero-carousel-wrap {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
