import { authHeaders } from '../utils/tokenUtils';

const BASE = '/api/reviews';

export const reviewApi = {
  create: async (data) => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to submit review');
    return json.data;
  },

  getByService: async (serviceId, page = 0, size = 10) => {
    const res = await fetch(`${BASE}/service/${serviceId}?page=${page}&size=${size}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },
};
