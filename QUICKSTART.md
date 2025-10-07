# ⚡ Quick Start - Nkoroi FC Live Score

Get up and running in **30 minutes**!

## ✅ Prerequisites Checklist

Before starting, make sure you have:
- [ ] Computer with Windows/Mac/Linux
- [ ] Internet connection
- [ ] Smartphone (Android or iOS)
- [ ] Email address for Firebase account

## 🚀 5-Step Setup

### Step 1: Install Required Software (10 min)

**1.1 Install Node.js**
```bash
# Download from: https://nodejs.org/
# Choose LTS version (recommended)
# Run installer and follow prompts
```

**1.2 Verify Installation**
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
```

**1.3 Install Expo CLI**
```bash
npm install -g expo-cli
```

**1.4 Install Expo Go on Phone**
- Android: Google Play Store
- iOS: Apple App Store
- Search: "Expo Go"

---

### Step 2: Setup Firebase (10 min)

**2.1 Create Firebase Project**
1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name: "Nkoroi FC Live Score"
4. Click "Create project"

**2.2 Enable Realtime Database**
1. Sidebar: Build → Realtime Database
2. Click "Create Database"
3. Choose location (closest to you)
4. Select "Start in test mode"
5. Click "Enable"
6. Go to "Rules" tab
7. Copy rules from `firebase-rules.json`
8. Click "Publish"

**2.3 Enable Authentication**
1. Sidebar: Build → Authentication
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable" ON
5. Click "Save"

**2.4 Get Configuration**
1. Click gear icon ⚙️ → Project settings
2. Scroll to "Your apps"
3. Click web icon `</>`
4. Register app: "Nkoroi FC"
5. **Copy the firebaseConfig object**

---

### Step 3: Configure App (5 min)

**3.1 Navigate to Project**
```bash
cd "c:\Users\Admin\Downloads\Nkoroi FC"
```

**3.2 Install Dependencies**
```bash
npm install
```

**3.3 Create Firebase Config**
```bash
# Copy template
copy firebaseConfig.template.js firebaseConfig.js

# Or on Mac/Linux:
cp firebaseConfig.template.js firebaseConfig.js
```

**3.4 Edit Config File**
Open `firebaseConfig.js` and paste your Firebase config:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### Step 4: Run the App (2 min)

**4.1 Start Development Server**
```bash
npm start
```

**4.2 Open on Phone**
1. Open Expo Go app
2. Scan QR code from terminal
3. Wait for app to load

**Troubleshooting:**
- If QR won't scan, try: `expo start --tunnel`
- Make sure phone and computer are on same WiFi

---

### Step 5: Create First Account (3 min)

**5.1 Register Admin**
1. In app, click "Don't have an account? Register"
2. Enter email: `admin@nkoroifc.com`
3. Enter password: `admin123`
4. **Toggle "Register as Admin" ON** ⚠️ Important!
5. Click "Register"

**5.2 Login**
1. Enter same email and password
2. Click "Login"
3. You should see "👑 Admin Mode" badge

**5.3 Create Test Match**
1. Click "+" button (bottom right)
2. Home Team: "Nkoroi FC"
3. Away Team: "Test FC"
4. Click "Create Match"

**5.4 Test Live Updates**
1. Tap on the match
2. Click "Start Match"
3. Click "⚽ Goal" under Nkoroi FC
4. Watch score update!

---

## 🎉 You're Done!

Your app is now running! Here's what you can do next:

### Immediate Next Steps
1. **Create team member account** (register without admin toggle)
2. **Test on second device** to see real-time updates
3. **Test notifications** (only work on physical devices)

### Customization
1. **Change colors** in screen files (search for `#1a472a`)
2. **Add team logo** to assets folder
3. **Customize team names** in matches

### Share with Team
1. Send them the Expo Go link/QR code
2. Have them register accounts
3. Start tracking matches!

---

## 📱 Daily Usage

### As Admin
```
1. Open app
2. Click "+" to create match
3. Start match when game begins
4. Tap "Goal" buttons as goals happen
5. End match when game finishes
```

### As Team Member
```
1. Open app
2. View live matches
3. Receive notifications automatically
4. Pull down to refresh
```

---

## 🆘 Common Issues

### "Cannot connect to Firebase"
```bash
# Check firebaseConfig.js has correct values
# Verify Firebase services are enabled
```

### "npm install fails"
```bash
# Delete node_modules and retry
rmdir /s node_modules
npm install
```

### "QR code won't scan"
```bash
# Use tunnel mode
expo start --tunnel
```

### "Notifications not working"
- Notifications only work on physical devices
- Allow permissions when prompted
- Check device notification settings

---

## 📚 Need More Help?

| Issue | See Document |
|-------|-------------|
| Detailed setup | `SETUP_GUIDE.md` |
| Firebase setup | `FIREBASE_SETUP.md` |
| Testing features | `TESTING_GUIDE.md` |
| Full documentation | `README.md` |
| Project overview | `PROJECT_SUMMARY.md` |

---

## 🎯 Success Checklist

You're ready when:
- [x] App runs on your phone
- [x] You can register and login
- [x] Admin can create matches
- [x] Admin can update scores
- [x] Team members can view matches
- [x] Real-time updates work

---

**Enjoy tracking Nkoroi FC matches! ⚽**

*Estimated total time: 30 minutes*
