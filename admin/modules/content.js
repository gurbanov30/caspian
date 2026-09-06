import { api } from './api.js';

export async function loadSettings() { return (await api.settings()).settings; }
export async function loadItems(collection) { return (await api.items(collection)).items; }
