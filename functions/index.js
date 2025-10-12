/**
 * Firebase Cloud Functions for Nkoroi FC
 * Sends push notifications using Firebase Cloud Messaging
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

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
      
      // Get all users with FCM tokens
      const usersSnapshot = await admin.firestore().collection('users').get();
      const fcmTokens = [];
      
      console.log(`📊 Checking ${usersSnapshot.size} users for FCM tokens...`);
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.fcmToken) {
          fcmTokens.push(userData.fcmToken);
          console.log(`✅ Found FCM token for user ${doc.id}`);
        } else {
          console.log(`⚠️ User ${doc.id} has no FCM token`);
        }
      });
      
      if (fcmTokens.length === 0) {
        console.log('❌ No FCM tokens found in database');
        console.log('💡 Users need to open the app to register for notifications');
        return null;
      }
      
      console.log(`📤 Sending FCM notification to ${fcmTokens.length} devices...`);
      
      // Prepare FCM message payload
      const payload = {
        notification: {
          title: notification.title,
          body: notification.body,
          sound: 'default',
        },
        data: notification.data || {},
      };
      
      // Send to all tokens using multicast
      const response = await admin.messaging().sendToDevice(fcmTokens, payload, {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 24 hours
      });
      
      console.log(`✅ Successfully sent: ${response.successCount}`);
      console.log(`❌ Failed to send: ${response.failureCount}`);
      
      // Log detailed results
      if (response.results) {
        response.results.forEach((result, index) => {
          if (result.error) {
            console.error(`❌ Error sending to token ${index}:`, result.error.code, result.error.message);
            // Remove invalid tokens
            if (result.error.code === 'messaging/invalid-registration-token' ||
                result.error.code === 'messaging/registration-token-not-registered') {
              console.log(`🗑️ Removing invalid token ${index}`);
            }
          } else {
            console.log(`✅ Message sent successfully to token ${index}`);
          }
        });
      }
      
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
