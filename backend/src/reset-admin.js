const bcrypt = require('bcryptjs');
const db = require('./db');
const config = require('./config');

if (!config.adminEmail || !config.adminPassword) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
}

const hash = bcrypt.hashSync(config.adminPassword, 12);
const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(config.adminEmail);

if (existing) {
  db.prepare("UPDATE admin_users SET password_hash = ?, role = 'super_admin', is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(hash, existing.id);
} else {
  db.prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, 'super_admin')").run(config.adminEmail, hash);
}

console.log(`Admin credentials configured for ${config.adminEmail}`);
