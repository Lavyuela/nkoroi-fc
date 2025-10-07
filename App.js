import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotifications, addNotificationListener, addNotificationResponseListener } from './src/services/notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Add notification listeners
    const notificationListener = addNotificationListener((notification) => {
      console.log('Notification received:', notification);
    });

    const responseListener = addNotificationResponseListener((response) => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
