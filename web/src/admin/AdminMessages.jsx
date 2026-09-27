import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Eye, Trash2, Loader, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { api } from '../api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.markMessageRead(id);
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, is_read: 1 } : msg));
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await api.deleteMessage(id);
    setMessages(m => m.filter(msg => msg.id !== id));
  };

  const toggleExpand = (id) => {
    setExpanded(e => e === id ? null : id);
    // Auto-mark read when opened
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.is_read) markRead(id);
  };

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h2 style={{ fontSize: '1.4rem' }}>Messages</h2>
          {unread > 0 && (
            <span style={{
              padding: '2px 10px', background: 'var(--accent-bg)', color: 'var(--accent)',
              borderRadius: 50, fontSize: '0.78rem', fontWeight: 700,
              border: '1px solid var(--border-accent)',
            }}>
              {unread} unread
            </span>
          )}
        </div>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Contact form submissions from your visitors.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)' }}>Loading...</div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <MessageSquare size={40} color="var(--text-2)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>No messages yet.</p>
          <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginTop: 8 }}>Share your site to start receiving inquiries.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              layout
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderColor: msg.is_read ? 'var(--border)' : 'var(--border-accent)',
                background: msg.is_read ? 'var(--bg-card)' : 'rgba(168,85,247,0.04)',
              }}
            >
              {/* Header row */}
              <div
                onClick={() => toggleExpand(msg.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  cursor: 'pointer', flexWrap: 'wrap',
                }}
              >
                {/* Unread dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: msg.is_read ? 'var(--border)' : 'var(--accent)',
                  boxShadow: msg.is_read ? 'none' : '0 0 8px rgba(168,85,247,0.6)',
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{msg.email}</span>
                    {msg.service && (
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: 50,
                        background: 'var(--accent-bg)', color: 'var(--accent)',
                        border: '1px solid var(--border-accent)',
                      }}>
                        {msg.service}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>
                    {msg.message}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
                    {new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMsg(msg.id); }}
                    style={{ background: 'none', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--error)', display: 'flex', alignItems: 'center' }}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                  {expanded === msg.id ? <ChevronUp size={16} color="var(--text-2)" /> : <ChevronDown size={16} color="var(--text-2)" />}
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {msg.phone && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                            <span style={{ color: 'var(--text-2)', fontSize: '0.75rem', fontWeight: 500 }}>Phone: </span>
                            {msg.phone}
                          </div>
                        )}
                        <div style={{
                          padding: 16, background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {msg.message}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <a
                            href={`mailto:${msg.email}?subject=Re: Your inquiry at HQTech`}
                            className="btn btn-primary"
                            style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                          >
                            <Mail size={14} /> Reply via Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
