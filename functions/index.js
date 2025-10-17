/**
 * Firebase Cloud Functions for Nkoroi FC
 * Push notification system using FCM topics
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Helper function to send FCM notification to a topic
 */
async function sendTopicNotification(topic, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        ...data,
        timestamp: Date.now().toString(),
      },
      topic: topic,
      android: {
        priority: 'high',
        notification: {
          channelId: data.channelId || 'default',
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Successfully sent message to topic:', topic, response);
    return response;
  } catch (error) {
    console.error('❌ Error sending message to topic:', topic, error);
    throw error;
  }
}

/**
 * Trigger: When a match is created
 * Action: Send push notification to team_updates topic
 */
exports.onMatchCreated = functions.firestore
  .document('matches/{matchId}')
  .onCreate(async (snap, context) => {
    try {
      const match = snap.data();
      const matchId = context.params.matchId;
      
      console.log('⚽ New match created:', matchId);
      
      const title = '⚽ New Match Scheduled!';
      const body = `${match.homeTeam} vs ${match.awayTeam}`;
      
      // Send push notification to topic
      await sendTopicNotification('team_updates', title, body, {
        matchId: matchId,
        type: 'new_match',
        channelId: 'match_updates',
      });
      
      // Also create Firestore notification for in-app display
      await admin.firestore().collection('notifications').add({
        title: title,
        body: body,
        data: {
          matchId: matchId,
          type: 'new_match',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        type: 'match',
      });
      
      console.log('✅ Match notification sent to topic and saved to Firestore');
      
      return null;
    } catch (error) {
      console.error('❌ Error in onMatchCreated:', error);
      return null;
    }
  });

/**
 * Trigger: When a match is updated (e.g., score changes)
 * Action: Send push notification to team_updates topic
 */
exports.onMatchUpdated = functions.firestore
  .document('matches/{matchId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();
      const matchId = context.params.matchId;
      
      // Check if score changed
      if (before.homeScore !== after.homeScore || before.awayScore !== after.awayScore) {
        console.log('🔥 Match score updated:', matchId);
        
        const title = `🔥 GOAL! ${after.homeTeam} ${after.homeScore} - ${after.awayScore} ${after.awayTeam}`;
        const body = `Score updated!`;
        
        // Send push notification to topic
        await sendTopicNotification('team_updates', title, body, {
          matchId: matchId,
          type: 'score_update',
          channelId: 'score_updates',
          homeScore: after.homeScore?.toString() || '0',
          awayScore: after.awayScore?.toString() || '0',
        });
        
        // Also create Firestore notification
        await admin.firestore().collection('notifications').add({
          title: title,
          body: body,
          data: {
            matchId: matchId,
            type: 'score_update',
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          read: false,
          type: 'match',
        });
        
        console.log('✅ Score update notification sent');
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error in onMatchUpdated:', error);
      return null;
    }
  });

/**
 * Trigger: When a team update is created
 * Action: Send push notification to team_updates topic
 */
exports.onUpdateCreated = functions.firestore
  .document('updates/{updateId}')
  .onCreate(async (snap, context) => {
    try {
      const update = snap.data();
      const updateId = context.params.updateId;
      
      console.log('📢 New update created:', updateId);
      
      const title = '📢 Team Update!';
      const body = update.title || update.content || 'New update from Nkoroi FC';
      
      // Send push notification to topic
      await sendTopicNotification('team_updates', title, body, {
        updateId: updateId,
        type: 'team_update',
        channelId: 'default',
      });
      
      // Also create Firestore notification
      await admin.firestore().collection('notifications').add({
        title: title,
        body: body,
        data: {
          updateId: updateId,
          type: 'team_update',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        type: 'update',
      });
      
      console.log('✅ Team update notification sent to topic and saved to Firestore');
      
      return null;
    } catch (error) {
      console.error('❌ Error in onUpdateCreated:', error);
      return null;
    }
  });

/**
 * HTTP Callable Function: Send custom notification to topic
 * Usage: Call from admin panel or app
 */
exports.sendCustomNotification = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated and is admin
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    // Get user role from Firestore
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    const userRole = userDoc.data()?.role;

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can send notifications');
    }

    const { title, body, topic = 'team_updates', channelId = 'default' } = data;

    if (!title || !body) {
      throw new functions.https.HttpsError('invalid-argument', 'Title and body are required');
    }

    console.log(`📤 Sending custom notification to topic: ${topic}`);

    // Send push notification
    const response = await sendTopicNotification(topic, title, body, {
      type: 'custom',
      channelId: channelId,
    });

    // Also create Firestore notification
    await admin.firestore().collection('notifications').add({
      title: title,
      body: body,
      data: {
        type: 'custom',
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'custom',
    });

    console.log('✅ Custom notification sent successfully');

    return {
      success: true,
      messageId: response,
      message: 'Notification sent successfully',
    };
  } catch (error) {
    console.error('❌ Error in sendCustomNotification:', error);
    throw error;
  }
});

/**
 * HTTP Function: Test endpoint to send a test notification
 * Usage: GET request to function URL
 */
exports.sendTestNotification = functions.https.onRequest(async (req, res) => {
  try {
    console.log('🧪 Sending test notification...');

    const title = '⚽ Test Notification';
    const body = 'This is a test notification from Nkoroi FC Cloud Functions!';

    await sendTopicNotification('team_updates', title, body, {
      type: 'test',
      channelId: 'default',
    });

    res.status(200).json({
      success: true,
      message: 'Test notification sent to team_updates topic',
    });
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

console.log('🚀 Firebase Cloud Functions loaded successfully');
