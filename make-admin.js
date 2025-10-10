// Quick script to make an email an admin
// Run this with: node make-admin.js

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function makeAdmin(email) {
  try {
    // Get current admin list
    const adminUsers = await AsyncStorage.getItem('adminUsers');
    const admins = adminUsers ? JSON.parse(adminUsers) : [];
    
    // Add email if not already admin
    if (!admins.includes(email.toLowerCase())) {
      admins.push(email.toLowerCase());
      await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
      console.log(`✅ ${email} is now an admin!`);
      console.log(`Total admins: ${admins.length}`);
    } else {
      console.log(`ℹ️  ${email} is already an admin`);
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

// Replace with your email
const emailToMakeAdmin = 'your-email@example.com';

makeAdmin(emailToMakeAdmin);
