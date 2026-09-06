const fs = require('node:fs');
const path = require('node:path');
const repository = require('../repositories/media.repository');
const config = require('../config');

function isReferenced(filename) {
  const db = require('../db');
  const settings = db.prepare('SELECT value_json FROM settings').all();
  const items = db.prepare('SELECT data_json FROM content_items').all();
  return [...settings, ...items].some(row => row.value_json?.includes(filename) || row.data_json?.includes(filename));
}

function remove(id) {
  const media = repository.get(id);
  if (!media) return { found: false };
  if (isReferenced(media.filename)) return { found: true, referenced: true };
  const removed = repository.remove(id);
  if (removed) {
    const filePath = path.join(config.mediaDirectory, media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  return { found: true, removed };
}

function replace(id, file, altText) {
  const current = repository.get(id);
  if (!current) return { found: false };
  const db = require('../db');
  const transaction = db.transaction(() => {
    db.prepare('UPDATE settings SET value_json = replace(value_json, ?, ?)').run(current.filename, file.filename);
    db.prepare('UPDATE content_items SET data_json = replace(data_json, ?, ?)').run(current.filename, file.filename);
    return repository.update(id, { filename: file.filename, originalName: file.originalname, mimeType: file.mimetype, size: file.size, altText });
  });
  const updated = transaction();
  const oldPath = path.join(config.mediaDirectory, current.filename);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  return { found: true, media: updated };
}

module.exports = { ...repository, remove, replace, isReferenced };
