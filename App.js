import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import NotificationService from './src/services/NotificationService';

export default function App() {
  useEffect(() => {
    // Initialize Notification Service
    async function initializeNotifications() {
      console.log('🚀 Initializing Notification Service...');
      
      const success = await NotificationService.initialize();
      if (success) {
        console.log('✅ Notification Service initialized successfully');
      } else {
        console.warn('⚠️ Notification Service initialization failed');
      }
      
      // Listen for new notifications in Firestore
      let lastNotificationTime = Date.now();
      console.log('🔔 Firestore listener started at:', new Date(lastNotificationTime).toISOString());
      
      const unsubscribeFirestore = firestore()
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .onSnapshot(async (snapshot) => {
          if (!snapshot) {
            console.log('⚠️ No snapshot received');
            return;
          }
          
          console.log('📥 Firestore snapshot received, changes:', snapshot.docChanges().length);
          
          for (const change of snapshot.docChanges()) {
            if (change.type === 'added') {
              const notification = change.doc.data();
              const notificationTime = notification.createdAt?.toMillis() || 0;
              
              console.log('📬 New notification detected:', {
                title: notification.title,
                notificationTime: new Date(notificationTime).toISOString(),
                lastNotificationTime: new Date(lastNotificationTime).toISOString(),
                willShow: notificationTime > lastNotificationTime
              });
              
              // Only show notifications created after app started
              if (notificationTime > lastNotificationTime) {
                console.log('📬 Showing notification:', notification.title);
                
                await NotificationService.displayNotification({
                  title: notification.title || 'New Update',
                  body: notification.body || '',
                  data: notification.data || {}
                });
              } else {
                console.log('⏭️ Skipping old notification');
              }
            }
          }
        }, (error) => {
          console.error('❌ Firestore listener error:', error);
        });
      
      return () => {
        unsubscribeFirestore();
      };
    }
    
    initializeNotifications();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
