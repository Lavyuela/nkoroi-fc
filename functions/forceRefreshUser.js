/**
 * Force refresh user's FCM token subscription
 * This clears their old subscription and forces re-subscription
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function forceRefreshUser(userId) {
  try {
    console.log(`🔄 Force refreshing user: ${userId}\n`);
    
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('❌ User document does not exist');
      process.exit(1);
    }
    
    const userData = userDoc.data();
    
    if (!userData.fcmToken) {
      console.log('❌ User has no FCM token - they need to open the app');
      process.exit(1);
    }
    
    console.log('📱 User:', userData.email || userId);
    console.log('🔑 Current FCM Token:', userData.fcmToken.substring(0, 50) + '...\n');
    
    // Step 1: Unsubscribe from topic
    console.log('1️⃣ Unsubscribing from team_updates topic...');
    try {
      await admin.messaging().unsubscribeFromTopic([userData.fcmToken], 'team_updates');
      console.log('✅ Unsubscribed successfully');
    } catch (error) {
      console.log('⚠️  Unsubscribe error (might not have been subscribed):', error.message);
    }
    
    // Step 2: Wait 2 seconds
    console.log('\n2️⃣ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Re-subscribe to topic
    console.log('\n3️⃣ Re-subscribing to team_updates topic...');
    await admin.messaging().subscribeToTopic([userData.fcmToken], 'team_updates');
    console.log('✅ Re-subscribed successfully');
    
    // Step 4: Update Firestore
    console.log('\n4️⃣ Updating Firestore...');
    await db.collection('users').doc(userId).update({
      subscribedToTopics: ['team_updates'],
      lastTopicSubscription: admin.firestore.FieldValue.serverTimestamp(),
      lastRefresh: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Firestore updated');
    
    // Step 5: Send test notification
    console.log('\n5️⃣ Sending test notification...');
    
    const message = {
      notification: {
        title: '✅ Notifications Fixed!',
        body: 'Your notifications have been refreshed. You should now receive all updates!',
      },
      data: {
        type: 'refresh_test',
        timestamp: Date.now().toString(),
        channelId: 'default',
      },
      token: userData.fcmToken,
      android: {
        priority: 'high',
        ttl: 0,
        notification: {
          channelId: 'default',
          sound: 'default',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
    };
    
    const response = await admin.messaging().send(message);
    console.log('✅ Test notification sent!');
    console.log('📨 Message ID:', response);
    
    console.log('\n✅ User refresh complete!');
    console.log('📱 User should receive test notification now');
    console.log('💡 If still not receiving:');
    console.log('   - Check device notification settings');
    console.log('   - Disable battery optimization for Nkoroi FC app');
    console.log('   - Ensure app has notification permission');
    console.log('   - Try force-stopping and reopening the app');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2] || 'sQA4GmZlGeOzo2L46vhXpgShk2w2';
forceRefreshUser(userId);
