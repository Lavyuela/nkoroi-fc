// Quick fix script to ensure ivy.waliaula@gmail.com is Super Admin
// Run this with: node fix-ivy-superadmin.js

const AsyncStorage = require('@react-native-async-storage/async-storage');

async function fixSuperAdmin() {
  try {
    console.log('🔧 Fixing Super Admin status for ivy.waliaula@gmail.com...');
    
    const email = 'ivy.waliaula@gmail.com';
    
    // Get current super admins
    const superAdminData = await AsyncStorage.getItem('superAdmins');
    let superAdmins = superAdminData ? JSON.parse(superAdminData) : [];
    
    // Add ivy if not already there
    if (!superAdmins.includes(email)) {
      superAdmins.push(email);
      await AsyncStorage.setItem('superAdmins', JSON.stringify(superAdmins));
      console.log('✅ Added ivy.waliaula@gmail.com to Super Admins');
    } else {
      console.log('✅ ivy.waliaula@gmail.com is already a Super Admin');
    }
    
    // Also ensure in admin list
    const adminData = await AsyncStorage.getItem('adminUsers');
    let admins = adminData ? JSON.parse(adminData) : [];
    
    if (!admins.includes(email)) {
      admins.push(email);
      await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
      console.log('✅ Added ivy.waliaula@gmail.com to Admins');
    }
    
    console.log('\n📊 Current Status:');
    console.log('Super Admins:', superAdmins);
    console.log('Admins:', admins);
    
    console.log('\n✅ Done! Please restart the app and login again.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Note: This script is for reference. 
// The actual fix is in the code changes.
// Just rebuild the APK and login again!

console.log('This is a reference script.');
console.log('The fix has been applied to the code.');
console.log('Please:');
console.log('1. Wait for new APK to build');
console.log('2. Install new APK');
console.log('3. Login with ivy.waliaula@gmail.com');
console.log('4. You should see "👑 Super Admin Mode" and Dashboard button');
