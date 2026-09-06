const db = require('../db');

const publicColumns = 'id, email, role, is_active, created_at, updated_at';

function normalize(user) {
  return user ? { ...user, is_active: Boolean(user.is_active) } : null;
}

function list() {
  return db.prepare(`SELECT ${publicColumns} FROM admin_users ORDER BY created_at ASC, id ASC`).all().map(normalize);
}

function get(id) {
  return normalize(db.prepare(`SELECT ${publicColumns} FROM admin_users WHERE id = ?`).get(id));
}

function getWithPassword(id) {
  return db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
}

function findByEmail(email) {
  return normalize(db.prepare(`SELECT ${publicColumns} FROM admin_users WHERE email = ?`).get(email));
}

function create({ email, passwordHash, role }) {
  const result = db.prepare('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)').run(email, passwordHash, role);
  return get(result.lastInsertRowid);
}

function update(id, { role, isActive }) {
  db.prepare('UPDATE admin_users SET role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, Number(isActive), id);
  return get(id);
}

function updatePassword(id, passwordHash) {
  db.prepare('UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, id);
  return get(id);
}

function remove(id) {
  return db.prepare('DELETE FROM admin_users WHERE id = ?').run(id).changes > 0;
}

function activeSuperAdminCount() {
  return db.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role = 'super_admin' AND is_active = 1").get().count;
}

module.exports = { list, get, getWithPassword, findByEmail, create, update, updatePassword, remove, activeSuperAdminCount };
