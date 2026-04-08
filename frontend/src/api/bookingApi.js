import { authHeaders } from '../utils/tokenUtils';

const BASE = '/api/bookings';

export const bookingApi = {
  create: async (data) => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create booking');
    return json.data;
  },

  getMy: async (page = 0, size = 10) => {
    const res = await fetch(`${BASE}/my?page=${page}&size=${size}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  getReceived: async (page = 0, size = 10) => {
    const res = await fetch(`${BASE}/received?page=${page}&size=${size}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch received bookings');
    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${BASE}/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update status');
    return json.data;
  },
};
