import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Request notification permissions
async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    console.log('📱 Notification permission:', granted);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Authorization status:', authStatus);
  }

  return enabled;
}

// Get FCM token
async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('🔑 FCM Token:', token);
    // TODO: Save this token to Firestore for the current user
    return token;
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
  }
}

// Create notification channel for Android
async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
    vibrationPattern: [300, 500],
  });
  console.log('✅ Notification channel created');
}

// Display local notification using notifee
async function displayNotification(title, body, data = {}) {
  try {
    await notifee.displayNotification({
      title: title,
      body: body,
      data: data,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        sound: 'default',
      },
    });
    console.log('✅ Notification displayed:', title);
  } catch (error) {
    console.error('❌ Error displaying notification:', error);
  }
}

export default function App() {
  useEffect(() => {
    // Initialize Firebase Messaging
    async function initializeMessaging() {
      console.log('🚀 Initializing Firebase Messaging...');
      
      // Create notification channel
      await createNotificationChannel();
      
      // Request permissions
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        // Get FCM token
        await getFCMToken();
      }
      
      // Handle foreground messages
      const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        console.log('📬 Foreground message received:', remoteMessage);
        
        if (remoteMessage.notification) {
          await displayNotification(
            remoteMessage.notification.title || 'New Notification',
            remoteMessage.notification.body || '',
            remoteMessage.data
          );
        }
      });
      
      // Handle background messages (app in background/quit)
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('📬 Background message received:', remoteMessage);
        
        if (remoteMessage.notification) {
          await displayNotification(
            remoteMessage.notification.title || 'New Notification',
            remoteMessage.notification.body || '',
            remoteMessage.data
          );
        }
      });
      
      // Listen for new notifications in Firestore
      let lastNotificationTime = Date.now();
      console.log('🔔 Firestore listener started at:', new Date(lastNotificationTime).toISOString());
      
      const unsubscribeFirestore = firestore()
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
                
                await displayNotification(
                  notification.title || 'New Update',
                  notification.body || '',
                  notification.data || {}
                );
              } else {
                console.log('⏭️ Skipping old notification');
              }
            }
          }
        }, (error) => {
          console.error('❌ Firestore listener error:', error);
        });
      
      return () => {
        unsubscribeForeground();
        unsubscribeFirestore();
      };
    }
    
    initializeMessaging();
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
