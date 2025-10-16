import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  constructor() {
    this.initialized = false;
  }

  // Request notification permissions
  async requestPermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // Auto-granted on Android < 13
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
  }

  // Get FCM token and save to Firestore
  async getFCMToken(userId = null) {
    try {
      console.log('🔑 Getting FCM token...');
      const token = await messaging().getToken();
      
      if (!token) {
        throw new Error('FCM token is null');
      }
      
      console.log('✅ FCM Token obtained:', token.substring(0, 50) + '...');
      await AsyncStorage.setItem('fcm_token', token);
      
      // Save to Firestore if userId provided
      if (userId) {
        const firestore = require('@react-native-firebase/firestore').default;
        await firestore().collection('users').doc(userId).set({
          fcmToken: token,
          fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log('✅ FCM token saved to Firestore for user:', userId);
      }
      
      return token;
    } catch (error) {
      console.error('❌ Get FCM token error:', error);
      throw error;
    }
  }

  // Create notification channel (Android)
  async createNotificationChannel() {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      await notifee.createChannel({
        id: 'match_updates',
        name: 'Match Updates',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      await notifee.createChannel({
        id: 'score_updates',
        name: 'Score Updates',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      console.log('Notification channels created');
    } catch (error) {
      console.error('Create channel error:', error);
    }
  }

  // Display local notification
  async displayNotification(notification) {
    try {
      const { title, body, data = {} } = notification;

      await notifee.displayNotification({
        title: title || 'Nkoroi FC',
        body: body || '',
        android: {
          channelId: data.channelId || 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          color: '#87CEEB',
          sound: 'default',
          vibrationPattern: [300, 500],
          style: body?.length > 50 ? {
            type: AndroidStyle.BIGTEXT,
            text: body,
          } : undefined,
        },
        data,
      });

      console.log('Notification displayed:', title);
    } catch (error) {
      console.error('Display notification error:', error);
    }
  }

  // Handle foreground messages
  setupForegroundHandler() {
    return messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      
      await this.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
      });
    });
  }

  // Handle background messages (removed - must be at top level)

  // Handle notification opened (app was closed/background)
  setupNotificationOpenedHandler() {
    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);
          // Handle navigation based on remoteMessage.data
        }
      });

    // App opened from background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);
      // Handle navigation based on remoteMessage.data
    });

    // Notifee notification pressed
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1) { // PRESS
        console.log('Notifee notification pressed:', detail);
        // Handle navigation based on detail.notification.data
      }
    });
  }

  // Handle token refresh
  setupTokenRefreshHandler(userId = null) {
    return messaging().onTokenRefresh(async token => {
      console.log('🔄 FCM token refreshed:', token.substring(0, 50) + '...');
      await AsyncStorage.setItem('fcm_token', token);
      
      // Save to Firestore if userId provided
      if (userId) {
        try {
          const firestore = require('@react-native-firebase/firestore').default;
          await firestore().collection('users').doc(userId).set({
            fcmToken: token,
            fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          console.log('✅ Refreshed FCM token saved to Firestore');
        } catch (error) {
          console.error('Error saving refreshed token:', error);
        }
      }
    });
  }

  // Initialize all handlers
  async initialize(userId = null) {
    if (this.initialized) {
      console.log('Notification service already initialized');
      return true;
    }

    try {
      console.log('Starting notification service initialization...');
      
      // Request permissions
      console.log('Requesting permissions...');
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('Notification permission denied');
        throw new Error('Notification permission denied');
      }
      console.log('✅ Permission granted');

      // Create channels
      console.log('Creating notification channels...');
      await this.createNotificationChannel();
      console.log('✅ Channels created');

      // Get FCM token
      console.log('Getting FCM token...');
      const token = await this.getFCMToken(userId);
      if (!token) {
        throw new Error('Failed to get FCM token');
      }
      console.log('✅ FCM token obtained and saved');

      // Subscribe to team updates topic for broadcast notifications
      console.log('Subscribing to team_updates topic...');
      await messaging()
        .subscribeToTopic('team_updates')
        .then(() => console.log('✅ Subscribed to topic: team_updates'))
        .catch(err => console.error('❌ Topic subscription failed:', err));

      // Setup handlers
      console.log('Setting up handlers...');
      this.setupForegroundHandler();
      this.setupNotificationOpenedHandler();
      this.setupTokenRefreshHandler(userId);
      console.log('✅ Handlers set up');

      this.initialized = true;
      console.log('✅ Notification service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Notification service initialization error:', error);
      throw error;
    }
  }

  // Send test notification (local)
  async sendTestNotification() {
    await this.displayNotification({
      title: '⚽ Test Notification',
      body: 'This is a test notification from Nkoroi FC app!',
      data: {
        type: 'test',
        channelId: 'default',
      },
    });
  }

  // Send match update notification
  async sendMatchUpdateNotification(match) {
    await this.displayNotification({
      title: `⚽ ${match.homeTeam} vs ${match.awayTeam}`,
      body: `Match starting soon at ${match.venue}!`,
      data: {
        type: 'match_update',
        matchId: match.id,
        channelId: 'match_updates',
      },
    });
  }

  // Send score update notification
  async sendScoreUpdateNotification(match) {
    await this.displayNotification({
      title: `🔥 GOAL! ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}`,
      body: `${match.scorer} scores for ${match.scoringTeam}!`,
      data: {
        type: 'score_update',
        matchId: match.id,
        channelId: 'score_updates',
      },
    });
  }
}

// Setup background handler (must be at top level, outside class)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  
  // Display notification using Notifee
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Nkoroi FC',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId: remoteMessage.data?.channelId || 'default',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
      smallIcon: 'ic_launcher',
      color: '#87CEEB',
    },
    data: remoteMessage.data,
  });
});

export default new NotificationService();
