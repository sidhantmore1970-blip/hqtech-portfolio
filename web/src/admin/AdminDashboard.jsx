import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MessageSquare, TrendingUp, Star, Eye } from 'lucide-react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ services: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [services, messages] = await Promise.all([
          api.getAdminServices(),
          api.getMessages(),
        ]);
        setStats({
          services: services.length,
          messages: messages.length,
          unread: messages.filter(m => !m.is_read).length,
        });
        setRecentMessages(messages.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { icon: Package, label: 'Active Services', value: stats.services, color: 'var(--accent)', link: '/hqadmin/services' },
    { icon: MessageSquare, label: 'Total Messages', value: stats.messages, color: '#34d399', link: '/hqadmin/messages' },
    { icon: Star, label: 'Unread Messages', value: stats.unread, color: '#fb923c', link: '/hqadmin/messages' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Dashboard</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={card.link} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 24, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `${card.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color={card.color} />
                    </div>
                    <TrendingUp size={14} color="var(--text-2)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: card.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {loading ? '...' : card.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 6, fontWeight: 500 }}>
                    {card.label}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem' }}>Recent Messages</h3>
            <Link to="/hqadmin/messages" style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={14} /> View all
            </Link>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-2)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>Loading...</div>
          ) : recentMessages.length === 0 ? (
            <div style={{ color: 'var(--text-2)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
              No messages yet. Share your site to start receiving inquiries!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentMessages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                  background: msg.is_read ? 'transparent' : 'rgba(168,85,247,0.04)',
                  border: `1px solid ${msg.is_read ? 'transparent' : 'var(--border-accent)'}`,
                  marginBottom: 4,
                }}>
                  {!msg.is_read && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-heading)', display: 'flex', gap: 8, alignItems: 'center' }}>
                      {msg.name}
                      {msg.service && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent)', padding: '2px 8px', background: 'var(--accent-bg)', borderRadius: 50 }}>
                          {msg.service}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.message}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', flexShrink: 0 }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
