import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { getUserRole } from '../services/firebaseService';

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
  const [userRole, setUserRole] = useState('fan');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
        
        // Get user role from Firestore
        const role = await getUserRole(firebaseUser.uid);
        setUserRole(role);
        setIsAdmin(role === 'admin' || role === 'super_admin');
        setIsSuperAdmin(role === 'super_admin');
        
        console.log(`✅ User logged in: ${firebaseUser.email} (${role})`);
      } else {
        setUser(null);
        setUserRole('fan');
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const saveUserSession = async (userData) => {
    // Firebase handles session automatically
    // Just update local state
    setUser(userData);
    
    if (userData && userData.uid) {
      const role = await getUserRole(userData.uid);
      setUserRole(role);
      setIsAdmin(role === 'admin' || role === 'super_admin');
      setIsSuperAdmin(role === 'super_admin');
    }
  };

  const clearUserSession = async () => {
    // Firebase signOut is handled in firebaseService
    setUser(null);
    setUserRole('fan');
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };

  const loadUserSession = async () => {
    // Firebase handles this automatically via onAuthStateChanged
    const currentUser = auth().currentUser;
    if (currentUser) {
      const role = await getUserRole(currentUser.uid);
      setUserRole(role);
      setIsAdmin(role === 'admin' || role === 'super_admin');
      setIsSuperAdmin(role === 'super_admin');
    }
  };

  const value = {
    user,
    userRole,
    isAdmin,
    isSuperAdmin,
    loading,
    saveUserSession,
    clearUserSession,
    loadUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
