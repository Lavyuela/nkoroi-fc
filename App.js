import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotifications, setupPushNotificationListeners } from './src/services/pushNotificationService';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    // Register for push notifications
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
    
    // Listen for new notifications in Firestore and show them
    let lastNotificationTime = Date.now();
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const notification = change.doc.data();
            const notificationTime = notification.createdAt?.toMillis() || 0;
            
            // Only show notifications created after app started
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
    
    // Handle foreground FCM messages
    const unsubscribeFCM = messaging().onMessage(async remoteMessage => {
      console.log('📬 FCM message received:', remoteMessage);
      
      // Show local notification
      if (remoteMessage.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: remoteMessage.data || {},
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: null,
        });
      }
    });
    
    return () => {
      cleanup();
      unsubscribe();
      unsubscribeFCM();
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
