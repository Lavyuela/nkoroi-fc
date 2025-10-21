/**
 * One-time script to subscribe all existing users to team_updates topic
 * Run this manually: node subscribeAllUsers.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function subscribeAllUsers() {
  try {
    console.log('🚀 Starting to subscribe all users to team_updates topic...\n');
    
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found');
      return;
    }
    
    console.log(`📊 Found ${usersSnapshot.size} users\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Process each user
    for (const doc of usersSnapshot.docs) {
      const userId = doc.id;
      const userData = doc.data();
      
      // Skip if no FCM token
      if (!userData.fcmToken) {
        console.log(`⏭️  Skipping user ${userId} - no FCM token`);
        skipCount++;
        continue;
      }
      
      // Skip if already subscribed
      const subscribedTopics = userData.subscribedToTopics || [];
      if (subscribedTopics.includes('team_updates')) {
        console.log(`✅ User ${userId} already subscribed`);
        skipCount++;
        continue;
      }
      
      try {
        // Subscribe to topic
        await admin.messaging().subscribeToTopic([userData.fcmToken], 'team_updates');
        
        // Update Firestore
        await doc.ref.update({
          subscribedToTopics: admin.firestore.FieldValue.arrayUnion('team_updates'),
          lastTopicSubscription: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`✅ Subscribed user ${userId} to team_updates`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error subscribing user ${userId}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully subscribed: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total users: ${usersSnapshot.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
subscribeAllUsers();
