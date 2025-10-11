import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRole, USER_ROLES, isSuperAdmin as checkIsSuperAdmin, isAdminOrAbove } from '../services/userRoles';

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
  const [userRole, setUserRole] = useState(USER_ROLES.FAN);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved user session on app start
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('currentUser');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Get user role
        const role = await getUserRole(userData.email);
        setUserRole(role);
        
        // Set admin flags
        const isAdminUser = await isAdminOrAbove(userData.email);
        const isSuperAdminUser = await checkIsSuperAdmin(userData.email);
        
        setIsAdmin(isAdminUser);
        setIsSuperAdmin(isSuperAdminUser);
      }
    } catch (error) {
      console.log('Error loading user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserSession = async (userData) => {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      
      // Get and set user role
      const role = await getUserRole(userData.email);
      setUserRole(role);
      
      // Set admin flags
      const isAdminUser = await isAdminOrAbove(userData.email);
      const isSuperAdminUser = await checkIsSuperAdmin(userData.email);
      
      setIsAdmin(isAdminUser);
      setIsSuperAdmin(isSuperAdminUser);
    } catch (error) {
      console.log('Error saving user session:', error);
    }
  };

  const clearUserSession = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
      setUserRole(USER_ROLES.FAN);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.log('Error clearing user session:', error);
    }
  };

  const value = {
    user,
    userRole,
    isAdmin,
    isSuperAdmin,
    loading,
    setUser,
    setIsAdmin,
    setIsSuperAdmin,
    saveUserSession,
    clearUserSession,
    loadUserSession, // Expose to refresh role after changes
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
