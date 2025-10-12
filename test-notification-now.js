/**
 * Create a test notification directly in Firestore
 * This will test if the app's Firestore listener is working
 */

const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'nkoroifc-9c964',
});

async function createTestNotification() {
  try {
    console.log('🧪 Creating test notification...\n');
    
    const notificationRef = await admin.firestore().collection('notifications').add({
      title: '🧪 TEST - App Open?',
      body: 'If you see this, the app is listening to Firestore!',
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'broadcast',
    });
    
    console.log(`✅ Test notification created: ${notificationRef.id}`);
    console.log('\n📱 What should happen:');
    console.log('   1. If app is OPEN: You see notification immediately');
    console.log('   2. If app is CLOSED: Nothing happens (expected)');
    console.log('\n⏰ Wait 3 seconds and check your phone...\n');
    
    setTimeout(() => {
      console.log('Did you see the notification?');
      console.log('   ✅ YES = App is working, Firestore listener is active');
      console.log('   ❌ NO = App is not listening OR permission not granted');
      process.exit(0);
    }, 3000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestNotification();
