import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom animated preloader
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const step = () => {
      setProgress(p => {
        if (p >= 100) return 100;
        // Accelerate as it gets closer to done
        const inc = p < 60 ? Math.random() * 12 + 4 : Math.random() * 20 + 8;
        return Math.min(100, p + inc);
      });
    };
    const interval = setInterval(step, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setDone(true);
        setTimeout(() => onComplete?.(), 500);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          aria-label="Loading HQTech"
          role="status"
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
          >
            <div className="preloader-logo">
              HQ<span>Tech</span>
            </div>

            {/* Spinning ring */}
            <div style={{ margin: '28px auto 0', width: 48, height: 48, position: 'relative' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '2px solid rgba(168,85,247,0.15)',
                  borderTopColor: '#a855f7',
                  position: 'absolute',
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(137,106,189,0.2)',
                  borderBottomColor: '#896abd',
                  position: 'absolute',
                  top: 6, left: 6,
                }}
              />
            </div>

            {/* Progress bar */}
            <div className="preloader-bar-wrap" style={{ marginTop: 28 }}>
              <motion.div
                className="preloader-bar"
                style={{ width: `${progress}%`, transition: 'width 0.1s ease' }}
              />
            </div>

            <motion.p
              style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-2)', letterSpacing: '0.08em' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {progress < 100 ? 'Initializing...' : 'Ready'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
