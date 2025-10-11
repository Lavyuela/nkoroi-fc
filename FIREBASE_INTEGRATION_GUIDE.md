# 🔥 Firebase Integration Guide - Complete Setup

## 🎯 What We're Setting Up

Firebase will provide:
- ✅ **Authentication** - User login/registration synced across devices
- ✅ **Firestore Database** - Real-time data sync for matches, users, roles
- ✅ **Cloud Messaging** - Push notifications to all devices
- ✅ **Single Super Admin** - One Super Admin across all devices

---

## 📋 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**

### 1.2 Configure Project
1. **Project name:** `Nkoroi FC`
2. Click **"Continue"**
3. **Google Analytics:** Toggle OFF (optional, not needed)
4. Click **"Create project"**
5. Wait for setup to complete (~30 seconds)
6. Click **"Continue"**

---

## 📋 Step 2: Add Android App to Firebase

### 2.1 Register App
1. In Firebase Console, click the **Android icon** (⚙️)
2. **Android package name:** `com.nkoroifc` (IMPORTANT: Must match exactly!)
3. **App nickname:** `Nkoroi FC` (optional)
4. **Debug signing certificate SHA-1:** Leave blank for now
5. Click **"Register app"**

### 2.2 Download google-services.json
1. Click **"Download google-services.json"**
2. **IMPORTANT:** Save this file - you'll need it!
3. Click **"Next"**
4. Click **"Next"** again (SDK already added)
5. Click **"Continue to console"**

### 2.3 Add google-services.json to Project
1. Copy the downloaded `google-services.json` file
2. Paste it into: `android/app/google-services.json`
3. **Path should be:** `Nkoroi FC/android/app/google-services.json`

---

## 📋 Step 3: Enable Firebase Services

### 3.1 Enable Authentication
1. In Firebase Console, click **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"** ON
6. Click **"Save"**

### 3.2 Enable Firestore Database
1. In Firebase Console, click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. **Start mode:** Select **"Start in test mode"**
4. Click **"Next"**
5. **Location:** Choose closest to you:
   - `us-central1` (United States)
   - `europe-west1` (Europe)
   - `asia-southeast1` (Asia)
6. Click **"Enable"**
7. Wait for database creation (~1 minute)

### 3.3 Configure Firestore Security Rules
1. Click **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Roles collection
    match /roles/{userId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow create, update, delete: if get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // Updates collection
    match /updates/{updateId} {
      allow read: if request.auth != null;
      allow create, update, delete: if get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // Predictions collection
    match /predictions/{predictionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Favorites collection
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

### 3.4 Enable Cloud Messaging
1. In Firebase Console, click **"Cloud Messaging"** (left sidebar)
2. Cloud Messaging is automatically enabled
3. Note: You'll need to configure this later for iOS (if needed)

---

## 📋 Step 4: Update Android Configuration

### 4.1 Update android/build.gradle
File already updated in code! Should have:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

### 4.2 Update android/app/build.gradle
File already updated in code! Should have:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
}
```

---

## 📋 Step 5: Install Dependencies

Run these commands in your project directory:

```bash
# Install npm dependencies
npm install

# For Android, sync Gradle
cd android
./gradlew clean
cd ..
```

---

## 📋 Step 6: Initialize First Super Admin

After Firebase is set up, the app will:
1. ✅ Check if any Super Admin exists in Firestore
2. ✅ If none exists, make first registered user Super Admin
3. ✅ All subsequent users become Fans
4. ✅ Super Admin can promote users from User Management

---

## 🎯 Testing Firebase Integration

### Test 1: Registration
1. Install app on Device 1
2. Register with email: `test1@example.com`
3. Check Firebase Console → Authentication
4. Should see user listed
5. Check Firestore → `roles` collection
6. Should see user with `role: 'super_admin'`

### Test 2: Cross-Device Sync
1. Install app on Device 2
2. Register with email: `test2@example.com`
3. Should be `role: 'fan'` (not super admin)
4. Login on Device 1 as Super Admin
5. Go to User Management
6. Promote `test2@example.com` to Admin
7. Logout and login on Device 2
8. Should now see Admin features

### Test 3: Match Sync
1. Device 1 (Super Admin): Create a match
2. Device 2: Should see match appear immediately
3. Device 1: Update match score
4. Device 2: Should see score update in real-time

### Test 4: Notifications
1. Device 1: Create match or update score
2. Device 2: Should receive push notification
3. Check notification appears on lock screen

---

## 🔍 Troubleshooting

### Issue: "google-services.json not found"
**Solution:** Make sure file is at `android/app/google-services.json`

### Issue: "Firebase not initialized"
**Solution:** 
1. Check `google-services.json` is in correct location
2. Run `cd android && ./gradlew clean && cd ..`
3. Rebuild app

### Issue: "Authentication failed"
**Solution:**
1. Check Firebase Console → Authentication → Sign-in method
2. Ensure Email/Password is enabled

### Issue: "Permission denied" in Firestore
**Solution:**
1. Check Firestore Rules are published
2. Ensure user is authenticated
3. Check role is set correctly in `roles` collection

### Issue: "No notifications received"
**Solution:**
1. Check Cloud Messaging is enabled
2. Ensure app has notification permissions
3. Check FCM token is generated (see logs)

---

## 📊 Firebase Console - What to Check

### Authentication Tab
- See all registered users
- Check user emails
- Disable/delete users if needed

### Firestore Database Tab
- **users** collection: User profiles
- **roles** collection: User roles (super_admin, admin, fan)
- **matches** collection: All matches
- **updates** collection: Team updates
- **predictions** collection: User predictions
- **favorites** collection: Favorited matches

### Cloud Messaging Tab
- View notification statistics
- Send test notifications

---

## ✅ Verification Checklist

Before testing, ensure:
- [ ] Firebase project created
- [ ] Android app registered
- [ ] `google-services.json` downloaded and placed in `android/app/`
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firestore Security Rules published
- [ ] Cloud Messaging enabled
- [ ] Dependencies installed (`npm install`)
- [ ] Gradle synced (`cd android && ./gradlew clean`)

---

## 🚀 Next Steps

After Firebase setup:
1. ✅ Build new APK with Firebase integration
2. ✅ Test on multiple devices
3. ✅ Verify data syncs across devices
4. ✅ Test notifications
5. ✅ Confirm single Super Admin

---

## 📞 Need Help?

If you encounter issues:
1. Check Firebase Console for errors
2. Check app logs: `npx react-native log-android`
3. Verify `google-services.json` is correct
4. Ensure package name matches: `com.nkoroifc`

---

**Once you've completed these steps, let me know and I'll update the code to use Firebase!** 🔥✅
