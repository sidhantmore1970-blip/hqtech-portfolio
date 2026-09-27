import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Globe, Package, MessageSquare,
  Home, User, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import { api } from '../api';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/hqadmin/dashboard' },
  { icon: Package, label: 'Services', path: '/hqadmin/services' },
  { icon: Globe, label: 'Home / Hero', path: '/hqadmin/home' },
  { icon: User, label: 'About', path: '/hqadmin/about' },
  { icon: MessageSquare, label: 'Contact', path: '/hqadmin/contact' },
  { icon: MessageSquare, label: 'Messages', path: '/hqadmin/messages' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        await api.verify();
        setChecking(false);
      } catch {
        localStorage.removeItem('hqadmin_token');
        navigate('/hqadmin');
      }
    };
    check();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('hqadmin_token');
    navigate('/hqadmin');
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <div style={{ width: 40, height: 40, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      {/* Sidebar */}
      <motion.aside
        style={{
          width: 240,
          background: 'var(--bg-2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            HQ<span style={{ color: 'var(--accent)' }}>Admin</span>
          </Link>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Control Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 4,
                  color: active ? 'var(--text-heading)' : 'var(--text)',
                  background: active ? 'var(--accent-bg)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-accent)' : 'transparent'}`,
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; } }}
              >
                <Icon size={17} color={active ? 'var(--accent)' : 'currentColor'} />
                {item.label}
                {active && <ChevronRight size={14} color="var(--accent)" style={{ marginLeft: 'auto' }} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-2)', fontSize: '0.85rem',
            marginBottom: 4, textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-heading)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            <Globe size={16} /> View Site
          </Link>
          <button
            onClick={logout}
            id="admin-logout"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              width: '100%', background: 'none', border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'var(--text-2)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'rgba(10,8,18,0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="mobile-menu-btn-admin"
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'none' }}
          >
            <Menu size={22} />
          </button>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
            {NAV.find(n => n.path === location.pathname)?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent-bg)', border: '1px solid var(--border-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={14} color="var(--accent)" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-heading)', fontWeight: 500 }}>Admin</span>
          </div>
        </div>

        <div style={{ flex: 1, padding: 28 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            transition: transform 0.3s ease;
          }
          .admin-main { margin-left: 0 !important; }
          .mobile-menu-btn-admin { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
