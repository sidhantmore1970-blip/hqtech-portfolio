import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Smartphone, Monitor, Gamepad2, Check, ChevronDown, Star, Sparkles } from 'lucide-react';
import DepthCard from './DepthCard';

const ICON_MAP = {
  globe: Globe,
  smartphone: Smartphone,
  monitor: Monitor,
  'gamepad-2': Gamepad2,
  code: Globe,
};

function PricingPanel({ plans, isOpen, serviceId }) {
  const formatPrice = (plan) => {
    if (plan.billing_type === 'quote' || plan.price === 'Custom') return 'Let\'s talk';
    const symbol = plan.currency === 'INR' ? '₹' : '$';
    return `Starting from ${symbol}${plan.price}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * plans.indexOf(plan) }}
                style={{
                  padding: '16px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: plan.highlighted
                    ? '1px solid var(--border-accent)'
                    : '1px solid var(--border)',
                  background: plan.highlighted
                    ? 'rgba(168,85,247,0.08)'
                    : 'rgba(255,255,255,0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {plan.highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                  }}>
                    <Star size={9} fill="currentColor" />
                    POPULAR
                  </div>
                )}

                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>
                  {plan.name}
                </div>

                <div style={{
                  fontSize: plan.billing_type === 'quote' ? '0.8rem' : '0.85rem',
                  fontWeight: 700,
                  color: plan.billing_type === 'quote' ? 'var(--accent)' : 'var(--text-heading)',
                  marginBottom: 10,
                  fontFamily: 'var(--font-heading)',
                }}>
                  {formatPrice(plan)}
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {(plan.features || []).slice(0, 4).map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.72rem', color: 'var(--text)' }}>
                      <Check size={10} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                  {(plan.features || []).length > 4 && (
                    <li style={{ fontSize: '0.7rem', color: 'var(--text-2)' }}>
                      +{plan.features.length - 4} more
                    </li>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ServiceCard({ service, index, isActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [pricingOpen, setPricingOpen] = useState(false);

  const Icon = ICON_MAP[service.icon] || Globe;
  const colors = [
    { bg: 'rgba(168,85,247,0.06)', accent: '#a855f7' },
    { bg: 'rgba(59,130,246,0.06)', accent: '#3b82f6' },
    { bg: 'rgba(52,211,153,0.06)', accent: '#34d39a' },
    { bg: 'rgba(251,146,60,0.06)', accent: '#fb923c' },
  ];
  const color = colors[index % colors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <DepthCard style={{ padding: 36, marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: color.bg,
            border: `1px solid ${color.accent}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={28} color={color.accent} strokeWidth={1.5} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{service.name}</h3>
              <span style={{
                padding: '3px 10px',
                borderRadius: 50,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: color.accent,
                background: color.bg,
                border: `1px solid ${color.accent}33`,
                letterSpacing: '0.05em',
              }}>
                #{String(service.display_order || index + 1).padStart(2, '0')}
              </span>
            </div>
            <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 540 }}>
              {service.description}
            </p>
          </div>

          {/* Pricing toggle */}
          <button
            onClick={() => setPricingOpen(o => !o)}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.82rem', flexShrink: 0 }}
            aria-expanded={pricingOpen}
            aria-controls={`pricing-panel-${service.id}`}
          >
            <Sparkles size={14} color="var(--accent)" />
            {pricingOpen ? 'Hide pricing' : 'See pricing'}
            <motion.span animate={{ rotate: pricingOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.span>
          </button>
        </div>

        {/* Pricing panel */}
        {service.plans && service.plans.length > 0 && (
          <div id={`pricing-panel-${service.id}`}>
            <PricingPanel plans={service.plans} isOpen={pricingOpen} serviceId={service.id} />
          </div>
        )}
      </DepthCard>
    </motion.div>
  );
}

export default function ServicesSection({ services }) {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-5% 0px' });

  return (
    <section id="services" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <span className="tag">
            <Sparkles size={12} />
            What We Build
          </span>
          <h2>Services & Pricing</h2>
          <p>From idea to production — we cover all the tech you need to ship your product.</p>
        </motion.div>

        {/* Service cards — staggered scroll reveal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {(services || []).map((service, i) => (
            <ServiceCard key={service.id || i} service={service} index={i} />
          ))}
          {(!services || services.length === 0) && (
            <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: '60px 0' }}>
              Loading services...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
