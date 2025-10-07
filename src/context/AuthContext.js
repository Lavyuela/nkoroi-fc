import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, checkIfAdmin } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const adminStatus = await checkIfAdmin(firebaseUser.uid);
        setIsAdmin(adminStatus);
        await AsyncStorage.setItem('userId', firebaseUser.uid);
      } else {
        setUser(null);
        setIsAdmin(false);
        await AsyncStorage.removeItem('userId');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
