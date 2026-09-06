import { api, setCsrfToken } from './api.js';

export async function restoreSession() {
  const data = await api.me();
  setCsrfToken(data.csrfToken);
  return data.user;
}

export async function login(credentials) {
  const data = await api.login(credentials);
  setCsrfToken(data.csrfToken);
  return data.user;
}

export async function logout() { await api.logout(); setCsrfToken(''); }
