import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationService from './src/services/notificationService';
import auth from '@react-native-firebase/auth';

export default function App() {
  useEffect(() => {
    // Initialize Notification Service ONCE on app start
    let isInitialized = false;
    
    async function initializeNotifications() {
      if (isInitialized) {
        console.log('⏭️ Notification Service already initialized, skipping');
        return;
      }
      
      console.log('🚀 Initializing Notification Service...');
      
      const currentUser = auth().currentUser;
      try {
        const success = await NotificationService.initialize(currentUser?.uid);
        if (success) {
          isInitialized = true;
          console.log('✅ Notification Service initialized successfully');
        }
      } catch (error) {
        console.error('❌ Notification initialization error:', error);
      }
    }
    
    // Initialize immediately
    initializeNotifications();
    
    // Re-initialize when user logs in (if not already initialized)
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user && !isInitialized) {
        console.log('🚀 User logged in, initializing notifications for:', user.uid);
        await initializeNotifications();
      }
    });
    
    return () => unsubscribeAuth();
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
