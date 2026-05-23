import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios globally to send cookies with all requests
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      try {
        const response = await axios.get(`${baseURL}/auth/me`);
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.log('No active authenticated session detected.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await axios.post(`${baseURL}/auth/login`, { email, password });
    
    const { user: receivedUser } = response.data;
    setUser(receivedUser);
    return response.data;
  };

  const signup = async (name, email, password, role) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await axios.post(`${baseURL}/auth/signup`, { name, email, password, role });
    
    const { user: receivedUser } = response.data;
    setUser(receivedUser);
    return response.data;
  };

  const logout = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    try {
      await axios.post(`${baseURL}/auth/logout`);
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
    }
  };

  // Kept for backward compatibility with existing store calls
  const authHeaders = {};

  return (
    <AuthContext.Provider value={{ token: null, user, authHeaders, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
