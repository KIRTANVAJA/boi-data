import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../utils/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiRequest('/auth/me');
        if (res.success) {
          setUser(res.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth check failed:', err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login handler
  const login = async (username, password) => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      if (res.success) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Password update handler
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      return await apiRequest('/auth/changepassword', {
        method: 'PUT',
        body: { currentPassword, newPassword },
      });
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
