const { z } = require('zod');
const auth = require('../services/auth.service');

async function createSession(req, user) {
  await new Promise((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
  req.session.userId = user.id;
  req.session.userEmail = user.email;
  req.session.userRole = user.role;
  req.session.csrfToken = auth.makeCsrfToken();
}

async function login(req, res) {
  const input = z.object({ email: z.string().email(), password: z.string().min(1).max(200) }).parse(req.body);
  const user = await auth.authenticate(input.email, input.password);
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect' });
  await createSession(req, user);
  res.json({ user, csrfToken: req.session.csrfToken });
}

async function adminLogin(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const user = await auth.authenticate(email, password);
  if (!user) return res.redirect(303, '/admin/?login=failed');
  await createSession(req, user);
  res.redirect(303, '/admin/');
}

function me(req, res) {
  if (!req.session?.userId) return res.status(401).json({ error: 'Authentication required' });
  res.json({ user: { id: req.session.userId, email: req.session.userEmail, role: req.session.userRole }, csrfToken: req.session.csrfToken });
}

async function logout(req, res) {
  await new Promise(resolve => req.session.destroy(() => resolve()));
  res.clearCookie('admin.sid');
  res.status(204).end();
}

async function changePassword(req, res) {
  const input = z.object({ currentPassword: z.string().min(1), nextPassword: z.string().min(12).max(200) }).parse(req.body);
  const changed = await auth.changePassword(req.session.userId, input.currentPassword, input.nextPassword);
  if (!changed) return res.status(400).json({ error: 'Current password is incorrect' });
  res.json({ message: 'Password updated' });
}

module.exports = { login, adminLogin, me, logout, changePassword };
