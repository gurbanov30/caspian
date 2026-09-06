let csrfToken = '';

export function setCsrfToken(token) { csrfToken = token || ''; }

export async function request(url, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes((options.method || 'GET').toUpperCase()) && csrfToken) headers.set('X-CSRF-Token', csrfToken);
  const response = await fetch(url, { credentials: 'same-origin', ...options, headers });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: body => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  dashboard: () => request('/api/dashboard'),
  settings: () => request('/api/content/settings'),
  saveSetting: (key, value) => request(`/api/content/settings/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) }),
  items: collection => request(`/api/content/items${collection ? `?collection=${encodeURIComponent(collection)}` : ''}`),
  createItem: item => request('/api/content/items', { method: 'POST', body: JSON.stringify(item) }),
  updateItem: (id, item) => request(`/api/content/items/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteItem: id => request(`/api/content/items/${id}`, { method: 'DELETE' }),
  media: () => request('/api/media'),
  uploadMedia: formData => request('/api/media', { method: 'POST', body: formData }),
  replaceMedia: (id, formData) => request(`/api/media/${id}`, { method: 'PUT', body: formData }),
  deleteMedia: id => request(`/api/media/${id}`, { method: 'DELETE' }),
  inquiries: () => request('/api/inquiries'),
  updateInquiry: (id, body) => request(`/api/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteInquiry: id => request(`/api/inquiries/${id}`, { method: 'DELETE' }),
  changePassword: body => request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
  users: () => request('/api/users'),
  createUser: body => request('/api/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  resetUserPassword: (id, body) => request(`/api/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify(body) }),
  deleteUser: id => request(`/api/users/${id}`, { method: 'DELETE' })
};
