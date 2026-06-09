import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext.jsx';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const { user, login: apiLogin, logout: apiLogout, loading } = useAuth();

  const isAuthenticated = !!user;

  const login = async (password) => {
    try {
      const res = await apiLogin('admin', password);
      return !!res;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    apiLogout();
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
