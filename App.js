import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotifications, setupPushNotificationListeners } from './src/services/pushNotificationService';
import firestore from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    // Register for push notifications
    const initPushNotifications = async () => {
      const result = await registerForPushNotifications();
      if (result.success) {
        console.log('✅ Push notifications enabled');
      } else {
        console.log('⚠️ Push notifications failed:', result.error);
      }
    };
    
    initPushNotifications();
    
    // Setup listeners for when user taps notifications
    const cleanup = setupPushNotificationListeners();
    
    // Listen for new notifications in Firestore
    // This shows LOCAL notifications when app is OPEN (foreground or background)
    let lastNotificationTime = Date.now();
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot(async (snapshot) => {
        if (!snapshot) return;
        
        for (const change of snapshot.docChanges()) {
          if (change.type === 'added') {
            const notification = change.doc.data();
            const notificationTime = notification.createdAt?.toMillis() || 0;
            
            // Only show notifications created after app started
            if (notificationTime > lastNotificationTime) {
              console.log('📬 New notification detected:', notification.title);
              
              try {
                // Show local notification using Expo Notifications
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: notification.title || 'New Update',
                    body: notification.body || '',
                    data: notification.data || {},
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                  },
                  trigger: null, // Show immediately
                });
                
                console.log('✅ Local notification displayed');
              } catch (error) {
                console.error('❌ Error showing notification:', error);
              }
            }
          }
        }
      }, (error) => {
        console.error('❌ Firestore listener error:', error);
      });
    
    return () => {
      cleanup();
      unsubscribe();
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
