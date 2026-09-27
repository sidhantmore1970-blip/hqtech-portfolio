import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Preloader from './components/Preloader';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import AboutSection from './components/AboutSection';

// Lazy-loaded Admin pages (reduces public bundle size)
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminServices = lazy(() => import('./admin/AdminServices'));
const AdminHome = lazy(() => import('./admin/AdminHome'));
const AdminAbout = lazy(() => import('./admin/AdminAbout'));
const AdminContact = lazy(() => import('./admin/AdminContact'));
const AdminMessages = lazy(() => import('./admin/AdminMessages'));

// API
import { api } from './api';

// Admin Fallback Loading
function AdminFallback() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
      Loading HQAdmin...
    </div>
  );
}

// ─── Public Site ──────────────────────────────────────────────────────────────
function PublicSite() {
  const [ready, setReady] = useState(false);
  const [services, setServices] = useState([]);
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Load data from API
    Promise.all([
      api.getServices().catch(() => []),
      api.getContent().catch(() => ({})),
    ]).then(([s, c]) => {
      setServices(s);
      setContent(c);
    });
  }, []);

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      <div style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
          <HeroSection content={content} />
          <div className="gradient-line" aria-hidden="true" />
          <ServicesSection services={services} />
          <div className="gradient-line" aria-hidden="true" />
          <ContactSection content={content} />
          <div className="gradient-line" aria-hidden="true" />
          <AboutSection content={content} />
        </main>
        {/* Noise overlay for depth */}
        <div className="noise" aria-hidden="true" />
      </div>
    </>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<PublicSite />} />

          {/* Admin login */}
          <Route path="/hqadmin" element={<AdminLogin />} />

          {/* Admin dashboard (protected by AdminLayout) */}
          <Route path="/hqadmin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
