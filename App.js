import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import NotificationService from './src/services/notificationService';
import auth from '@react-native-firebase/auth';

export default function App() {
  useEffect(() => {
    // Initialize Notification Service when user logs in
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('🚀 User logged in, initializing notifications for:', user.uid);
        
        try {
          const success = await NotificationService.initialize(user.uid);
          if (success) {
            console.log('✅ Notification Service initialized with FCM token saved');
          }
        } catch (error) {
          console.error('❌ Notification initialization error:', error);
        }
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Initialize Notification Service on app start
    async function initializeNotifications() {
      console.log('🚀 Initializing Notification Service on app start...');
      
      const currentUser = auth().currentUser;
      const success = await NotificationService.initialize(currentUser?.uid);
      if (success) {
        console.log('✅ Notification Service initialized successfully');
      } else {
        console.warn('⚠️ Notification Service initialization failed');
      }
    }
    
    initializeNotifications();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
