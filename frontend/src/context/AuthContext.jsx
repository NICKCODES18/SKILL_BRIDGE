import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUser, setToken, setUser, removeToken, removeUser, isTokenExpired } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser && !isTokenExpired(token)) {
      setUserState(savedUser);
    } else {
      removeToken();
      removeUser();
    }
    setLoading(false);
  }, []);

  const login = useCallback((authData) => {
    setToken(authData.token);
    const userData = {
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
    };
    setUser(userData);
    setUserState(userData);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setUserState(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
