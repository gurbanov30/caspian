const db = require('../db');

function list() {
  return db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC, id DESC').all();
}

function get(id) {
  return db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
}

function create(item) {
  const result = db.prepare(`INSERT INTO inquiries (name, phone, service, location, message) VALUES (?, ?, ?, ?, ?)`).run(item.name, item.phone, item.service, item.location, item.message);
  return get(result.lastInsertRowid);
}

function update(id, item) {
  db.prepare(`UPDATE inquiries SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(item.status ?? null, item.notes ?? null, id);
  return get(id);
}

function remove(id) {
  return db.prepare('DELETE FROM inquiries WHERE id = ?').run(id).changes > 0;
}

function stats() {
  const total = db.prepare('SELECT COUNT(*) AS count FROM inquiries').get().count;
  const unread = db.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'new'").get().count;
  return { total, unread };
}

module.exports = { list, get, create, update, remove, stats };
