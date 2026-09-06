function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireCsrf(req, res, next) {
  if (!req.session || !req.session.csrfToken || req.get('x-csrf-token') !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}

function requireSuperAdmin(req, res, next) {
  if (!req.session || req.session.userRole !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access is required' });
  }
  next();
}

module.exports = { requireAuth, requireCsrf, requireSuperAdmin };
