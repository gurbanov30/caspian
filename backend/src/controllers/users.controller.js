const users = require('../services/users.service');

async function list(_req, res) {
  res.json({ users: users.list() });
}

async function create(req, res) {
  res.status(201).json({ user: await users.create(req.body) });
}

async function update(req, res) {
  res.json({ user: users.update(Number(req.params.id), req.body, req.session.userId) });
}

async function resetPassword(req, res) {
  res.json({ user: await users.resetPassword(Number(req.params.id), req.body) });
}

async function remove(req, res) {
  users.remove(Number(req.params.id), req.session.userId);
  res.status(204).end();
}

module.exports = { list, create, update, resetPassword, remove };
