import { authHeaders } from '../utils/tokenUtils';

const BASE = '/api/services';

export const serviceApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    const res = await fetch(`${BASE}?${query}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE}/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Service not found');
    return json.data;
  },

  getMy: async (page = 0, size = 9) => {
    const res = await fetch(`${BASE}/my?page=${page}&size=${size}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your services');
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create service');
    return json.data;
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update service');
    return json.data;
  },

  delete: async (id) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  getCategories: async () => {
    const res = await fetch('/api/categories');
    const json = await res.json();
    if (!res.ok) throw new Error('Failed to fetch categories');
    return json.data;
  },
};
