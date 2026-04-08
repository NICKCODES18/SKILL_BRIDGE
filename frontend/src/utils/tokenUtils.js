export const getToken = () => localStorage.getItem('sb_token');
export const setToken = (token) => localStorage.setItem('sb_token', token);
export const removeToken = () => localStorage.removeItem('sb_token');

export const getUser = () => {
  const user = localStorage.getItem('sb_user');
  return user ? JSON.parse(user) : null;
};
export const setUser = (user) => localStorage.setItem('sb_user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('sb_user');

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});
