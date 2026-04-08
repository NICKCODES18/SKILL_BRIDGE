const BASE = '/api/auth';

export const authApi = {
  register: async (data) => {
    const res = await fetch(`${BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    return json.data;
  },

  login: async (data) => {
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    return json.data;
  },

  getMe: async (token) => {
    const res = await fetch(`${BASE}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to get user');
    return json.data;
  },
};
