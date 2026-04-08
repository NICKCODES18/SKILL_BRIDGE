import { authHeaders } from '../utils/tokenUtils';

const BASE = '/api/admin';

export const adminApi = {
  getStats: async () => {
    const res = await fetch(`${BASE}/stats`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch stats');
    return json.data;
  },

  getUsers: async (page = 0, size = 10) => {
    const res = await fetch(`${BASE}/users?page=${page}&size=${size}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  deleteUser: async (id) => {
    const res = await fetch(`${BASE}/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
  },

  getServices: async (page = 0, size = 10) => {
    const res = await fetch(`${BASE}/services?page=${page}&size=${size}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  toggleService: async (id) => {
    const res = await fetch(`${BASE}/services/${id}/toggle`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error('Failed to toggle service');
    return json.data;
  },
};
