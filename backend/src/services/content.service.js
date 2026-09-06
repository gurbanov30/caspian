const repository = require('../repositories/content.repository');

const publicCollections = new Set(['trust_items', 'heritage_items', 'services', 'principles', 'capabilities', 'process_steps', 'contact_items']);

function publicContent() {
  const collections = Object.fromEntries([...publicCollections].map(collection => [collection, repository.list(collection).filter(item => item.status === 'published')]));
  return { settings: repository.settings(), collections };
}

module.exports = { ...repository, publicContent, publicCollections };
