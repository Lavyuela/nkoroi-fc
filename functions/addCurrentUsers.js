/**
 * Add all current Firebase Auth users to Firestore users collection
 * This ensures they show up in Active Users screen
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addCurrentUsers() {
  try {
    console.log('🚀 Adding current Firebase Auth users to Firestore...\n');

    // Get all users from Firebase Auth
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    console.log(`📊 Found ${users.length} users in Firebase Auth\n`);

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      try {
        const userId = user.uid;
        const userEmail = user.email;

        // Check if user already exists in Firestore
        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
          // Update existing user
          await db.collection('users').doc(userId).update({
            email: userEmail,
            lastActive: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`✅ Updated: ${userEmail}`);
          updated++;
        } else {
          // Create new user document
          await db.collection('users').doc(userId).set({
            email: userEmail,
            lastActive: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`➕ Added: ${userEmail}`);
          added++;
        }
      } catch (error) {
        console.error(`❌ Error processing user ${user.email}:`, error.message);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ➕ Added: ${added}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${users.length}`);
    console.log('\n✅ All users have been added to Firestore!');
    console.log('🔄 Refresh the Active Users screen to see them.');
    console.log('\n🌍 Nkoroi to the World 🌍\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addCurrentUsers();
