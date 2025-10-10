import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved user session on app start
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('currentUser');
      const savedIsAdmin = await AsyncStorage.getItem('isAdmin');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAdmin(savedIsAdmin === 'true');
      }
    } catch (error) {
      console.log('Error loading user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserSession = async (userData, adminStatus) => {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      await AsyncStorage.setItem('isAdmin', adminStatus.toString());
      setUser(userData);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.log('Error saving user session:', error);
    }
  };

  const clearUserSession = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.removeItem('isAdmin');
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.log('Error clearing user session:', error);
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    setUser,
    setIsAdmin,
    saveUserSession,
    clearUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
