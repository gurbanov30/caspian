const bcrypt = require('bcryptjs');
const { z } = require('zod');
const repository = require('../repositories/users.repository');

function error(message, statusCode = 400) {
  const value = new Error(message);
  value.statusCode = statusCode;
  return value;
}

const createSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(200),
  role: z.enum(['super_admin', 'admin']).default('admin')
});

const updateSchema = z.object({
  role: z.enum(['super_admin', 'admin']),
  isActive: z.boolean()
});

const passwordSchema = z.object({ password: z.string().min(12).max(200) });

async function create(input) {
  const user = createSchema.parse(input);
  if (repository.findByEmail(user.email)) throw error('This email is already registered', 409);
  return repository.create({ email: user.email, passwordHash: await bcrypt.hash(user.password, 12), role: user.role });
}

function protectLastSuperAdmin(target, nextRole, nextActive) {
  const removesLastSuperAdmin = target.role === 'super_admin' && target.is_active && (nextRole !== 'super_admin' || !nextActive);
  if (removesLastSuperAdmin && repository.activeSuperAdminCount() <= 1) throw error('At least one active super admin must remain');
}

function update(id, input, actorId) {
  const target = repository.get(id);
  if (!target) throw error('User not found', 404);
  const next = updateSchema.parse(input);
  if (target.id === actorId && (target.role !== next.role || target.is_active !== next.isActive)) {
    throw error('You cannot change your own role or deactivate your own account');
  }
  protectLastSuperAdmin(target, next.role, next.isActive);
  return repository.update(id, next);
}

async function resetPassword(id, input) {
  if (!repository.get(id)) throw error('User not found', 404);
  const { password } = passwordSchema.parse(input);
  return repository.updatePassword(id, await bcrypt.hash(password, 12));
}

function remove(id, actorId) {
  const target = repository.get(id);
  if (!target) throw error('User not found', 404);
  if (target.id === actorId) throw error('You cannot delete your own account');
  protectLastSuperAdmin(target, 'admin', false);
  repository.remove(id);
}

module.exports = { list: repository.list, create, update, resetPassword, remove };
