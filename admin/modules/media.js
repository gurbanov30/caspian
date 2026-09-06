import { api } from './api.js';
export async function loadMedia() { return (await api.media()).media; }
