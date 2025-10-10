// Push Notification Service using React Native Firebase
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // Android < 13 doesn't need runtime permission
    }
    
    // iOS
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

// Get FCM token
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

// Setup notification listeners
export const setupNotificationListeners = () => {
  // Foreground messages
  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground notification:', remoteMessage);
    // You can show a local notification here if needed
  });

  // Background/Quit state messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification:', remoteMessage);
  });

  // Notification opened app
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app:', remoteMessage);
  });

  // Check if app was opened by notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened by notification:', remoteMessage);
      }
    });

  return unsubscribeForeground;
};

// Send notification for match events
export const sendMatchEventNotification = async (matchId, eventType, eventData) => {
  // This would typically be done from your backend
  // For now, we'll just log it
  console.log('Match event notification:', { matchId, eventType, eventData });
};
