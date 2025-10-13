// Send notification via Expo Push Notification Service
const fetch = require('node-fetch');

async function sendExpoPushNotification() {
  console.log('📱 Send Expo Push Notification');
  console.log('');
  console.log('First, I need your Expo Push Token.');
  console.log('');
  console.log('To get it:');
  console.log('1. Open the app on your phone');
  console.log('2. Look at the app logs (or use adb logcat)');
  console.log('3. Find a line that says: "Expo Push Token: ExponentPushToken[...]"');
  console.log('4. Copy that token');
  console.log('');
  console.log('Then paste it here and run this script again.');
  console.log('');
  console.log('OR test manually at: https://expo.dev/notifications');
  console.log('');
  
  // Example token (replace with actual token)
  const pushToken = 'ExponentPushToken[YOUR_TOKEN_HERE]';
  
  if (pushToken === 'ExponentPushToken[YOUR_TOKEN_HERE]') {
    console.log('⚠️ Please update the pushToken variable in this script with your actual token.');
    return;
  }
  
  const message = {
    to: pushToken,
    sound: 'default',
    title: 'Test from Expo Push Service',
    body: 'If you see this, Expo push notifications work! 🎉',
    data: { test: true },
    priority: 'high',
    channelId: 'default',
  };
  
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    const result = await response.json();
    console.log('✅ Notification sent!');
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendExpoPushNotification();
