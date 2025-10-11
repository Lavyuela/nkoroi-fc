import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermission, setupNotificationListeners } from './src/services/firebaseService';

export default function App() {
  useEffect(() => {
    // Initialize Firebase notifications
    const initNotifications = async () => {
      const result = await requestNotificationPermission();
      if (result.success) {
        console.log('✅ Notifications enabled, FCM token:', result.token);
      } else {
        console.log('⚠️ Notification permission denied');
      }
      
      // Setup Firebase Cloud Messaging listeners
      setupNotificationListeners();
    };
    
    initNotifications();
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
