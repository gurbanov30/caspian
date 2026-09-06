import { api } from './api.js';
import { $, escapeHtml } from './ui.js';

export async function renderDashboard() {
  const data = await api.dashboard();
  $('#dashboard-cards').innerHTML = [
    ['Sorğular', data.inquiries.total, `${data.inquiries.unread} yeni`, '✉'],
    ['Kontent elementləri', data.contentItems, 'DB-də aktiv', '◈'],
    ['Media faylları', data.media, 'Kitabxanada', '▧']
  ].map(([label, value, note, icon]) => `<article class="metric-card"><span class="metric-icon">${icon}</span><p>${escapeHtml(label)}</p><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`).join('');
  $('#nav-unread').textContent = data.inquiries.unread;
}
