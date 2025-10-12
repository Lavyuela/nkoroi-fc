/**
 * Direct test - Creates a notification in Firestore
 * This will trigger the Cloud Function
 */

const admin = require('firebase-admin');

// Initialize
admin.initializeApp({
  projectId: 'nkoroifc-9c964',
});

async function testPush() {
  try {
    console.log('🧪 Creating test notification in Firestore...\n');
    
    // Create notification (this triggers the Cloud Function)
    const notificationRef = await admin.firestore().collection('notifications').add({
      title: '🧪 TEST NOTIFICATION',
      body: 'If you see this, push notifications are WORKING!',
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'broadcast',
    });
    
    console.log(`✅ Notification created: ${notificationRef.id}`);
    console.log('\n📋 What should happen:');
    console.log('1. Cloud Function "sendNotification" triggers');
    console.log('2. Function gets all FCM tokens from users collection');
    console.log('3. Function sends FCM message to all devices');
    console.log('4. You receive notification on your phone!');
    console.log('\n⏳ Wait 5-10 seconds...');
    console.log('\n📊 Check logs with: firebase functions:log');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPush();
