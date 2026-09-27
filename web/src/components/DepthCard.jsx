import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// DepthCard — 3D tilt card with layered depth effect
export default function DepthCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 30 });
  const sy = useSpring(y, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);

  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        ...style,
      }}
      className={`card ${className}`}
    >
      {/* Glare overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          zIndex: 10,
        }}
      />

      {/* Content — slightly raised in Z */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}
