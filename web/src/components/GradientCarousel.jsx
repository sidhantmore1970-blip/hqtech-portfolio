import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// GradientCarousel — auto-rotating highlight carousel
export default function GradientCarousel({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  const defaultItems = [
    { label: '50+', sub: 'Projects Shipped' },
    { label: '4', sub: 'Service Lines' },
    { label: '100%', sub: 'Client Satisfaction' },
    { label: '2x', sub: 'Faster Delivery' },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  const go = (dir) => {
    setDirection(dir);
    setCurrent(c => (c + dir + displayItems.length) % displayItems.length);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => go(1), 3000);
    return () => clearInterval(intervalRef.current);
  }, [displayItems.length]);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.95 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.95 }),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Carousel display */}
      <div style={{ position: 'relative', height: 90, width: 260, overflow: 'hidden' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              {displayItems[current].label}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: 6, fontWeight: 500, letterSpacing: '0.04em' }}>
              {displayItems[current].sub}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {displayItems.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            aria-label={`Go to item ${i + 1}`}
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              borderRadius: 3,
              border: 'none',
              background: i === current ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.3s ease',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
