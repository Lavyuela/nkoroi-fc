import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
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
    // Request notification permission
    const setupNotifications = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          console.log('✅ Notification permission granted');
        } else {
          console.log('⚠️ Notification permission denied');
        }
      } catch (error) {
        console.log('⚠️ Error requesting permission:', error);
      }
    };
    
    setupNotifications();
    
    // Listen for new notifications in Firestore - SIMPLE & RELIABLE
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
              console.log('📬 New notification:', notification.title);
              
              try {
                // Show local notification
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: notification.title || 'New Update',
                    body: notification.body || '',
                    data: notification.data || {},
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.MAX,
                  },
                  trigger: null,
                });
                
                console.log('✅ Notification shown');
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
