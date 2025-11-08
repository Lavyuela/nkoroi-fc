/**
 * Update all super admins' activity to show as online
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateSuperAdmins() {
  try {
    console.log('🚀 Updating all super admins to show as online...\n');

    // Get all super admins from roles collection
    const rolesSnapshot = await db.collection('roles')
      .where('role', '==', 'super_admin')
      .get();

    if (rolesSnapshot.empty) {
      console.log('❌ No super admins found');
      process.exit(1);
    }

    console.log(`📊 Found ${rolesSnapshot.size} super admin(s)\n`);

    let updated = 0;

    for (const doc of rolesSnapshot.docs) {
      const userId = doc.id;
      
      try {
        // Get user email from Auth
        const userRecord = await admin.auth().getUser(userId);
        const userEmail = userRecord.email;

        // Update lastActive to NOW
        await db.collection('users').doc(userId).set({
          email: userEmail,
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        console.log(`✅ Updated: ${userEmail} (Super Admin)`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating user ${userId}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated} super admin(s)`);
    console.log(`   🟢 All super admins should now show as ONLINE`);
    console.log('\n🔄 Refresh the Active Users screen to see the changes!');
    console.log('\n🌍 Nkoroi to the World 🌍\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateSuperAdmins();
