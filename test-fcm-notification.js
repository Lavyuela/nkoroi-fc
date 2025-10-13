// Test Firebase Cloud Messaging notification
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with service account
const serviceAccount = require(path.join(__dirname, 'C:\\Users\\Admin\\Downloads\\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function sendFCMNotification() {
  console.log('========================================');
  console.log('Firebase Cloud Messaging Test');
  console.log('========================================\n');
  
  console.log('📱 IMPORTANT: You need the FCM token from your device!');
  console.log('');
  console.log('To get your FCM token:');
  console.log('1. Install and open the app on your phone');
  console.log('2. Look for this in the logs: "🔑 FCM Token: ..."');
  console.log('3. Copy that token');
  console.log('4. Paste it below in the fcmToken variable');
  console.log('');
  
  // REPLACE THIS WITH YOUR ACTUAL FCM TOKEN
  const fcmToken = 'PASTE_YOUR_FCM_TOKEN_HERE';
  
  if (fcmToken === 'PASTE_YOUR_FCM_TOKEN_HERE') {
    console.log('❌ Error: Please update the fcmToken variable with your actual FCM token!');
    console.log('');
    console.log('Run the app, find the token in logs, and paste it in this script.');
    process.exit(1);
  }
  
  console.log('📤 Sending notification to FCM token...');
  console.log('Token:', fcmToken.substring(0, 20) + '...');
  console.log('');
  
  const message = {
    notification: {
      title: 'Test from Firebase Messaging! 🎉',
      body: 'If you see this, FCM notifications are working perfectly!',
    },
    data: {
      type: 'test',
      timestamp: Date.now().toString(),
      message: 'This is test data'
    },
    token: fcmToken,
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        sound: 'default',
        priority: 'high',
      }
    }
  };
  
  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully!');
    console.log('📄 Message ID:', response);
    console.log('');
    console.log('🎉 Check your phone - notification should appear now!');
    console.log('');
    console.log('If you see the notification, FCM is working perfectly!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending notification:', error.message);
    console.error('');
    console.error('Common issues:');
    console.error('- Invalid FCM token (make sure you copied it correctly)');
    console.error('- App not installed or token expired');
    console.error('- Firebase project mismatch');
    process.exit(1);
  }
}

sendFCMNotification();
