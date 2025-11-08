/**
 * Send test notification to specific user
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function sendTestNotification(userId) {
  try {
    console.log(`🔔 Sending test notification to user: ${userId}\n`);
    
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('❌ User document does not exist');
      process.exit(1);
    }
    
    const userData = userDoc.data();
    
    if (!userData.fcmToken) {
      console.log('❌ User has no FCM token');
      process.exit(1);
    }
    
    console.log('📱 User:', userData.email || userId);
    console.log('🔑 FCM Token:', userData.fcmToken.substring(0, 50) + '...\n');
    
    // Send notification directly to token
    console.log('📤 Sending notification to token...');
    
    const message = {
      notification: {
        title: '🧪 Test Notification',
        body: `This is a direct test to ${userData.email || 'you'}. If you see this, notifications are working!`,
      },
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
        channelId: 'default',
      },
      token: userData.fcmToken,
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
          priority: 'high',
        },
      },
    };
    
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully!');
    console.log('📨 Message ID:', response);
    
    // Also send to topic
    console.log('\n📤 Sending notification to team_updates topic...');
    
    const topicMessage = {
      notification: {
        title: '🧪 Topic Test Notification',
        body: 'This is sent to ALL users subscribed to team_updates topic',
      },
      data: {
        type: 'test_topic',
        timestamp: Date.now().toString(),
        channelId: 'default',
      },
      topic: 'team_updates',
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
          priority: 'high',
        },
      },
    };
    
    const topicResponse = await admin.messaging().send(topicMessage);
    console.log('✅ Topic notification sent successfully!');
    console.log('📨 Message ID:', topicResponse);
    
    console.log('\n✅ Both notifications sent!');
    console.log('📱 Check the device now - you should receive 2 notifications:');
    console.log('   1. Direct test notification');
    console.log('   2. Topic test notification');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2] || 'sQA4GmZlGeOzo2L46vhXpgShk2w2';
sendTestNotification(userId);
