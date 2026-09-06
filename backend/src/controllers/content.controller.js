const { contentSchema } = require('../utils/validation');
const content = require('../services/content.service');

function list(req, res) { res.json({ items: content.list(req.query.collection || undefined) }); }
function get(req, res) {
  const item = content.get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Content item not found' });
  res.json({ item });
}
function create(req, res) { res.status(201).json({ item: content.create(contentSchema.parse(req.body)) }); }
function update(req, res) {
  const item = content.get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Content item not found' });
  res.json({ item: content.update(item.id, contentSchema.parse(req.body)) });
}
function remove(req, res) {
  if (!content.remove(Number(req.params.id))) return res.status(404).json({ error: 'Content item not found' });
  res.status(204).end();
}
function listSettings(_req, res) { res.json({ settings: content.settings() }); }
function getSetting(req, res) {
  const setting = content.setting(req.params.key);
  if (!setting) return res.status(404).json({ error: 'Setting not found' });
  res.json({ setting });
}
function saveSetting(req, res) {
  if (!/^[a-z0-9_-]+$/.test(req.params.key)) return res.status(400).json({ error: 'Invalid setting key' });
  res.json({ setting: content.saveSetting(req.params.key, req.body.value) });
}
function publicContent(_req, res) { res.json(content.publicContent()); }

module.exports = { list, get, create, update, remove, listSettings, getSetting, saveSetting, publicContent };
