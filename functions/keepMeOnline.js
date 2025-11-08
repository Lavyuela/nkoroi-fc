/**
 * Keep a user showing as online by updating their activity every minute
 * Useful for testing Active Users screen before new APK is deployed
 * Press Ctrl+C to stop
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateActivity(userEmail) {
  try {
    // Find user by email
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    const userId = userRecord.uid;

    // Update lastActive to NOW
    await db.collection('users').doc(userId).set({
      email: userEmail,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    const now = new Date().toLocaleTimeString();
    console.log(`🟢 [${now}] Updated: ${userEmail} - ONLINE`);
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

async function keepOnline() {
  const userEmail = process.argv[2];
  
  if (!userEmail) {
    console.log('❌ Please provide user email as argument');
    console.log('Usage: node keepMeOnline.js your@email.com');
    process.exit(1);
  }

  console.log(`🚀 Keeping ${userEmail} online...`);
  console.log('🔄 Updating activity every 1 minute');
  console.log('⏹️  Press Ctrl+C to stop\n');

  // Update immediately
  await updateActivity(userEmail);

  // Update every 1 minute
  setInterval(async () => {
    await updateActivity(userEmail);
  }, 60 * 1000); // 1 minute
}

keepOnline();
