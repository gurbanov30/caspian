const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const db = require('../db');

async function authenticate(email, password) {
  const user = db.prepare('SELECT id, email, password_hash, role, is_active FROM admin_users WHERE email = ?').get(email);
  if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { id: user.id, email: user.email, role: user.role };
}

function makeCsrfToken() { return crypto.randomBytes(32).toString('hex'); }

async function changePassword(userId, currentPassword, nextPassword) {
  const user = db.prepare('SELECT password_hash FROM admin_users WHERE id = ?').get(userId);
  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) return false;
  const hash = await bcrypt.hash(nextPassword, 12);
  db.prepare('UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, userId);
  return true;
}

module.exports = { authenticate, makeCsrfToken, changePassword };
