/**
 * Firebase Cloud Functions for Nkoroi FC
 * Simple notification system - no push notifications needed
 * Notifications are shown via Firestore listeners when app is open
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Trigger: When a new notification is created in Firestore
 * Action: Just log it - notifications are shown by Firestore listeners in the app
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
      console.log('✅ Notification will be shown to users with app open');
      
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
