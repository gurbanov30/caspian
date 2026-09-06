const repository = require('../repositories/inquiries.repository');
const { inquirySchema, inquiryUpdateSchema } = require('../utils/validation');

function create(input) { return repository.create(inquirySchema.parse(input)); }
function update(id, input) {
  const validated = inquiryUpdateSchema.parse(input);
  repository.update(id, validated);
  return repository.get(id);
}

module.exports = { ...repository, create, update };
