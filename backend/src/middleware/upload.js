const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');
const config = require('../config');

const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/svg+xml', '.svg']
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, config.mediaDirectory),
  filename: (_req, file, callback) => {
    const extension = allowedTypes.get(file.mimetype) || path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadBytes, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) return callback(new Error('Only JPG, PNG, WEBP, GIF, and SVG files are allowed'));
    callback(null, true);
  }
});

module.exports = upload;
