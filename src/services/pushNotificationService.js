// Push Notification Service - React Native Firebase FCM
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
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
 * Register device for FCM Push Notifications
 */
export const registerForPushNotifications = async () => {
  try {
    // Request FCM permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('⚠️ Push notification permission denied');
      return { success: false, error: 'Permission denied' };
    }

    console.log('✅ FCM permission granted');

    // Get FCM token - THIS IS THE KEY PART
    let fcmToken = null;
    try {
      fcmToken = await messaging().getToken();
      console.log('✅ FCM Token obtained:', fcmToken.substring(0, 50) + '...');
    } catch (tokenError) {
      console.error('❌ Error getting FCM token:', tokenError);
      return { success: false, error: 'Failed to get FCM token: ' + tokenError.message };
    }

    if (!fcmToken) {
      console.error('❌ FCM token is null');
      return { success: false, error: 'FCM token is null' };
    }

    // Save FCM token to Firestore
    const currentUser = auth().currentUser;
    if (currentUser) {
      await firestore().collection('users').doc(currentUser.uid).set({
        fcmToken,
        fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        platform: Platform.OS,
        deviceInfo: {
          lastUpdated: new Date().toISOString(),
        }
      }, { merge: true });
      
      console.log('✅ FCM token saved to Firestore');
    } else {
      console.log('⚠️ No current user, token not saved');
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
      
      console.log('✅ Android notification channel configured');
    }

    // Listen for token refresh
    messaging().onTokenRefresh(async (newToken) => {
      console.log('🔄 FCM token refreshed:', newToken.substring(0, 50) + '...');
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).update({
          fcmToken: newToken,
          fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    return { success: true, token: fcmToken };
  } catch (error) {
    console.error('❌ Error registering for push notifications:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to all users
 * Uses Firestore as message queue - each device listens for new notifications
 */
export const sendPushNotificationToAllUsers = async (title, body, data = {}) => {
  try {
    // Save notification to Firestore
    // All devices are listening to this collection and will show the notification
    const notificationDoc = await firestore().collection('notifications').add({
      title,
      body,
      data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'broadcast',
    });

    console.log(`✅ Notification saved to Firestore: ${notificationDoc.id}`);
    console.log(`📢 Title: ${title}`);
    console.log(`📢 Body: ${body}`);

    return { success: true, notificationId: notificationDoc.id };
  } catch (error) {
    console.error('Error sending notification:', error);
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
