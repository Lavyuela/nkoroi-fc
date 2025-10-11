import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import firestore from '@react-native-firebase/firestore';

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('✅ Notification permissions granted');
      } else {
        console.log('⚠️ Notification permissions denied');
      }
    };
    
    requestPermissions();
    
    // Track the last notification timestamp to avoid duplicates
    let lastNotificationTime = Date.now();
    
    // Listen for ALL new notifications in Firebase
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const notification = change.doc.data();
            const notificationTime = notification.createdAt?.toMillis() || 0;
            
            // Only show notifications created after app started (avoid showing old ones on startup)
            if (notificationTime > lastNotificationTime) {
              // Show local notification
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: notification.title,
                  body: notification.body,
                  data: notification.data || {},
                  sound: true,
                  priority: Notifications.AndroidNotificationPriority.MAX,
                  vibrate: [0, 250, 250, 250],
                },
                trigger: null, // Show immediately
              });
              
              console.log('📬 Notification shown:', notification.title);
            }
          }
        });
      });
    
    return () => unsubscribe();
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
