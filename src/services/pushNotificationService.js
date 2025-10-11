// Push Notification Service - Firebase Cloud Messaging (FCM)
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Configure notification behavior for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register device for Expo Push Notifications and save token to Firestore
 */
export const registerForPushNotifications = async () => {
  try {
    // Request notification permission
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
      projectId: '7f3faf6f-5c89-4a7b-8bd5-03e48f0c6098', // From app.json
    });
    
    const expoPushToken = tokenData.data;
    console.log('✅ Expo Push Token:', expoPushToken);

    // Save token to user's Firestore document
    const currentUser = auth().currentUser;
    if (currentUser) {
      await firestore().collection('users').doc(currentUser.uid).set({
        expoPushToken,
        expoPushTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        platform: Platform.OS,
      }, { merge: true });
      
      console.log('✅ Expo Push token saved to Firestore');
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
 * Send push notification to all users via Expo Push Notification Service
 * This works even when the app is CLOSED!
 */
export const sendPushNotificationToAllUsers = async (title, body, data = {}) => {
  try {
    // Get all users with Expo Push Tokens
    const usersSnapshot = await firestore().collection('users').get();
    const expoPushTokens = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.expoPushToken) {
        expoPushTokens.push(userData.expoPushToken);
      }
    });

    if (expoPushTokens.length === 0) {
      console.log('⚠️ No Expo Push tokens found');
      return { success: false, error: 'No users to notify' };
    }

    console.log(`📤 Sending push notification to ${expoPushTokens.length} devices...`);

    // Prepare messages for Expo Push API
    const messages = expoPushTokens.map(token => ({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
      channelId: 'default',
    }));

    // Send to Expo Push Notification Service
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('✅ Expo Push API response:', result);

    // Save notification to Firestore for history
    await firestore().collection('notifications').add({
      title,
      body,
      data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sentTo: expoPushTokens.length,
      read: false,
    });

    console.log(`✅ Push notifications sent to ${expoPushTokens.length} devices!`);

    return { success: true, sentTo: expoPushTokens.length };
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
