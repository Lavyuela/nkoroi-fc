/**
 * Firebase Cloud Functions for Nkoroi FC
 * Sends push notifications using Expo Push Notification Service
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Trigger: When a new notification is created in Firestore
 * Action: Send FCM push notification to all users with FCM tokens
 */
exports.sendNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    try {
      const notification = snap.data();
      const notificationId = context.params.notificationId;
      
      console.log('📬 New notification created:', notificationId);
      console.log('📢 Title:', notification.title);
      console.log('📢 Body:', notification.body);
      
      // Get all users with Expo Push Tokens
      const usersSnapshot = await admin.firestore().collection('users').get();
      const expoPushTokens = [];
      
      console.log(`📊 Checking ${usersSnapshot.size} users for push tokens...`);
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        // Check for expoPushToken
        if (userData.expoPushToken && userData.expoPushToken.startsWith('ExponentPushToken[')) {
          expoPushTokens.push(userData.expoPushToken);
          console.log(`✅ Found Expo Push Token for user ${doc.id}`);
        } else {
          console.log(`⚠️ User ${doc.id} has no valid Expo Push Token`);
        }
      });
      
      if (expoPushTokens.length === 0) {
        console.log('❌ No Expo Push Tokens found in database');
        console.log('💡 Users need to open the app to register for notifications');
        return null;
      }
      
      console.log(`📤 Sending push notification to ${expoPushTokens.length} devices via Expo...`);
      
      // Prepare messages for Expo Push API
      const messages = expoPushTokens.map(token => ({
        to: token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        priority: 'high',
        channelId: 'default',
      }));
      
      // Send to Expo Push Notification service
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });
      
      const result = await response.json();
      console.log(`📥 Expo API Response:`, JSON.stringify(result, null, 2));
      
      // Count successes and failures
      let successCount = 0;
      let failureCount = 0;
      
      if (result.data) {
        result.data.forEach((item, index) => {
          if (item.status === 'ok') {
            successCount++;
            console.log(`✅ Notification sent successfully to device ${index + 1}`);
          } else if (item.status === 'error') {
            failureCount++;
            console.error(`❌ Error sending to device ${index + 1}:`, item.message);
            console.error(`   Details:`, JSON.stringify(item.details));
          }
        });
      }
      
      console.log(`\n📊 Summary:`);
      console.log(`   ✅ Successfully sent: ${successCount}`);
      console.log(`   ❌ Failed to send: ${failureCount}`);
      
      return null;
    } catch (error) {
      console.error('❌ Error in sendNotification function:', error);
      return null;
    }
  });

/**
 * Trigger: When a match is created
 * Action: Send notification to all users
 */
exports.onMatchCreated = functions.firestore
  .document('matches/{matchId}')
  .onCreate(async (snap, context) => {
    try {
      const match = snap.data();
      const matchId = context.params.matchId;
      
      console.log('⚽ New match created:', matchId);
      
      // Create notification
      await admin.firestore().collection('notifications').add({
        title: '⚽ New Match!',
        body: `${match.homeTeam} vs ${match.awayTeam}`,
        data: {
          matchId: matchId,
          type: 'new_match',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        type: 'match',
      });
      
      console.log('✅ Notification created for new match');
      
      return null;
    } catch (error) {
      console.error('❌ Error in onMatchCreated:', error);
      return null;
    }
  });

/**
 * Trigger: When a team update is created
 * Action: Send notification to all users
 */
exports.onUpdateCreated = functions.firestore
  .document('updates/{updateId}')
  .onCreate(async (snap, context) => {
    try {
      const update = snap.data();
      const updateId = context.params.updateId;
      
      console.log('📢 New update created:', updateId);
      
      // Create notification
      await admin.firestore().collection('notifications').add({
        title: '📢 Team Update!',
        body: update.title || 'New update from Nkoroi FC',
        data: {
          updateId: updateId,
          type: 'team_update',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        type: 'update',
      });
      
      console.log('✅ Notification created for new update');
      
      return null;
    } catch (error) {
      console.error('❌ Error in onUpdateCreated:', error);
      return null;
    }
  });

console.log('🚀 Firebase Cloud Functions loaded successfully');
