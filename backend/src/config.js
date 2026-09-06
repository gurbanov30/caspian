const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();

const rootDir = path.resolve(__dirname, '..', '..');

if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error('SESSION_SECRET must be at least 32 characters in production');
}

module.exports = {
  rootDir,
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB || 8) * 1024 * 1024,
  databasePath: path.join(rootDir, 'backend', 'data', 'site.sqlite'),
  mediaDirectory: path.join(rootDir, 'backend', 'storage', 'media'),
  publicFile: path.join(rootDir, 'index.html'),
  adminDirectory: path.join(rootDir, 'admin')
};
