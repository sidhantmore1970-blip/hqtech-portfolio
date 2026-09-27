const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'hqtech.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'code',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    billing_type TEXT NOT NULL DEFAULT 'one-time',
    features TEXT NOT NULL DEFAULT '[]',
    highlighted INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_title TEXT NOT NULL DEFAULT 'HQTech',
    hero_tagline TEXT NOT NULL DEFAULT 'We design and build web apps, mobile apps, desktop software, and mobile games for founders and teams who need to ship fast.',
    hero_cta_primary TEXT NOT NULL DEFAULT 'Get in Touch',
    hero_cta_secondary TEXT NOT NULL DEFAULT 'Our Services',
    about_text TEXT NOT NULL DEFAULT 'HQTech is a passionate freelance tech studio specializing in building digital products across web, mobile, desktop, and gaming platforms. With years of experience shipping production-ready software, we help founders, startups, and established teams bring their ideas to life.',
    contact_email TEXT NOT NULL DEFAULT 'hello@hqtech.dev',
    contact_phone TEXT NOT NULL DEFAULT '',
    contact_location TEXT NOT NULL DEFAULT '',
    social_links TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_read INTEGER NOT NULL DEFAULT 0
  );
`);

// Check if site_content has a row; insert default if not
const contentRow = db.prepare('SELECT id FROM site_content WHERE id = 1').get();
if (!contentRow) {
  db.prepare(`
    INSERT INTO site_content (id) VALUES (1)
  `).run();
}

// Seed default services if empty
const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
if (serviceCount.count === 0) {
  const insertService = db.prepare(`
    INSERT INTO services (name, description, icon, display_order, is_active)
    VALUES (@name, @description, @icon, @order, 1)
  `);
  const insertPlan = db.prepare(`
    INSERT INTO plans (service_id, name, price, currency, billing_type, features, highlighted)
    VALUES (@serviceId, @name, @price, @currency, @billingType, @features, @highlighted)
  `);

  const services = [
    {
      name: 'Web Development',
      description: 'Full-stack web applications built with modern frameworks. From landing pages to complex SaaS dashboards — pixel-perfect, performant, and scalable.',
      icon: 'globe',
      order: 1,
      plans: [
        { name: 'Starter', price: '15,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Landing page (up to 5 sections)', 'Responsive design', 'Contact form', 'Basic SEO', '2 rounds of revisions']), highlighted: 0 },
        { name: 'Standard', price: '40,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Multi-page website (up to 10 pages)', 'CMS integration', 'Custom animations', 'Analytics setup', 'SEO optimization', '3 rounds of revisions']), highlighted: 1 },
        { name: 'Premium', price: 'Custom', currency: '', billingType: 'quote', features: JSON.stringify(['Full-stack web application', 'Custom backend & database', 'Authentication & user management', 'API integrations', 'Dedicated support', 'Unlimited revisions']), highlighted: 0 },
      ]
    },
    {
      name: 'App Development',
      description: 'Cross-platform mobile apps for iOS and Android. Native feel, smooth performance, and a design that users love — built with React Native or Flutter.',
      icon: 'smartphone',
      order: 2,
      plans: [
        { name: 'Starter', price: '25,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Single-platform app (iOS or Android)', 'Up to 5 screens', 'Basic navigation', 'API integration', '2 rounds of revisions']), highlighted: 0 },
        { name: 'Standard', price: '60,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Cross-platform (iOS + Android)', 'Up to 15 screens', 'User authentication', 'Push notifications', 'App store submission', '3 rounds of revisions']), highlighted: 1 },
        { name: 'Premium', price: 'Custom', currency: '', billingType: 'quote', features: JSON.stringify(['Complex app with custom backend', 'Real-time features', 'Offline support', 'Advanced animations', 'Analytics & crash reporting', 'Dedicated support']), highlighted: 0 },
      ]
    },
    {
      name: 'Desktop App Development',
      description: 'Cross-platform desktop software for Windows, macOS, and Linux. Built with Electron or Tauri for a native feel with web technologies you know.',
      icon: 'monitor',
      order: 3,
      plans: [
        { name: 'Starter', price: '20,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Single-platform desktop app', 'Basic UI with up to 5 views', 'Local data storage', 'Auto-updater', '2 rounds of revisions']), highlighted: 0 },
        { name: 'Standard', price: '50,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Cross-platform (Win + Mac + Linux)', 'Up to 12 views', 'SQLite local database', 'System tray integration', 'Code signing', '3 rounds of revisions']), highlighted: 1 },
        { name: 'Premium', price: 'Custom', currency: '', billingType: 'quote', features: JSON.stringify(['Enterprise-grade desktop software', 'Custom native modules', 'Backend + cloud sync', 'License management', 'Priority support', 'Unlimited revisions']), highlighted: 0 },
      ]
    },
    {
      name: 'Mobile Game Development',
      description: '2D mobile games for iOS and Android. Casual games, hyper-casual titles, and interactive experiences — built with Unity or Godot.',
      icon: 'gamepad-2',
      order: 4,
      plans: [
        { name: 'Starter', price: '30,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Hyper-casual game (1-3 levels)', 'Basic game mechanics', 'Sound effects & music', 'AdMob integration', '2 rounds of revisions']), highlighted: 0 },
        { name: 'Standard', price: '80,000', currency: 'INR', billingType: 'one-time', features: JSON.stringify(['Casual game (10+ levels)', 'Custom art & animations', 'Leaderboard & achievements', 'In-app purchases', 'Store submission', '3 rounds of revisions']), highlighted: 1 },
        { name: 'Premium', price: 'Custom', currency: '', billingType: 'quote', features: JSON.stringify(['Full game with story mode', 'Multiplayer support', 'Custom shaders & effects', 'Analytics & monetization', 'Live ops support', 'Dedicated team']), highlighted: 0 },
      ]
    },
  ];

  const seedAll = db.transaction(() => {
    for (const svc of services) {
      const result = insertService.run({
        name: svc.name,
        description: svc.description,
        icon: svc.icon,
        order: svc.order,
      });
      for (const plan of svc.plans) {
        insertPlan.run({
          serviceId: result.lastInsertRowid,
          name: plan.name,
          price: plan.price,
          currency: plan.currency,
          billingType: plan.billingType,
          features: plan.features,
          highlighted: plan.highlighted,
        });
      }
    }
  });

  seedAll();
  console.log('✅ Database seeded with default services and plans');
}

module.exports = db;
