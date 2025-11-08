import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppState } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationService from './src/services/notificationService';
import UpdateService from './src/services/updateService';
import ActivityService from './src/services/activityService';
import auth from '@react-native-firebase/auth';

export default function App() {
  useEffect(() => {
    // Check for app updates on startup
    setTimeout(() => {
      UpdateService.checkForUpdates(true);
    }, 3000); // Wait 3 seconds after app starts

    // Start activity tracking
    ActivityService.startTracking();

    // Listen for app state changes
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      ActivityService.handleAppStateChange(nextAppState);
    });

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
        // Update activity when user logs in
        ActivityService.updateLastActive();
      }
    });
    
    return () => {
      unsubscribeAuth();
      ActivityService.stopTracking();
      appStateSubscription?.remove();
    };
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
