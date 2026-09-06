import { api } from './modules/api.js';
import { login, logout, restoreSession } from './modules/auth.js';
import { renderDashboard } from './modules/dashboard.js';
import { loadSettings, loadItems } from './modules/content.js';
import { loadMedia } from './modules/media.js';
import { loadInquiries } from './modules/inquiries.js';
import { loadUsers } from './modules/users.js';
import { validatePassword } from './modules/settings.js';
import { $, $$, escapeHtml, toast, formatDate } from './modules/ui.js';

const state = { user: null, settings: {}, items: [], currentCollection: '', media: [], inquiries: [], users: [] };
const collectionLabels = { trust_items: 'Trust marquee', heritage_items: 'Heritage cards', services: 'Services', principles: 'Principles', capabilities: 'Capabilities', process_steps: 'Process steps', contact_items: 'Contact items' };

async function loadDashboard() { try { await renderDashboard(); } catch (error) { toast(error.message, 'error'); } }

async function loadContent() {
  try {
    state.settings = await loadSettings();
    const settingSelect = $('#setting-select'); settingSelect.innerHTML = Object.keys(state.settings).map(key => `<option value="${escapeHtml(key)}">${escapeHtml(key)}</option>`).join('');
    renderSetting();
    const collections = [...new Set((await loadItems('')).map(item => item.collection))];
    const collectionSelect = $('#collection-select'); collectionSelect.innerHTML = collections.map(key => `<option value="${escapeHtml(key)}">${escapeHtml(collectionLabels[key] || key)}</option>`).join('');
    state.currentCollection = collections[0] || ''; await renderCollection();
  } catch (error) { toast(error.message, 'error'); }
}
function renderSetting() { const value = state.settings[$('#setting-select').value]; $('#setting-editor').value = JSON.stringify(value || {}, null, 2); }
async function renderCollection() { state.currentCollection = $('#collection-select').value; state.items = await loadItems(state.currentCollection); $('#content-table').innerHTML = state.items.map(item => `<tr><td><strong>${escapeHtml(item.data.title || item.data.text || item.data.label || item.slug)}</strong><small>${escapeHtml(item.slug)}</small></td><td><span class="status-pill ${item.status === 'draft' ? 'draft' : ''}"><i></i>${escapeHtml(item.status)}</span></td><td>${item.position}</td><td class="row-actions"><button data-edit="${item.id}" title="Redaktə et">✎</button><button data-delete="${item.id}" title="Sil">×</button></td></tr>`).join('') || '<tr><td colspan="4" class="empty-state">Bu kolleksiyada element yoxdur.</td></tr>'; }
function openItem(item = null) { const dialog = $('#item-dialog'); const form = $('#item-form'); $('#dialog-title').textContent = item ? 'Elementi redaktə et' : 'Yeni element'; form.id.value = item?.id || ''; form.collection.value = item?.collection || state.currentCollection; form.slug.value = item?.slug || ''; form.position.value = item?.position ?? 0; form.status.value = item?.status || 'published'; form.data.value = JSON.stringify(item?.data || { title: '', description: '' }, null, 2); $('#item-error').textContent = ''; dialog.showModal(); }
async function saveItem(event) { event.preventDefault(); const form = event.currentTarget; try { const payload = { collection: form.collection.value, slug: form.slug.value, position: Number(form.position.value), status: form.status.value, data: JSON.parse(form.data.value) }; if (form.id.value) await api.updateItem(form.id.value, payload); else await api.createItem(payload); $('#item-dialog').close(); toast('Məzmun yadda saxlanıldı'); await loadContent(); } catch (error) { $('#item-error').textContent = error.message.includes('JSON') ? 'Data JSON formatı düzgün deyil.' : error.message; } }

async function loadMediaView() { try { state.media = await loadMedia(); $('#media-grid').innerHTML = state.media.map(item => `<article class="media-card"><div class="media-image"><img src="/media/${encodeURIComponent(item.filename)}" alt="${escapeHtml(item.alt_text)}"></div><div class="media-meta"><strong>${escapeHtml(item.original_name)}</strong><small>${Math.ceil(item.size_bytes / 1024)} KB · ${escapeHtml(item.mime_type)}</small><div class="media-actions"><label class="replace-link">Dəyiş<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" data-media-replace="${item.id}"></label><button data-media-delete="${item.id}" class="danger-link">Sil</button></div></div></article>`).join('') || '<p class="empty-state">Hələ media faylı əlavə edilməyib.</p>'; } catch (error) { toast(error.message, 'error'); } }

async function loadInquiriesView() { try { state.inquiries = await loadInquiries(); $('#inquiries-table').innerHTML = state.inquiries.map(item => `<tr><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.message || 'Mesaj yoxdur')}</small></td><td>${escapeHtml(item.service)}</td><td>${escapeHtml(item.phone)}<small>${escapeHtml(item.location)}</small></td><td>${formatDate(item.created_at)}</td><td><select class="status-select" data-inquiry-status="${item.id}"><option value="new" ${item.status === 'new' ? 'selected' : ''}>new</option><option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>in progress</option><option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>resolved</option><option value="archived" ${item.status === 'archived' ? 'selected' : ''}>archived</option></select></td><td class="row-actions"><button data-inquiry-delete="${item.id}" title="Sil">×</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty-state">Hələ sorğu yoxdur.</td></tr>'; } catch (error) { toast(error.message, 'error'); } }

function showApp(user) {
  state.user = user;
  $('#current-user').textContent = user.email;
  $('#users-nav').classList.toggle('hidden', user.role !== 'super_admin');
  $('#login-view').classList.add('hidden');
  $('#app-view').classList.remove('hidden');
}

function setView(view) {
  if (view === 'users' && state.user?.role !== 'super_admin') return;
  $$('.view').forEach(panel => panel.classList.toggle('active', panel.dataset.viewPanel === view));
  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $('#page-title').textContent = ({ dashboard: 'Dashboard', content: 'Məzmun', media: 'Media', inquiries: 'Sorğular', users: 'Üzvlər', settings: 'Tənzimləmələr' })[view];
  $('#sidebar').classList.remove('open');
  if (view === 'dashboard') loadDashboard();
  if (view === 'content') loadContent();
  if (view === 'media') loadMediaView();
  if (view === 'inquiries') loadInquiriesView();
  if (view === 'users') loadUsersView();
}

async function loadUsersView() {
  try {
    state.users = await loadUsers();
    $('#users-table').innerHTML = state.users.map(user => {
      const isCurrent = user.id === state.user.id;
      return `<tr><td><strong>${escapeHtml(user.email)}</strong><small>${isCurrent ? 'Cari hesab' : `ID #${user.id}`}</small></td><td><select class="status-select" data-user-role="${user.id}" ${isCurrent ? 'disabled' : ''}><option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option><option value="super_admin" ${user.role === 'super_admin' ? 'selected' : ''}>Super admin</option></select></td><td><button class="member-status ${user.is_active ? 'active' : 'inactive'}" data-user-toggle="${user.id}" ${isCurrent ? 'disabled' : ''}>${user.is_active ? 'Aktiv' : 'Deaktiv'}</button></td><td>${formatDate(user.created_at)}</td><td class="row-actions"><button data-user-password="${user.id}" title="Şifrəni yenilə">⌁</button><button data-user-delete="${user.id}" title="Sil" ${isCurrent ? 'disabled' : ''}>×</button></td></tr>`;
    }).join('') || '<tr><td colspan="5" class="empty-state">Hələ admin üzvü yoxdur.</td></tr>';
  } catch (error) {
    toast(error.message, 'error');
  }
}

$('#login-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; $('#login-error').textContent = ''; try { showApp(await login(Object.fromEntries(new FormData(form)))); await loadDashboard(); } catch (error) { $('#login-error').textContent = error.message; } });
$('#logout-button').addEventListener('click', async () => { try { await logout(); location.reload(); } catch (error) { toast(error.message, 'error'); } });
$$('.nav-link').forEach(link => link.addEventListener('click', () => setView(link.dataset.view)));
$$('[data-go]').forEach(button => button.addEventListener('click', () => setView(button.dataset.go)));
$('#mobile-menu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$('#setting-select').addEventListener('change', renderSetting);
$('#collection-select').addEventListener('change', renderCollection);
$('#save-setting').addEventListener('click', async () => { try { const key = $('#setting-select').value; await api.saveSetting(key, JSON.parse($('#setting-editor').value)); state.settings[key] = JSON.parse($('#setting-editor').value); toast('Bölmə yadda saxlanıldı'); } catch (error) { toast(error.message.includes('JSON') ? 'JSON formatı düzgün deyil.' : error.message, 'error'); } });
$('#new-item').addEventListener('click', () => openItem());
$('#item-form').addEventListener('submit', saveItem);
$('#content-table').addEventListener('click', async event => { const edit = event.target.closest('[data-edit]'); const remove = event.target.closest('[data-delete]'); if (edit) openItem(state.items.find(item => item.id === Number(edit.dataset.edit))); if (remove && confirm('Bu məzmun elementi silinsin?')) { try { await api.deleteItem(remove.dataset.delete); toast('Element silindi'); await renderCollection(); } catch (error) { toast(error.message, 'error'); } } });
$('#upload-form').addEventListener('submit', async event => { event.preventDefault(); try { await api.uploadMedia(new FormData(event.currentTarget)); event.currentTarget.reset(); toast('Media yükləndi'); await loadMediaView(); } catch (error) { toast(error.message, 'error'); } });
$('#media-grid').addEventListener('click', async event => { const button = event.target.closest('[data-media-delete]'); if (!button || !confirm('Bu media faylı silinsin?')) return; try { await api.deleteMedia(button.dataset.mediaDelete); toast('Media silindi'); await loadMediaView(); } catch (error) { toast(error.message, 'error'); } });
$('#media-grid').addEventListener('change', async event => { const input = event.target.closest('[data-media-replace]'); if (!input || !input.files[0]) return; const form = new FormData(); form.append('file', input.files[0]); try { await api.replaceMedia(input.dataset.mediaReplace, form); toast('Media dəyişdirildi'); await loadMediaView(); } catch (error) { toast(error.message, 'error'); } });
$('#refresh-inquiries').addEventListener('click', loadInquiriesView);
$('#inquiries-table').addEventListener('change', async event => { const select = event.target.closest('[data-inquiry-status]'); if (!select) return; try { await api.updateInquiry(select.dataset.inquiryStatus, { status: select.value }); toast('Status yeniləndi'); await loadDashboard(); } catch (error) { toast(error.message, 'error'); } });
$('#inquiries-table').addEventListener('click', async event => { const button = event.target.closest('[data-inquiry-delete]'); if (!button || !confirm('Bu sorğu silinsin?')) return; try { await api.deleteInquiry(button.dataset.inquiryDelete); toast('Sorğu silindi'); await loadInquiriesView(); await loadDashboard(); } catch (error) { toast(error.message, 'error'); } });
$('#password-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const nextPassword = form.nextPassword.value; $('#password-message').textContent = ''; if (!validatePassword(nextPassword)) { $('#password-message').textContent = 'Yeni şifrə minimum 12 simvol olmalıdır.'; return; } try { await api.changePassword(Object.fromEntries(new FormData(form))); form.reset(); $('#password-message').textContent = 'Şifrə yeniləndi.'; } catch (error) { $('#password-message').textContent = error.message; } });

$('#new-user').addEventListener('click', () => {
  $('#user-form').reset();
  $('#user-error').textContent = '';
  $('#user-dialog').showModal();
});
$('#user-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  $('#user-error').textContent = '';
  try {
    await api.createUser(Object.fromEntries(new FormData(form)));
    $('#user-dialog').close();
    toast('Yeni admin üzvü yaradıldı');
    await loadUsersView();
  } catch (error) {
    $('#user-error').textContent = error.message;
  }
});
$('#users-table').addEventListener('change', async event => {
  const role = event.target.closest('[data-user-role]');
  if (!role) return;
  const user = state.users.find(item => item.id === Number(role.dataset.userRole));
  if (!user) return;
  try {
    await api.updateUser(user.id, { role: role.value, isActive: user.is_active });
    toast('Üzv rolu yeniləndi');
    await loadUsersView();
  } catch (error) {
    toast(error.message, 'error');
    await loadUsersView();
  }
});
$('#users-table').addEventListener('click', async event => {
  const toggle = event.target.closest('[data-user-toggle]');
  const reset = event.target.closest('[data-user-password]');
  const remove = event.target.closest('[data-user-delete]');
  if (toggle) {
    const user = state.users.find(item => item.id === Number(toggle.dataset.userToggle));
    if (!user) return;
    try {
      await api.updateUser(user.id, { role: user.role, isActive: !user.is_active });
      toast(user.is_active ? 'Hesab deaktiv edildi' : 'Hesab aktiv edildi');
      await loadUsersView();
    } catch (error) { toast(error.message, 'error'); }
  }
  if (reset) {
    $('#user-password-form').reset();
    $('#user-password-form').elements.id.value = reset.dataset.userPassword;
    $('#user-password-error').textContent = '';
    $('#user-password-dialog').showModal();
  }
  if (remove && confirm('Bu admin hesabı silinsin?')) {
    try {
      await api.deleteUser(remove.dataset.userDelete);
      toast('Admin hesabı silindi');
      await loadUsersView();
    } catch (error) { toast(error.message, 'error'); }
  }
});
$('#user-password-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  $('#user-password-error').textContent = '';
  try {
    await api.resetUserPassword(form.elements.id.value, { password: form.elements.password.value });
    $('#user-password-dialog').close();
    toast('Şifrə yeniləndi');
  } catch (error) {
    $('#user-password-error').textContent = error.message;
  }
});

restoreSession().then(user => { showApp(user); loadDashboard(); }).catch(() => {});
