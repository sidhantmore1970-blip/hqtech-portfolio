import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader, AlertCircle, Zap } from 'lucide-react';
import { api } from '../api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const { token } = await api.login(password);
      localStorage.setItem('hqadmin_token', token);
      navigate('/hqadmin/dashboard');
    } catch (err) {
      setStatus('error');
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative' }}
      >
        <div className="card" style={{ padding: 44 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--accent-bg)',
              border: '1px solid var(--border-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Lock size={24} color="var(--accent)" />
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 8, letterSpacing: '-0.03em' }}>
              HQ<span style={{ color: 'var(--accent)' }}>Admin</span>
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Enter password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} id="admin-login-form">
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 52px 14px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${status === 'error' ? 'var(--error)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-heading)',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 4,
                  }}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 20,
                  color: 'var(--error)', fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              id="admin-login-submit"
              className="btn btn-primary"
              disabled={status === 'loading' || !password}
              style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' || !password ? 0.6 : 1 }}
            >
              {status === 'loading' ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader size={16} />
                  </motion.div>
                  Verifying...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/" style={{ fontSize: '0.8rem', color: 'var(--text-2)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
            >
              ← Back to site
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
