const inquiries = require('../services/inquiries.service');

function create(req, res) { res.status(201).json({ inquiry: inquiries.create(req.body) }); }
function list(_req, res) { res.json({ inquiries: inquiries.list() }); }
function update(req, res) {
  const id = Number(req.params.id);
  if (!inquiries.get(id)) return res.status(404).json({ error: 'Inquiry not found' });
  res.json({ inquiry: inquiries.update(id, req.body) });
}
function remove(req, res) {
  if (!inquiries.remove(Number(req.params.id))) return res.status(404).json({ error: 'Inquiry not found' });
  res.status(204).end();
}
function stats(_req, res) { res.json(inquiries.stats()); }

module.exports = { create, list, update, remove, stats };
