const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('========================================');
console.log('Automated FCM V1 Credentials Upload');
console.log('========================================\n');

// Path to the service account JSON file
const serviceAccountPath = 'C:\\Users\\Admin\\Downloads\\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json';

// Check if file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: Service account JSON file not found at:');
  console.error(serviceAccountPath);
  console.error('\nPlease make sure the file is in your Downloads folder.');
  process.exit(1);
}

console.log('✓ Found service account JSON file');
console.log('✓ File location:', serviceAccountPath);
console.log('\nUploading FCM V1 credentials to EAS...\n');

try {
  // Use EAS CLI to upload the credentials non-interactively
  const command = `npx eas-cli credentials:configure-fcm --platform android --service-account-key-path "${serviceAccountPath}" --non-interactive`;
  
  console.log('Running command:', command);
  console.log('');
  
  const output = execSync(command, {
    cwd: process.cwd(),
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  console.log('\n========================================');
  console.log('✅ FCM V1 credentials uploaded successfully!');
  console.log('========================================\n');
  console.log('Next steps:');
  console.log('1. Run: npx expo start');
  console.log('2. Test notifications on your phone');
  console.log('3. Build APK: npx eas build -p android --profile preview\n');
  
} catch (error) {
  console.error('\n❌ Upload failed. Trying alternative method...\n');
  
  // Alternative: Try using the interactive command with expect-like behavior
  console.log('Please run this command manually and follow the prompts:');
  console.log('\nnpx eas credentials\n');
  console.log('When prompted:');
  console.log('  1. Select platform: Android');
  console.log('  2. Select: "Set up push notification credentials"');
  console.log('  3. Enter path:', serviceAccountPath);
  console.log('');
}
