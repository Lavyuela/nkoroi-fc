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

  // Get FCM token - OPTIONAL (not required for local notifications)
  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('✅ FCM Token obtained:', token.substring(0, 50) + '...');
      await AsyncStorage.setItem('fcm_token', token);
      return token;
    } catch (error) {
      console.warn('⚠️ FCM token not available (this is OK - local notifications will still work):', error.message);
      return null;
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
  setupTokenRefreshHandler() {
    return messaging().onTokenRefresh(async token => {
      console.log('FCM token refreshed:', token);
      await AsyncStorage.setItem('fcm_token', token);
      // Send token to your backend if needed
    });
  }

  // Initialize all handlers
  async initialize() {
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

      // Get FCM token (optional - not required for local notifications)
      console.log('Getting FCM token (optional)...');
      try {
        const token = await this.getFCMToken();
        if (token) {
          console.log('✅ FCM token obtained');
        } else {
          console.log('⚠️ No FCM token - using local notifications only');
        }
      } catch (error) {
        console.log('⚠️ FCM token failed - using local notifications only');
      }

      // Setup handlers
      console.log('Setting up handlers...');
      this.setupForegroundHandler();
      this.setupNotificationOpenedHandler();
      this.setupTokenRefreshHandler();
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
