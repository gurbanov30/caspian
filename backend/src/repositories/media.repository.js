const db = require('../db');

function list() { return db.prepare('SELECT * FROM media ORDER BY created_at DESC, id DESC').all(); }
function get(id) { return db.prepare('SELECT * FROM media WHERE id = ?').get(id); }
function create(item) {
  const result = db.prepare('INSERT INTO media (filename, original_name, mime_type, size_bytes, alt_text) VALUES (?, ?, ?, ?, ?)').run(item.filename, item.originalName, item.mimeType, item.size, item.altText || '');
  return get(result.lastInsertRowid);
}
function update(id, item) {
  db.prepare('UPDATE media SET filename = ?, original_name = ?, mime_type = ?, size_bytes = ?, alt_text = ? WHERE id = ?').run(item.filename, item.originalName, item.mimeType, item.size, item.altText || '', id);
  return get(id);
}
function remove(id) { return db.prepare('DELETE FROM media WHERE id = ?').run(id).changes > 0; }

module.exports = { list, get, create, update, remove };
