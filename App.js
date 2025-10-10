import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    // Request permission for notifications (Android/iOS)
    async function requestPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getToken();
      } else {
        console.log('Push notification permission denied');
      }
    }

    // Get FCM token
    async function getToken() {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);   // ✅ Copy this token
      Alert.alert('FCM Token', token);   // Optional: shows token on phone
    }

    requestPermission();
  }, []);

  return (
    <View>
      <Text>Nkoroi FC Live Score App</Text>
    </View>
  );
}
