/**
 * Test script to verify push notifications work
 * Run: node test-notification.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./android/app/google-services.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_info.project_id,
    clientEmail: `firebase-adminsdk@${serviceAccount.project_info.project_id}.iam.gserviceaccount.com`,
    privateKey: process.env.FIREBASE_PRIVATE_KEY || 'REPLACE_WITH_PRIVATE_KEY',
  }),
  databaseURL: serviceAccount.project_info.firebase_url,
});

async function testNotification() {
  try {
    console.log('🧪 Testing Push Notifications...\n');
    
    // Get all users with FCM tokens
    const usersSnapshot = await admin.firestore().collection('users').get();
    const tokens = [];
    
    console.log(`📊 Found ${usersSnapshot.size} users in database`);
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      console.log(`\n👤 User: ${doc.id}`);
      console.log(`   Email: ${userData.email || 'N/A'}`);
      console.log(`   FCM Token: ${userData.fcmToken ? '✅ Yes' : '❌ No'}`);
      
      if (userData.fcmToken) {
        tokens.push(userData.fcmToken);
      }
    });
    
    if (tokens.length === 0) {
      console.log('\n❌ ERROR: No FCM tokens found!');
      console.log('\n💡 Solution:');
      console.log('   1. Open the app on your phone');
      console.log('   2. Grant notification permission');
      console.log('   3. Wait 5 seconds');
      console.log('   4. Run this test again');
      process.exit(1);
    }
    
    console.log(`\n✅ Found ${tokens.length} device(s) with FCM tokens`);
    console.log('\n📤 Sending test notification...');
    
    // Send test notification
    const message = {
      notification: {
        title: '🧪 Test Notification',
        body: 'If you see this, push notifications are working!',
        sound: 'default',
      },
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
      },
      priority: 'high',
    };
    
    const response = await admin.messaging().sendToDevice(tokens, message);
    
    console.log(`\n✅ Successfully sent: ${response.successCount}`);
    console.log(`❌ Failed to send: ${response.failureCount}`);
    
    if (response.failureCount > 0) {
      console.log('\n❌ Errors:');
      response.results.forEach((result, index) => {
        if (result.error) {
          console.log(`   Token ${index + 1}: ${result.error.message}`);
        }
      });
    }
    
    if (response.successCount > 0) {
      console.log('\n🎉 SUCCESS! Check your phone for the notification!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

testNotification();
