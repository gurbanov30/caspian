import { api } from './api.js';
export async function loadInquiries() { return (await api.inquiries()).inquiries; }
