// Push Notification Service using Expo Notifications
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermission = async () => {
  try {
    if (!Device.isDevice) {
      console.log('⚠️ Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('❌ Notification permission denied');
      return false;
    }
    
    console.log('✅ Notification permission granted');
    return true;
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

// Get Expo Push Token
export const getExpoPushToken = async () => {
  try {
    if (!Device.isDevice) {
      console.log('⚠️ Push tokens only work on physical devices');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    
    console.log('✅ Expo Push Token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

// Setup notification listeners
export const setupNotificationListeners = (onNotificationReceived, onNotificationTapped) => {
  // Listener for notifications received while app is foregrounded
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('📬 Notification received:', notification);
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });

  // Listener for when user taps on notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Notification tapped:', response);
    if (onNotificationTapped) {
      onNotificationTapped(response);
    }
  });

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

// Schedule local notification
export const scheduleLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
    console.log('✅ Local notification scheduled');
  } catch (error) {
    console.error('Schedule notification error:', error);
  }
};

// Send notification for match events
export const sendMatchEventNotification = async (eventType, matchData) => {
  const notifications = {
    'match_start': {
      title: '⚽ Match Started!',
      body: `${matchData.homeTeam} vs ${matchData.awayTeam} - Live now!`,
    },
    'goal': {
      title: '🎯 GOAL!',
      body: `${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`,
    },
    'yellow_card': {
      title: '🟨 Yellow Card',
      body: `${matchData.player} - ${matchData.team}`,
    },
    'red_card': {
      title: '🟥 Red Card!',
      body: `${matchData.player} - ${matchData.team}`,
    },
    'match_end': {
      title: '🏁 Full Time',
      body: `${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`,
    },
  };

  const notification = notifications[eventType];
  if (notification) {
    await scheduleLocalNotification(notification.title, notification.body, matchData);
  }
};
