const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
try {
  admin.initializeApp({
    credential: admin.credential.cert(require('./firebaseConfig.js'))
  });
} catch (error) {
  // Already initialized
}

const db = admin.firestore();

async function sendTestNotification() {
  try {
    console.log('📬 Sending test notification via Firestore...');
    
    const notification = {
      title: 'Test Notification',
      body: 'This is a test notification from Firestore!',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      data: {
        type: 'test',
        message: 'Testing push notifications'
      }
    };
    
    const docRef = await db.collection('notifications').add(notification);
    
    console.log('✅ Notification sent successfully!');
    console.log('📄 Document ID:', docRef.id);
    console.log('');
    console.log('Check your phone - notification should appear!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    process.exit(1);
  }
}

sendTestNotification();
