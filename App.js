import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use physical device for push notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission not granted!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4FC3F7',
    });
  }

  return token;
}

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Set up Android notification channel FIRST
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4FC3F7',
      });
    }
    
    // Register for push notifications and get token
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log('✅ Expo Push Token:', token);
        // TODO: Save this token to Firestore for the current user
      }
    });

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📬 Notification received:', notification);
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
    });
    
    // Listen for new notifications in Firestore - SIMPLE & RELIABLE
    let lastNotificationTime = Date.now();
    console.log('🔔 Notification listener started at:', new Date(lastNotificationTime).toISOString());
    
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot(async (snapshot) => {
        if (!snapshot) {
          console.log('⚠️ No snapshot received');
          return;
        }
        
        console.log('📥 Firestore snapshot received, changes:', snapshot.docChanges().length);
        
        for (const change of snapshot.docChanges()) {
          if (change.type === 'added') {
            const notification = change.doc.data();
            const notificationTime = notification.createdAt?.toMillis() || 0;
            
            console.log('📬 New notification detected:', {
              title: notification.title,
              notificationTime: new Date(notificationTime).toISOString(),
              lastNotificationTime: new Date(lastNotificationTime).toISOString(),
              willShow: notificationTime > lastNotificationTime
            });
            
            // Only show notifications created after app started
            if (notificationTime > lastNotificationTime) {
              console.log('📬 Showing notification:', notification.title);
              
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
                
                console.log('✅ Notification shown successfully');
              } catch (error) {
                console.error('❌ Error showing notification:', error);
              }
            } else {
              console.log('⏭️ Skipping old notification');
            }
          }
        }
      }, (error) => {
        console.error('❌ Firestore listener error:', error);
      });
    
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
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
