/**
 * Check specific user's notification subscription status
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkUser(userId) {
  try {
    console.log(`🔍 Checking user: ${userId}\n`);
    
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('❌ User document does not exist');
      process.exit(1);
    }
    
    const userData = userDoc.data();
    
    console.log('📊 User Data:');
    console.log('─────────────────────────────────────');
    console.log('FCM Token:', userData.fcmToken ? '✅ EXISTS' : '❌ MISSING');
    if (userData.fcmToken) {
      console.log('Token (first 50 chars):', userData.fcmToken.substring(0, 50) + '...');
    }
    console.log('Subscribed Topics:', userData.subscribedToTopics || '❌ NONE');
    console.log('Last Subscription:', userData.lastTopicSubscription?.toDate() || '❌ NEVER');
    console.log('Email:', userData.email || 'N/A');
    console.log('Role:', userData.role || 'N/A');
    console.log('─────────────────────────────────────\n');
    
    // Check if subscribed to team_updates
    const subscribedTopics = userData.subscribedToTopics || [];
    const isSubscribed = subscribedTopics.includes('team_updates');
    
    if (isSubscribed) {
      console.log('✅ User IS subscribed to team_updates topic');
    } else {
      console.log('❌ User is NOT subscribed to team_updates topic');
      
      if (userData.fcmToken) {
        console.log('\n🔧 Attempting to subscribe now...');
        
        try {
          await admin.messaging().subscribeToTopic([userData.fcmToken], 'team_updates');
          
          await db.collection('users').doc(userId).update({
            subscribedToTopics: admin.firestore.FieldValue.arrayUnion('team_updates'),
            lastTopicSubscription: admin.firestore.FieldValue.serverTimestamp(),
          });
          
          console.log('✅ Successfully subscribed user to team_updates!');
        } catch (error) {
          console.error('❌ Failed to subscribe:', error.message);
        }
      } else {
        console.log('\n⚠️  Cannot subscribe - no FCM token');
        console.log('💡 User needs to open the app to generate FCM token');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get userId from command line argument
const userId = process.argv[2] || 'sQA4GmZlGeOzo2L46vhXpgShk2w2';
checkUser(userId);
