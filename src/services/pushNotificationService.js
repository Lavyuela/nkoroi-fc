// Push Notification Service - Sends notifications even when app is closed
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register device for push notifications and save token to Firestore
 */
export const registerForPushNotifications = async () => {
  try {
    // Check if device is physical (push notifications don't work on emulators)
    if (!Device.isDevice) {
      console.log('⚠️ Push notifications only work on physical devices');
      return { success: false, error: 'Not a physical device' };
    }

    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('⚠️ Push notification permission denied');
      return { success: false, error: 'Permission denied' };
    }

    // Get Expo Push Token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // This will be auto-detected from app.json
    });
    
    const expoPushToken = tokenData.data;
    console.log('✅ Expo Push Token:', expoPushToken);

    // Save token to user's Firestore document
    const currentUser = auth().currentUser;
    if (currentUser) {
      await firestore().collection('users').doc(currentUser.uid).set({
        expoPushToken,
        expoPushTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        deviceInfo: {
          platform: Platform.OS,
          deviceName: Device.deviceName,
          osVersion: Device.osVersion,
        },
      }, { merge: true });
      
      console.log('✅ Push token saved to Firestore');
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Match Updates',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4FC3F7',
        sound: 'default',
      });
    }

    return { success: true, token: expoPushToken };
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to all users
 * This uses Expo's Push Notification service
 */
export const sendPushNotificationToAllUsers = async (title, body, data = {}) => {
  try {
    // Get all users with push tokens
    const usersSnapshot = await firestore().collection('users').get();
    const pushTokens = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.expoPushToken) {
        pushTokens.push(userData.expoPushToken);
      }
    });

    if (pushTokens.length === 0) {
      console.log('⚠️ No push tokens found');
      return { success: false, error: 'No users to notify' };
    }

    // Prepare push notification messages
    const messages = pushTokens.map(token => ({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
      channelId: 'default',
      badge: 1,
    }));

    // Send to Expo Push Notification service
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('✅ Push notifications sent:', result);

    // Also save to Firestore for in-app notification history
    await firestore().collection('notifications').add({
      title,
      body,
      data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sentTo: pushTokens.length,
      read: false,
    });

    return { success: true, sentTo: pushTokens.length };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to specific user
 */
export const sendPushNotificationToUser = async (userId, title, body, data = {}) => {
  try {
    // Get user's push token
    const userDoc = await firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.expoPushToken) {
      console.log('⚠️ User has no push token');
      return { success: false, error: 'No push token' };
    }

    // Send push notification
    const message = {
      to: userData.expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
      channelId: 'default',
      badge: 1,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('✅ Push notification sent to user:', result);

    return { success: true };
  } catch (error) {
    console.error('Error sending push notification to user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Setup notification listeners for when user taps notification
 */
export const setupPushNotificationListeners = () => {
  // Handle notification received while app is in foreground
  const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('📬 Notification received in foreground:', notification);
  });

  // Handle notification tap (user clicked on notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 User tapped notification:', response);
    const data = response.notification.request.content.data;
    
    // Handle navigation based on notification data
    if (data.type === 'new_match' && data.matchId) {
      // Navigate to match detail screen
      // You can use navigation ref here
      console.log('Navigate to match:', data.matchId);
    } else if (data.type === 'team_update' && data.updateId) {
      // Navigate to updates screen
      console.log('Navigate to updates');
    }
  });

  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
};
