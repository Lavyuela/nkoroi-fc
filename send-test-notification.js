// Simple script to send a test notification to Firestore
const admin = require('firebase-admin');
const serviceAccount = require('./android/app/google-services.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_info.project_id,
      clientEmail: "firebase-adminsdk-fbsvc@nkoroifc-9c964.iam.gserviceaccount.com",
      privateKey: require('C:/Users/Admin/Downloads/nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json').private_key
    }),
    databaseURL: serviceAccount.project_info.firebase_url
  });
}

const db = admin.firestore();

async function sendNotification() {
  console.log('📬 Sending test notification...');
  console.log('⏰ Current time:', new Date().toISOString());
  console.log('');
  console.log('IMPORTANT: Make sure the app is OPEN on your phone!');
  console.log('');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  console.log('Sending in 3...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Sending in 2...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Sending in 1...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const notification = {
      title: 'Test Notification ' + Date.now(),
      body: 'If you see this, notifications are working! 🎉',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      data: {
        type: 'test',
        timestamp: Date.now()
      }
    };
    
    const docRef = await db.collection('notifications').add(notification);
    
    console.log('');
    console.log('✅ Notification sent!');
    console.log('📄 Document ID:', docRef.id);
    console.log('');
    console.log('Check your phone NOW! 📱');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

sendNotification();
