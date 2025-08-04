import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token]);

  const login = (userData) => {
    setToken(userData.token);
    const userToStore = { 
      username: userData.username, 
      role: userData.role, 
      profileImageUrl: userData.profileImageUrl 
    };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  const logout = () => {
    setToken(null);
  };
  
  const updateUserProfile = (newProfileData) => {
    setUser(prevUser => {
        const updatedUser = { ...prevUser, ...newProfileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  };

  const value = {
    token,
    user,
    login,
    logout,
    updateUserProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};