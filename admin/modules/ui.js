export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

export function toast(message, type = 'success') {
  const region = $('#toast-region');
  const item = document.createElement('div'); item.className = `toast ${type}`; item.textContent = message; region.appendChild(item);
  setTimeout(() => item.remove(), 3500);
}

export function formatDate(value) { return new Intl.DateTimeFormat('az-AZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
