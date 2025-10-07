# 🔧 Troubleshooting Guide - Nkoroi FC Live Score

Common issues and their solutions.

## 🔥 Firebase Issues

### Issue: "Cannot connect to Firebase"

**Symptoms:**
- Login fails with network error
- Matches don't load
- "Permission denied" errors

**Solutions:**

1. **Check Firebase Config**
   ```bash
   # Verify firebaseConfig.js exists and has correct values
   # Compare with Firebase Console → Project Settings
   ```

2. **Verify Firebase Services**
   - Go to Firebase Console
   - Check Realtime Database is enabled
   - Check Authentication is enabled
   - Verify Email/Password auth is ON

3. **Check Database Rules**
   ```bash
   # Go to Realtime Database → Rules
   # Ensure rules match firebase-rules.json
   # Click "Publish" after updating
   ```

4. **Check Internet Connection**
   ```bash
   # Test connection
   ping firebase.google.com
   ```

---

### Issue: "Permission denied" in Firebase

**Symptoms:**
- Can't read or write data
- "PERMISSION_DENIED" error

**Solutions:**

1. **Verify User is Logged In**
   - Check Firebase Console → Authentication → Users
   - User should appear in list

2. **Check Database Rules**
   ```json
   // Rules should require authentication
   {
     "rules": {
       "matches": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

3. **Check Admin Status**
   - Go to Firebase Console → Realtime Database → Data
   - Check `users/{userId}/isAdmin` is `true` for admin users

---

### Issue: Real-time updates not working

**Symptoms:**
- Score changes don't appear immediately
- Need to refresh to see updates

**Solutions:**

1. **Check Database Connection**
   ```javascript
   // In Firebase Console, check "Connected clients"
   // Should show active connections
   ```

2. **Verify Subscription**
   ```javascript
   // Check console for errors
   // Ensure subscribeToMatches() is called
   ```

3. **Test with Multiple Devices**
   - Open app on 2 devices
   - Update score on one
   - Should appear on other immediately

---

## 📱 App Installation Issues

### Issue: "npm install" fails

**Symptoms:**
- Errors during dependency installation
- Missing packages

**Solutions:**

1. **Clear Cache and Reinstall**
   ```bash
   # Delete node_modules
   rmdir /s /q node_modules  # Windows
   rm -rf node_modules       # Mac/Linux
   
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall
   npm install
   ```

2. **Check Node Version**
   ```bash
   node --version  # Should be v14+ 
   npm --version   # Should be v6+
   
   # Update if needed
   # Download from: https://nodejs.org/
   ```

3. **Try with Yarn**
   ```bash
   npm install -g yarn
   yarn install
   ```

---

### Issue: "expo start" fails

**Symptoms:**
- Server won't start
- Port already in use

**Solutions:**

1. **Clear Expo Cache**
   ```bash
   expo start -c
   ```

2. **Kill Existing Process**
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Mac/Linux
   killall node
   ```

3. **Use Different Port**
   ```bash
   expo start --port 19001
   ```

---

## 📲 Device Connection Issues

### Issue: QR code won't scan

**Symptoms:**
- Expo Go can't read QR code
- Connection timeout

**Solutions:**

1. **Check Network**
   - Ensure phone and computer on same WiFi
   - Disable VPN if active

2. **Use Tunnel Mode**
   ```bash
   expo start --tunnel
   ```

3. **Manual Connection**
   - In Expo Go, tap "Enter URL manually"
   - Type the URL shown in terminal

4. **Try LAN Mode**
   ```bash
   expo start --lan
   ```

---

### Issue: App won't load on device

**Symptoms:**
- Stuck on loading screen
- "Unable to connect" error

**Solutions:**

1. **Check Firewall**
   - Allow Expo through firewall
   - Temporarily disable firewall to test

2. **Restart Everything**
   ```bash
   # Stop expo server (Ctrl+C)
   # Close Expo Go app
   # Restart computer
   # Start fresh: expo start
   ```

3. **Check Expo Go Version**
   - Update Expo Go app to latest version
   - Update expo CLI: `npm install -g expo-cli`

---

## 🔔 Notification Issues

### Issue: Notifications not working

**Symptoms:**
- No notifications received
- Permission errors

**Solutions:**

1. **Check Device Type**
   - ⚠️ Notifications DON'T work on emulators/simulators
   - Must use physical device

2. **Check Permissions**
   - Settings → Apps → Expo Go → Notifications
   - Ensure notifications are enabled

3. **Test Manually**
   ```javascript
   // In app, test notification
   import { sendLocalNotification } from './src/services/notifications';
   sendLocalNotification('Test', 'This is a test');
   ```

4. **Re-register for Notifications**
   - Uninstall and reinstall app
   - Allow permissions when prompted

---

## 🔐 Authentication Issues

### Issue: Can't register new user

**Symptoms:**
- "Email already in use" error
- Registration fails

**Solutions:**

1. **Check Email Format**
   - Must be valid email format
   - Example: user@example.com

2. **Check Password Length**
   - Must be at least 6 characters

3. **Check Firebase Console**
   - Go to Authentication → Users
   - Check if user already exists
   - Delete duplicate if needed

---

### Issue: Can't login

**Symptoms:**
- "Invalid credentials" error
- Login button doesn't work

**Solutions:**

1. **Verify Credentials**
   - Check email spelling
   - Check password (case-sensitive)

2. **Reset Password**
   - Currently no reset feature
   - Create new account or update in Firebase Console

3. **Check Firebase Auth**
   - Firebase Console → Authentication
   - Verify Email/Password is enabled

---

### Issue: Admin features not showing

**Symptoms:**
- No "+" button
- No "Admin Mode" badge
- Can't create matches

**Solutions:**

1. **Check Admin Status**
   ```bash
   # Firebase Console → Realtime Database → Data
   # Navigate to: users/{your-user-id}/isAdmin
   # Should be: true
   ```

2. **Manually Set Admin**
   - In Firebase Console, edit user data
   - Set `isAdmin: true`
   - Logout and login again

3. **Re-register as Admin**
   - Create new account
   - Toggle "Register as Admin" ON

---

## 🎨 UI/Display Issues

### Issue: App looks broken/unstyled

**Symptoms:**
- Missing styles
- Layout issues

**Solutions:**

1. **Clear Cache**
   ```bash
   expo start -c
   ```

2. **Check React Native Paper**
   ```bash
   # Reinstall UI library
   npm install react-native-paper
   ```

3. **Restart App**
   - Close app completely
   - Reopen from Expo Go

---

### Issue: Images/icons not showing

**Symptoms:**
- Missing app icon
- Broken images

**Solutions:**

1. **Add Assets**
   - Create required images in `assets/` folder
   - See `assets/README.md` for requirements

2. **Use Placeholders**
   ```bash
   node create-placeholder-assets.js
   ```

3. **Clear Cache**
   ```bash
   expo start -c
   ```

---

## ⚡ Performance Issues

### Issue: App is slow/laggy

**Symptoms:**
- Slow scrolling
- Delayed updates
- Freezing

**Solutions:**

1. **Check Device Performance**
   - Close other apps
   - Restart device
   - Free up storage space

2. **Reduce Data Load**
   - Delete old matches
   - Limit match history

3. **Check Network Speed**
   - Test internet connection
   - Switch to better WiFi

---

### Issue: High data usage

**Symptoms:**
- Rapid data consumption
- Firebase quota warnings

**Solutions:**

1. **Check Firebase Usage**
   - Firebase Console → Usage and billing
   - Monitor downloads and connections

2. **Optimize Queries**
   - Limit real-time subscriptions
   - Use pagination for large lists

3. **Upgrade Firebase Plan**
   - If exceeding free tier
   - Switch to Blaze (pay-as-you-go)

---

## 🐛 Build/Deployment Issues

### Issue: Build fails

**Symptoms:**
- EAS build errors
- APK/IPA generation fails

**Solutions:**

1. **Check app.json**
   - Verify all required fields
   - Check bundle identifiers

2. **Update Dependencies**
   ```bash
   npm update
   expo upgrade
   ```

3. **Check EAS Configuration**
   ```bash
   eas build:configure
   ```

---

## 🔍 Debugging Tools

### Enable Debug Mode

```bash
# Start with debug logging
expo start --dev-client

# View logs
expo logs
```

### Check Firebase Console

1. **Authentication Logs**
   - Firebase Console → Authentication → Users
   - Check user creation timestamps

2. **Database Activity**
   - Realtime Database → Data
   - Watch real-time changes

3. **Usage Monitoring**
   - Usage and billing
   - Check quotas and limits

### React Native Debugger

```bash
# Shake device to open menu
# Select "Debug"
# Open Chrome DevTools
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Check Documentation**
   - README.md
   - SETUP_GUIDE.md
   - FIREBASE_SETUP.md

2. **Check Console Errors**
   - Look for error messages
   - Note exact error text

3. **Test Basic Functionality**
   - Can you login?
   - Can you see matches?
   - Is internet working?

### Where to Get Help

1. **Expo Documentation**
   - https://docs.expo.dev/

2. **Firebase Documentation**
   - https://firebase.google.com/docs

3. **Stack Overflow**
   - Tag: `react-native`, `expo`, `firebase`

4. **GitHub Issues**
   - Check similar projects
   - Search for error messages

---

## 🔄 Reset Everything

If all else fails, start fresh:

```bash
# 1. Delete everything
rmdir /s /q node_modules
del package-lock.json

# 2. Reinstall
npm install

# 3. Clear cache
expo start -c

# 4. Reset Firebase (if needed)
# - Delete all data in Realtime Database
# - Delete all users in Authentication
# - Re-create admin account
```

---

## ✅ Prevention Checklist

Avoid issues by:
- [ ] Keep dependencies updated
- [ ] Regular Firebase backups
- [ ] Test on multiple devices
- [ ] Monitor Firebase usage
- [ ] Clear cache regularly
- [ ] Keep documentation updated
- [ ] Test after each change

---

**Still having issues? Check the full documentation or create a new Firebase project and start fresh.**

*Last Updated: 2025-10-07*
