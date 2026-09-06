const { z } = require('zod');

const text = (max = 10000) => z.string().trim().max(max);

const inquirySchema = z.object({
  name: text(180).min(1),
  phone: text(80).min(3),
  service: text(180).min(1),
  location: text(180).optional().default(''),
  message: text(5000).optional().default('')
});

const contentSchema = z.object({
  collection: z.string().regex(/^[a-z0-9_-]+$/).min(1).max(80),
  slug: z.string().regex(/^[a-z0-9_-]+$/).min(1).max(120),
  position: z.coerce.number().int().min(0).max(10000).default(0),
  status: z.enum(['published', 'draft']).default('published'),
  data: z.record(z.any())
});

const inquiryUpdateSchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved', 'archived']).optional(),
  notes: text(5000).optional()
});

module.exports = { inquirySchema, contentSchema, inquiryUpdateSchema };
