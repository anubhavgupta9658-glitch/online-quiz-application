import React, { createContext, useState, useCallback, useEffect } from 'react';

/**
 * AuthContext
 * Provides global authentication state management
 * Handles user authentication, token storage, and role-based access
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  /**
   * Set authentication (after login/register)
   */
  const setAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  /**
   * Set error message
   */
  const setErrorMsg = useCallback((msg) => {
    setError(msg);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get authorization header
   */
  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const value = {
    user,
    token,
    loading,
    error,
    setLoading,
    setErrorMsg,
    clearError,
    isAuthenticated,
    isAdmin,
    setAuth,
    logout,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
