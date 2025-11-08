/**
 * Manually update a specific user's activity to show as online
 * Use this to test the Active Users screen before the new APK is deployed
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateUserActivity() {
  try {
    // Get the email from command line argument
    const userEmail = process.argv[2];
    
    if (!userEmail) {
      console.log('❌ Please provide user email as argument');
      console.log('Usage: node updateMyActivity.js your@email.com');
      process.exit(1);
    }

    console.log(`🔍 Looking for user: ${userEmail}\n`);

    // Find user by email in Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    const userId = userRecord.uid;

    console.log(`✅ Found user: ${userEmail}`);
    console.log(`   User ID: ${userId}\n`);

    // Update user's lastActive timestamp to NOW
    await db.collection('users').doc(userId).set({
      email: userEmail,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log('✅ Updated lastActive timestamp to NOW');
    console.log('🟢 User should now show as ONLINE (green dot)');
    console.log('\n🔄 Refresh the Active Users screen to see the change!');
    console.log('\n🌍 Nkoroi to the World 🌍\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateUserActivity();
