const db = require('../db');

function parse(row) {
  return row ? { ...row, data: JSON.parse(row.data_json) } : null;
}

function list(collection) {
  const rows = collection
    ? db.prepare('SELECT * FROM content_items WHERE collection = ? ORDER BY position ASC, id ASC').all(collection)
    : db.prepare('SELECT * FROM content_items ORDER BY collection ASC, position ASC, id ASC').all();
  return rows.map(parse);
}

function get(id) {
  return parse(db.prepare('SELECT * FROM content_items WHERE id = ?').get(id));
}

function create(item) {
  const result = db.prepare(`INSERT INTO content_items (collection, slug, position, status, data_json) VALUES (?, ?, ?, ?, ?)`).run(item.collection, item.slug, item.position, item.status, JSON.stringify(item.data));
  return get(result.lastInsertRowid);
}

function update(id, item) {
  db.prepare(`UPDATE content_items SET collection = ?, slug = ?, position = ?, status = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(item.collection, item.slug, item.position, item.status, JSON.stringify(item.data), id);
  return get(id);
}

function remove(id) {
  return db.prepare('DELETE FROM content_items WHERE id = ?').run(id).changes > 0;
}

function settings() {
  return Object.fromEntries(db.prepare('SELECT key, value_json FROM settings ORDER BY key').all().map(row => [row.key, JSON.parse(row.value_json)]));
}

function setting(key) {
  const row = db.prepare('SELECT key, value_json FROM settings WHERE key = ?').get(key);
  return row ? { key: row.key, value: JSON.parse(row.value_json) } : null;
}

function saveSetting(key, value) {
  db.prepare(`INSERT INTO settings (key, value_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP`).run(key, JSON.stringify(value));
  return setting(key);
}

module.exports = { list, get, create, update, remove, settings, setting, saveSetting };
