import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermission, getExpoPushToken, setupNotificationListeners } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    // Initialize notifications
    const initNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const token = await getExpoPushToken();
        if (token) {
          console.log('📱 Push token ready:', token);
          // TODO: Send token to your backend to enable push notifications
        }
      }
      
      // Setup listeners
      const cleanup = setupNotificationListeners(
        (notification) => {
          // Handle notification received
          console.log('Notification received in app:', notification);
        },
        (response) => {
          // Handle notification tap
          console.log('User tapped notification:', response);
          // TODO: Navigate to relevant screen based on notification data
        }
      );
      
      return cleanup;
    };
    
    const cleanupPromise = initNotifications();
    
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
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
