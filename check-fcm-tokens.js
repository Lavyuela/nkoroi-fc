/**
 * Check if users have FCM tokens in Firestore
 * This will tell us if the app is properly registering for notifications
 */

const admin = require('firebase-admin');

// Initialize with application default credentials
admin.initializeApp({
  projectId: 'nkoroifc-9c964',
});

async function checkTokens() {
  try {
    console.log('🔍 Checking FCM tokens in Firestore...\n');
    
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    console.log(`📊 Total users: ${usersSnapshot.size}\n`);
    
    let tokensFound = 0;
    let noTokens = 0;
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const hasToken = !!userData.fcmToken;
      
      console.log(`👤 User: ${doc.id}`);
      console.log(`   Email: ${userData.email || 'N/A'}`);
      console.log(`   FCM Token: ${hasToken ? '✅ YES' : '❌ NO'}`);
      
      if (hasToken) {
        console.log(`   Token: ${userData.fcmToken.substring(0, 50)}...`);
        tokensFound++;
      } else {
        noTokens++;
      }
      console.log('');
    });
    
    console.log('═══════════════════════════════════════');
    console.log(`✅ Users with FCM tokens: ${tokensFound}`);
    console.log(`❌ Users without FCM tokens: ${noTokens}`);
    console.log('═══════════════════════════════════════\n');
    
    if (tokensFound === 0) {
      console.log('⚠️  PROBLEM: No FCM tokens found!');
      console.log('\n💡 SOLUTION:');
      console.log('   1. You need to install the NEW APK');
      console.log('   2. The old APK does not have FCM token code');
      console.log('   3. Build new APK from latest code');
      console.log('   4. Install on your phone');
      console.log('   5. Open app and grant notification permission');
    } else {
      console.log('✅ FCM tokens found! Push notifications should work.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTokens();
