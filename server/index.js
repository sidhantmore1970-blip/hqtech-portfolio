const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'hqtech-super-secret-jwt-key-change-in-production';
const ADMIN_PASSWORD = process.env.HQADMIN_PASSWORD || '123';

// ─── CORS: allow both local dev and your deployed frontend URL ────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,          // e.g. https://hqtech.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin "${origin}" not allowed`), false);
  },
  credentials: true,
}));
app.use(express.json());

// ─── Auth Middleware ─────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = auth.slice(7);
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── Public Routes ───────────────────────────────────────────────────────────

// GET /api/services — public
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare(`
      SELECT id, name, description, icon, display_order
      FROM services WHERE is_active = 1 ORDER BY display_order ASC
    `).all();

    const plansStmt = db.prepare(`
      SELECT id, name, price, currency, billing_type, features, highlighted
      FROM plans WHERE service_id = ?
    `);

    const result = services.map(svc => ({
      ...svc,
      plans: plansStmt.all(svc.id).map(p => ({
        ...p,
        features: JSON.parse(p.features || '[]'),
      })),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content — public
app.get('/api/content', (req, res) => {
  try {
    const content = db.prepare('SELECT * FROM site_content WHERE id = 1').get();
    if (content) {
      content.social_links = JSON.parse(content.social_links || '[]');
    }
    res.json(content || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/contact — public
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const result = db.prepare(`
      INSERT INTO messages (name, email, phone, service, message)
      VALUES (@name, @email, @phone, @service, @message)
    `).run({ name, email, phone: phone || null, service: service || null, message });
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin Auth ──────────────────────────────────────────────────────────────

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// POST /api/admin/verify
app.post('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

// ─── Admin: Services ─────────────────────────────────────────────────────────

// GET /api/admin/services
app.get('/api/admin/services', authMiddleware, (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
    const plansStmt = db.prepare('SELECT * FROM plans WHERE service_id = ?');
    const result = services.map(svc => ({
      ...svc,
      plans: plansStmt.all(svc.id).map(p => ({
        ...p,
        features: JSON.parse(p.features || '[]'),
      })),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/services
app.post('/api/admin/services', authMiddleware, (req, res) => {
  try {
    const { name, description, icon, display_order, is_active } = req.body;
    const result = db.prepare(`
      INSERT INTO services (name, description, icon, display_order, is_active)
      VALUES (@name, @description, @icon, @display_order, @is_active)
    `).run({ name, description, icon: icon || 'code', display_order: display_order || 0, is_active: is_active ?? 1 });
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/services/:id
app.put('/api/admin/services/:id', authMiddleware, (req, res) => {
  try {
    const { name, description, icon, display_order, is_active } = req.body;
    db.prepare(`
      UPDATE services SET name=@name, description=@description, icon=@icon,
      display_order=@display_order, is_active=@is_active WHERE id=@id
    `).run({ name, description, icon, display_order, is_active: is_active ?? 1, id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/services/:id
app.delete('/api/admin/services/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Plans ─────────────────────────────────────────────────────────────

// POST /api/admin/plans
app.post('/api/admin/plans', authMiddleware, (req, res) => {
  try {
    const { service_id, name, price, currency, billing_type, features, highlighted } = req.body;
    const result = db.prepare(`
      INSERT INTO plans (service_id, name, price, currency, billing_type, features, highlighted)
      VALUES (@service_id, @name, @price, @currency, @billing_type, @features, @highlighted)
    `).run({
      service_id, name, price, currency: currency || 'INR',
      billing_type: billing_type || 'one-time',
      features: JSON.stringify(features || []),
      highlighted: highlighted ? 1 : 0,
    });
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/plans/:id
app.put('/api/admin/plans/:id', authMiddleware, (req, res) => {
  try {
    const { name, price, currency, billing_type, features, highlighted } = req.body;
    db.prepare(`
      UPDATE plans SET name=@name, price=@price, currency=@currency,
      billing_type=@billing_type, features=@features, highlighted=@highlighted WHERE id=@id
    `).run({
      name, price, currency: currency || 'INR',
      billing_type: billing_type || 'one-time',
      features: JSON.stringify(features || []),
      highlighted: highlighted ? 1 : 0,
      id: req.params.id,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/plans/:id
app.delete('/api/admin/plans/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM plans WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Content ───────────────────────────────────────────────────────────

// PUT /api/admin/content
app.put('/api/admin/content', authMiddleware, (req, res) => {
  try {
    const {
      hero_title, hero_tagline, hero_cta_primary, hero_cta_secondary,
      about_text, contact_email, contact_phone, contact_location, social_links
    } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO site_content
      (id, hero_title, hero_tagline, hero_cta_primary, hero_cta_secondary,
       about_text, contact_email, contact_phone, contact_location, social_links)
      VALUES (1, @hero_title, @hero_tagline, @hero_cta_primary, @hero_cta_secondary,
              @about_text, @contact_email, @contact_phone, @contact_location, @social_links)
    `).run({
      hero_title, hero_tagline, hero_cta_primary, hero_cta_secondary,
      about_text, contact_email, contact_phone: contact_phone || '',
      contact_location: contact_location || '',
      social_links: JSON.stringify(social_links || []),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Messages ──────────────────────────────────────────────────────────

// GET /api/admin/messages
app.get('/api/admin/messages', authMiddleware, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/messages/:id/read
app.put('/api/admin/messages/:id/read', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/messages/:id
app.delete('/api/admin/messages/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 HQTech API running at http://localhost:${PORT}`);
});
