/**
 * Test pre-match announcement and lineup notifications
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function testPreMatchNotifications() {
  try {
    console.log('🧪 Testing Pre-Match Notifications\n');
    
    // Test 1: Pre-Match Announcement
    console.log('1️⃣ Sending Pre-Match Announcement notification...');
    
    const announcementMessage = {
      notification: {
        title: '📢 Match Announcement!',
        body: 'Nkoroi FC vs Test Team - Tomorrow at 3:00 PM',
      },
      data: {
        type: 'pre_match_announcement',
        timestamp: Date.now().toString(),
        channelId: 'match_updates',
      },
      topic: 'team_updates',
      android: {
        priority: 'high',
        ttl: 0,
        notification: {
          channelId: 'match_updates',
          sound: 'default',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
    };
    
    const announcementResponse = await admin.messaging().send(announcementMessage);
    console.log('✅ Pre-Match Announcement sent!');
    console.log('📨 Message ID:', announcementResponse);
    
    // Wait 3 seconds
    console.log('\n⏳ Waiting 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Lineup Announcement
    console.log('2️⃣ Sending Lineup Announcement notification...');
    
    const lineupMessage = {
      notification: {
        title: '⚽ Starting Lineup Announced!',
        body: 'Check out the lineup for Nkoroi FC vs Test Team',
      },
      data: {
        type: 'lineup_announcement',
        timestamp: Date.now().toString(),
        channelId: 'match_updates',
      },
      topic: 'team_updates',
      android: {
        priority: 'high',
        ttl: 0,
        notification: {
          channelId: 'match_updates',
          sound: 'default',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
    };
    
    const lineupResponse = await admin.messaging().send(lineupMessage);
    console.log('✅ Lineup Announcement sent!');
    console.log('📨 Message ID:', lineupResponse);
    
    console.log('\n✅ Both notifications sent successfully!');
    console.log('📱 Check all subscribed devices - should receive:');
    console.log('   1. Pre-Match Announcement notification');
    console.log('   2. Lineup Announcement notification (3 seconds later)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testPreMatchNotifications();
