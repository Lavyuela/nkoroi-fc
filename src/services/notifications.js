import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1a472a',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem('pushToken', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
};

export const sendLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Send immediately
  });
};

export const scheduleGoalNotification = async (team, playerName, score) => {
  await sendLocalNotification(
    `⚽ GOAL! ${team}`,
    `${playerName} scores! Score: ${score}`,
    { type: 'goal', team, playerName, score }
  );
};

export const scheduleMatchStartNotification = async (homeTeam, awayTeam) => {
  await sendLocalNotification(
    '🏁 Match Started!',
    `${homeTeam} vs ${awayTeam} - Live now!`,
    { type: 'match_start', homeTeam, awayTeam }
  );
};

export const scheduleMatchEndNotification = async (homeTeam, awayTeam, finalScore) => {
  await sendLocalNotification(
    '🏆 Full Time!',
    `${homeTeam} ${finalScore} ${awayTeam}`,
    { type: 'match_end', homeTeam, awayTeam, finalScore }
  );
};

export const addNotificationListener = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

export const addNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};
