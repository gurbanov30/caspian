const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const seed = require('./db/seed');
const SQLiteSessionStore = require('./session-store');
const authRoutes = require('./routes/auth.routes');
const authController = require('./controllers/auth.controller');
const contentRoutes = require('./routes/content.routes');
const inquiryRoutes = require('./routes/inquiries.routes');
const mediaRoutes = require('./routes/media.routes');
const settingsRoutes = require('./routes/settings.routes');
const usersRoutes = require('./routes/users.routes');
const { requireAuth } = require('./middleware/auth');
const errorHandler = require('./middleware/error-handler');

seed();

const app = express();

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(session({
  name: 'admin.sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteSessionStore(),
  cookie: { httpOnly: true, sameSite: 'lax', secure: config.nodeEnv === 'production', maxAge: 8 * 60 * 60 * 1000 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/assets', express.static(path.join(config.rootDir, 'assets'), { index: false }));

const adminLoginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
app.post('/admin/login', adminLoginLimit, authController.adminLogin);

app.get('/api/dashboard', requireAuth, (_req, res) => {
  const db = require('./db');
  const inquiries = db.prepare('SELECT COUNT(*) AS total, SUM(status = \'new\') AS unread FROM inquiries').get();
  const media = db.prepare('SELECT COUNT(*) AS total FROM media').get();
  const items = db.prepare('SELECT COUNT(*) AS total FROM content_items').get();
  res.json({ inquiries: { total: inquiries.total, unread: inquiries.unread || 0 }, media: media.total, contentItems: items.total });
});

app.get('/admin/public-content.js', (_req, res) => {
  res.type('application/javascript').send(fs.readFileSync(path.join(__dirname, 'public-content.js'), 'utf8'));
});
app.use('/admin', express.static(config.adminDirectory, { index: 'index.html' }));
app.use('/media', express.static(config.mediaDirectory, { index: false, fallthrough: false }));

app.get('/', (_req, res, next) => {
  fs.readFile(config.publicFile, 'utf8', (error, html) => {
    if (error) return next(error);
    const integration = '<script src="/admin/public-content.js" defer></script>';
    res.type('html').send(html.replace('</head>', `${integration}</head>`));
  });
});

app.use(errorHandler);

module.exports = app;
