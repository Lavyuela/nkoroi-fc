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
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      topic: topic,
      android: {
        priority: 'high',
        ttl: 0, // Immediate delivery
        notification: {
          channelId: data.channelId || 'default',
          sound: 'default',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      apns: {
        headers: {
          'apns-priority': '10', // Immediate delivery
        },
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true,
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
      
      console.log('✅ New match notification sent');
      
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
        
        // Determine which team scored
        const homeScored = after.homeScore > before.homeScore;
        const awayScored = after.awayScore > before.awayScore;
        const scoringTeam = homeScored ? after.homeTeam : after.awayTeam;
        
        // Check if scoring team is Nkoroi FC
        const isNkoroiFC = scoringTeam.toLowerCase().includes('nkoroi');
        
        if (isNkoroiFC) {
          console.log('⏭️ Nkoroi FC scored - skipping notification, waiting for player selection');
          // For Nkoroi FC: Wait for onMatchEventAdded (after player selection)
        } else {
          console.log('⚡ Opponent scored - sending immediate notification');
          // For opponent: Send notification immediately (no player selection)
          const minute = after.currentMinute || 0;
          const title = `🔥 GOAL! ${after.homeTeam} ${after.homeScore} - ${after.awayScore} ${after.awayTeam}`;
          const body = `${minute}' ⚽ ${scoringTeam} scores!`;
          
          await sendTopicNotification('team_updates', title, body, {
            matchId: matchId,
            type: 'score_update',
            channelId: 'score_updates',
            homeScore: after.homeScore?.toString() || '0',
            awayScore: after.awayScore?.toString() || '0',
          });
          
          console.log('✅ Opponent goal notification sent immediately');
        }
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
    // Check if user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    console.log('📨 Custom notification request from user:', context.auth.uid);

    // Verify user is admin or super_admin
    try {
      // Check roles collection first (primary source)
      const roleDoc = await admin.firestore().collection('roles').doc(context.auth.uid).get();
      
      if (roleDoc.exists) {
        const roleData = roleDoc.data();
        const userRole = roleData?.role;
        
        console.log('✅ User role from roles collection:', userRole);
        
        if (userRole !== 'admin' && userRole !== 'super_admin') {
          throw new functions.https.HttpsError('permission-denied', 'Only admins can send notifications. Your role: ' + userRole);
        }
      } else {
        // Fallback: check users collection
        const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
        
        if (!userDoc.exists) {
          console.warn('⚠️ No role or user document found, allowing notification (backward compatibility)');
        } else {
          const userData = userDoc.data();
          const isAdmin = userData?.isAdmin === true;
          const isSuperAdmin = userData?.isSuperAdmin === true;
          
          console.log('User admin status from users collection:', { isAdmin, isSuperAdmin });
          
          if (!isAdmin && !isSuperAdmin) {
            throw new functions.https.HttpsError('permission-denied', 'Only admins can send notifications');
          }
        }
      }
    } catch (error) {
      if (error.code === 'permission-denied') {
        throw error;
      }
      // If there's any other error checking role, log it but continue
      console.warn('⚠️ Error checking user role, allowing notification:', error);
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

    console.log('✅ Custom notification sent successfully to topic');
    console.log('📤 Response:', response);

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

/**
 * Trigger: When admin creates notification in adminNotifications collection
 * Action: Send push notification to topic
 */
exports.onAdminNotificationCreated = functions.firestore
  .document('adminNotifications/{notificationId}')
  .onCreate(async (snap, context) => {
    try {
      const notification = snap.data();
      const notificationId = context.params.notificationId;
      
      console.log('📢 Admin notification created:', notificationId);
      
      const title = notification.title || 'Nkoroi FC';
      const body = notification.body || 'New notification';
      const topic = notification.topic || 'team_updates';
      
      // Send push notification to topic
      await sendTopicNotification(topic, title, body, {
        type: 'admin_custom',
        channelId: 'default',
      });
      
      // Mark as sent
      await snap.ref.update({
        sent: true,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      // Also create in notifications collection for in-app display
      await admin.firestore().collection('notifications').add({
        title: title,
        body: body,
        data: {
          type: 'admin_custom',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        type: 'custom',
      });
      
      console.log('✅ Admin notification sent successfully');
      
      return null;
    } catch (error) {
      console.error('❌ Error in onAdminNotificationCreated:', error);
      return null;
    }
  });

/**
 * Trigger: When a match event is added (substitution, corner, etc.)
 * Action: Send push notification for the event
 * Note: Events are stored in the events array of the match document
 */
exports.onMatchEventAdded = functions.firestore
  .document('matches/{matchId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();
      const matchId = context.params.matchId;
      
      // Check if events array changed
      const beforeEvents = before.events || [];
      const afterEvents = after.events || [];
      
      if (afterEvents.length <= beforeEvents.length) {
        return null; // No new event added
      }
      
      // Get the newly added event (last one in array)
      const newEvent = afterEvents[afterEvents.length - 1];
      
      console.log('⚽ New match event detected:', newEvent.type, 'at', newEvent.minute || 0, 'minute');
      
      const match = after;
      const minute = newEvent.minute || match.currentMinute || 0;
      
      let title = '';
      let body = '';
      let emoji = '';
      
      // Format notification based on event type
      switch (newEvent.type) {
        case 'goal':
          // Skip if no player name (opponent goal already handled by onMatchUpdated)
          if (!newEvent.playerName) {
            console.log('⏭️ Goal without player name, already notified by onMatchUpdated');
            return null;
          }
          emoji = '⚽';
          title = `🔥 GOAL! ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}`;
          body = `${minute}' ${emoji} ${newEvent.playerName} scores!`;
          break;
        case 'yellow_card':
          emoji = '🟨';
          title = `${minute}' ${emoji} Yellow Card`;
          body = newEvent.description || `Yellow card in ${match.homeTeam} vs ${match.awayTeam}`;
          break;
        case 'red_card':
          emoji = '🟥';
          title = `${minute}' ${emoji} Red Card!`;
          body = newEvent.description || `Red card! Player sent off in ${match.homeTeam} vs ${match.awayTeam}`;
          break;
        case 'substitution':
          emoji = '🔄';
          title = `${minute}' ${emoji} Substitution`;
          body = newEvent.description || `Substitution in ${match.homeTeam} vs ${match.awayTeam}`;
          break;
        case 'corner':
          emoji = '🚩';
          title = `${minute}' ${emoji} Corner Kick`;
          body = newEvent.description || `Corner kick for ${newEvent.team}`;
          break;
        case 'free_kick':
          emoji = '⚽';
          title = `${minute}' ${emoji} Free Kick`;
          body = newEvent.description || `Free kick for ${newEvent.team}`;
          break;
        case 'penalty':
          emoji = '🎯';
          title = `${minute}' ${emoji} Penalty!`;
          body = newEvent.description || `Penalty awarded to ${newEvent.team}`;
          break;
        case 'offside':
          emoji = '🚫';
          title = `${minute}' ${emoji} Offside`;
          body = newEvent.description || `Offside called`;
          break;
        case 'injury':
          emoji = '🏥';
          title = `${minute}' ${emoji} Injury`;
          body = newEvent.description || `Player injury in ${match.homeTeam} vs ${match.awayTeam}`;
          break;
        case 'halftime':
          emoji = '⏸️';
          title = `${emoji} Half Time`;
          body = newEvent.description || `Half time: ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}`;
          break;
        default:
          // For any other event types
          title = `${minute}' ⚽ Match Event`;
          body = newEvent.description || `Event in ${match.homeTeam} vs ${match.awayTeam}`;
      }
      
      // Send push notification to topic
      await sendTopicNotification('team_updates', title, body, {
        matchId: matchId,
        type: `match_event_${newEvent.type}`,
        channelId: 'match_updates',
        eventType: newEvent.type,
      });
      
      console.log(`✅ ${newEvent.type} notification sent`);
      
      // NOTE: We don't update the document here to avoid triggering this function again
      // The check at the beginning (afterEvents.length <= beforeEvents.length) prevents duplicates
      
      return null;
    } catch (error) {
      console.error('❌ Error in onMatchEventAdded:', error);
      return null;
    }
  });

console.log('🚀 Firebase Cloud Functions loaded successfully');
