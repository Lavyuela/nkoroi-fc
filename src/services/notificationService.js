// Push Notification Service - Disabled for stability
import { Platform, PermissionsAndroid } from 'react-native';

let messaging = null;
let messagingAvailable = false;

console.log('⚠️ Push notifications disabled - using stable mode');

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!messagingAvailable || !messaging) {
    console.log('⚠️ Notifications not available');
    return false;
  }
  
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
  if (!messagingAvailable || !messaging) {
    console.log('⚠️ Cannot get FCM token - messaging not available');
    return null;
  }
  
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
  if (!messagingAvailable || !messaging) {
    console.log('⚠️ Cannot setup listeners - messaging not available');
    return () => {};
  }
  
  try {
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
  } catch (error) {
    console.error('Setup listeners error:', error);
    return () => {};
  }
};

// Send notification for match events
export const sendMatchEventNotification = async (matchId, eventType, eventData) => {
  // This would typically be done from your backend
  // For now, we'll just log it
  console.log('Match event notification:', { matchId, eventType, eventData });
};
