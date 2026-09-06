const fs = require('node:fs');
const media = require('../services/media.service');

function list(_req, res) { res.json({ media: media.list() }); }
function upload(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Image file is required' });
  const item = media.create({ filename: req.file.filename, originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size, altText: req.body.altText });
  res.status(201).json({ media: item });
}
function replace(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Replacement image file is required' });
  const result = media.replace(Number(req.params.id), req.file, req.body.altText);
  if (!result.found) { if (req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Media not found' }); }
  res.json({ media: result.media });
}
function remove(req, res) {
  const result = media.remove(Number(req.params.id));
  if (!result.found) return res.status(404).json({ error: 'Media not found' });
  if (result.referenced) return res.status(409).json({ error: 'This image is still used by website content' });
  res.status(204).end();
}

module.exports = { list, upload, replace, remove };
