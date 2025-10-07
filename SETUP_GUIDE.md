# Quick Setup Guide for Nkoroi FC Live Score

## Step-by-Step Setup Instructions

### 1. Install Node.js and Expo CLI (5 minutes)

**Install Node.js:**
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Run the installer and follow the prompts

**Install Expo CLI:**
```bash
npm install -g expo-cli
```

### 2. Install Expo Go on Your Phone (2 minutes)

- **Android**: Download from Google Play Store
- **iOS**: Download from Apple App Store
- Search for "Expo Go" and install

### 3. Setup Firebase (10 minutes)

**Create Firebase Project:**
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "Nkoroi FC Live Score"
4. Disable Google Analytics (optional)
5. Click "Create project"

**Enable Realtime Database:**
1. In left sidebar, click "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to you)
4. Select "Start in test mode"
5. Click "Enable"
6. Go to "Rules" tab and paste:
```json
{
  "rules": {
    "matches": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```
7. Click "Publish"

**Enable Authentication:**
1. In left sidebar, click "Build" → "Authentication"
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable" to ON
5. Click "Save"

**Get Configuration:**
1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Enter app nickname: "Nkoroi FC Web"
6. Click "Register app"
7. Copy the `firebaseConfig` object (looks like this):
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Configure the App (3 minutes)

1. **Navigate to project folder:**
```bash
cd "c:\Users\Admin\Downloads\Nkoroi FC"
```

2. **Create Firebase config file:**
   - Copy `firebaseConfig.template.js` to `firebaseConfig.js`
   - Open `firebaseConfig.js` in a text editor
   - Replace the placeholder values with your Firebase config from step 3

3. **Install dependencies:**
```bash
npm install
```

### 5. Run the App (2 minutes)

1. **Start the development server:**
```bash
npm start
```

2. **Open on your phone:**
   - Open Expo Go app on your phone
   - Scan the QR code shown in the terminal/browser
   - Wait for the app to load

### 6. Create Your First Admin Account (1 minute)

1. In the app, click "Don't have an account? Register"
2. Enter your email and password
3. **Toggle "Register as Admin" to ON** (Important!)
4. Click "Register"
5. You'll be redirected to login - login with your credentials

### 7. Test the App (5 minutes)

**As Admin:**
1. Click the "+" button to create a match
2. Enter:
   - Home Team: "Nkoroi FC"
   - Away Team: "Test FC"
   - Venue: "Main Stadium"
3. Click "Create Match"
4. Tap on the match to open details
5. Click "Start Match"
6. Click "⚽ Goal" under Nkoroi FC
7. Watch the score update!

**Create a Team Member Account:**
1. Logout (top right icon on home screen)
2. Register a new account with "Register as Admin" OFF
3. Login and view the live match

## Common Issues and Solutions

### Issue: "Cannot connect to Firebase"
**Solution:** 
- Check your `firebaseConfig.js` has correct values
- Ensure you copied ALL fields from Firebase Console
- Verify Realtime Database and Authentication are enabled

### Issue: "npm install" fails
**Solution:**
```bash
# Delete node_modules and try again
rmdir /s node_modules
npm install
```

### Issue: QR code won't scan
**Solution:**
- Make sure your phone and computer are on the same WiFi network
- Try typing the URL manually in Expo Go
- Use tunnel mode: `expo start --tunnel`

### Issue: Notifications not working
**Solution:**
- Notifications only work on physical devices (not simulators)
- Allow notification permissions when prompted
- For testing, use a real Android or iOS device

### Issue: "Expo Go" not loading app
**Solution:**
```bash
# Clear cache and restart
expo start -c
```

## Next Steps

1. **Invite Team Members**: Share the app with team members and have them register
2. **Customize**: Update team names, colors, and branding
3. **Add Assets**: Replace placeholder icons with your team logo
4. **Test Notifications**: Create matches and test notifications with team members

## Need Help?

- Check the full README.md for detailed documentation
- Review Firebase Console for any error messages
- Ensure all Firebase services are enabled
- Verify your phone and computer are on the same network

## Production Checklist

Before deploying to production:
- [ ] Update Firebase Security Rules
- [ ] Add proper app icons and splash screen
- [ ] Test on both Android and iOS
- [ ] Set up proper user roles and permissions
- [ ] Build production app with EAS Build
- [ ] Submit to App Store / Play Store

---

**You're all set! Enjoy tracking Nkoroi FC matches! ⚽**
