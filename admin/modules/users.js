import { api } from './api.js';

export async function loadUsers() {
  return (await api.users()).users;
}
