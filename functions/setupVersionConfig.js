/**
 * Setup version configuration in Firebase
 * Run this once to initialize the version tracking system
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupVersionConfig() {
  try {
    console.log('🚀 Setting up version configuration in Firebase...\n');

    // Create version config document
    await db.collection('app_config').doc('version').set({
      latest_version: '1.0.1',
      download_url: 'https://github.com/Lavyuela/nkoroi-fc/releases/latest/download/NkoroiFC.apk',
      update_message: '🎉 A new version of Nkoroi FC is available!\n\n✨ What\'s New:\n• Match result fix - Victory/Loss shows correctly\n• Active Users dashboard for super admins\n• Player performance analytics\n• Notification improvements\n\nUpdate now to get the latest features!',
      force_update: false,
      release_notes: [
        'Match result fix - Victory/Loss shows correctly for home/away matches',
        'Active Users dashboard - Super admins can view all users and activity',
        'Player performance analytics - Detailed stats and ratings',
        'Notification improvements - All server-side fixes active',
      ],
      min_supported_version: '1.0.0',
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Version configuration created successfully!\n');
    console.log('📋 Configuration Details:');
    console.log('   Latest Version: 1.0.1');
    console.log('   Download URL: https://github.com/Lavyuela/nkoroi-fc/releases/latest/download/NkoroiFC.apk');
    console.log('   Force Update: No');
    console.log('\n💡 To update the version in the future:');
    console.log('   1. Go to Firebase Console');
    console.log('   2. Firestore Database → app_config → version');
    console.log('   3. Update latest_version and download_url');
    console.log('   4. Optionally update update_message and release_notes');
    console.log('\n🌍 Nkoroi to the World 🌍\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up version config:', error);
    process.exit(1);
  }
}

setupVersionConfig();
