import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotifications, setupPushNotificationListeners } from './src/services/pushNotificationService';

export default function App() {
  useEffect(() => {
    // Register for push notifications (works even when app is closed!)
    const initPushNotifications = async () => {
      const result = await registerForPushNotifications();
      if (result.success) {
        console.log('✅ Push notifications enabled:', result.token);
      } else {
        console.log('⚠️ Push notifications failed:', result.error);
      }
    };
    
    initPushNotifications();
    
    // Setup listeners for when user taps notifications
    const cleanup = setupPushNotificationListeners();
    
    return () => cleanup();
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
