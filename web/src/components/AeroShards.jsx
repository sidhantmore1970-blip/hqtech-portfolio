import { useEffect, useRef } from 'react';

// AeroShards — canvas-based animated background effect
// Purple/violet shards that flow and react to mouse movement
export default function AeroShards({ disabled = false }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let isVisible = true;
    const isLowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || window.innerWidth < 768;

    const CONFIG = {
      COUNT: isLowPower ? 25 : 55,
      SHARD_COLOR_1: [137, 106, 189], // #896ABD
      SHARD_COLOR_2: [168, 85, 247],  // #A855F7
      BG: '#120F17',
      REPEL_RADIUS: 120,
      REPEL_STRENGTH: 0.04,
    };

    let shards = [];
    let W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function randomBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function createShard() {
      const sides = Math.floor(randomBetween(3, 7));
      const size = randomBetween(8, 28);
      const t = Math.random();
      const color = CONFIG.SHARD_COLOR_1.map((c, i) =>
        Math.round(c + (CONFIG.SHARD_COLOR_2[i] - c) * t)
      );
      return {
        x: randomBetween(0, W),
        y: randomBetween(0, H),
        vx: randomBetween(-0.3, 0.3),
        vy: randomBetween(-0.5, -0.1),
        rotation: randomBetween(0, Math.PI * 2),
        rotSpeed: randomBetween(-0.008, 0.008),
        size,
        sides,
        alpha: randomBetween(0.15, 0.55),
        alphaSpeed: randomBetween(0.002, 0.006),
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color,
        // glow effect only on higher performance hardware
        glow: !isLowPower && Math.random() > 0.6,
      };
    }

    function drawShard(s) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);

      if (s.glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, 0.8)`;
      }

      ctx.beginPath();
      const angleStep = (Math.PI * 2) / s.sides;
      for (let i = 0; i < s.sides; i++) {
        const angle = i * angleStep;
        const r = s.size * (i % 2 === 0 ? 1 : 0.5 + Math.random() * 0.4);
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r * 2.2;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(-s.size, -s.size, s.size, s.size);
      grad.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.alpha * 0.4})`);
      grad.addColorStop(0.5, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.alpha})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha * 0.15})`);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    }

    function tick() {
      if (!isVisible || document.hidden) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.fillStyle = CONFIG.BG;
      ctx.fillRect(0, 0, W, H);

      const radGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
      radGrad.addColorStop(0, 'rgba(137, 106, 189, 0.04)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, W, H);

      shards.forEach(s => {
        const dx = s.x - mouseRef.current.x;
        const dy = s.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / CONFIG.REPEL_RADIUS) * CONFIG.REPEL_STRENGTH;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }

        s.vx *= 0.99;
        s.vy *= 0.99;
        s.vy -= 0.002;

        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        s.alpha += s.alphaSpeed * s.alphaDir;
        if (s.alpha > 0.65 || s.alpha < 0.05) s.alphaDir *= -1;

        if (s.y < -60) { s.y = H + 40; s.x = randomBetween(0, W); }
        if (s.x < -60) s.x = W + 40;
        if (s.x > W + 60) s.x = -40;

        drawShard(s);
      });

      animRef.current = requestAnimationFrame(tick);
    }

    resize();
    shards = Array.from({ length: CONFIG.COUNT }, createShard);
    tick();

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled]);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || disabled) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(137,106,189,0.15) 0%, #120F17 70%)',
      }} />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
}
