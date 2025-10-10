# 🚀 Nkoroi FC Live Score - Deployment Guide

## 📱 Complete Guide to Building & Deploying Your App

---

## 🎯 What You Have

A fully functional **Live Football Score App** with:
- ✅ Firebase Authentication (real login)
- ✅ Firebase Realtime Database (cloud storage)
- ✅ Match Management (create, update, delete)
- ✅ Live Score Updates (real-time sync)
- ✅ Push Notifications (goals, cards, events)
- ✅ Team Updates/News System
- ✅ Team Statistics & Analytics
- ✅ Fan Features (predictions, follow matches)
- ✅ Admin & User Roles

---

## 🔥 Firebase Configuration

**Your Firebase is already set up!**

**Project:** nkoroifc-9c964  
**Database:** Europe West (Frankfurt)  
**Status:** ✅ Active and working

**Firebase Console:** https://console.firebase.google.com/project/nkoroifc-9c964

---

## 📱 Option 1: Build APK with EAS (Recommended)

### **Step 1: Install EAS CLI**
```bash
npm install -g eas-cli
```

### **Step 2: Login to Expo**
```bash
eas login
```
- Create a free account if you don't have one
- Or login with existing credentials

### **Step 3: Build APK**
```bash
cd "c:\Users\Admin\Downloads\Nkoroi FC"
eas build --platform android --profile preview
```

### **Step 4: Wait for Build**
- Build takes 10-15 minutes
- You'll get a download link when done
- Or check: https://expo.dev/accounts/[your-account]/builds

### **Step 5: Download & Install**
- Download the APK file
- Transfer to your Android phone
- Install and test!

---

## 📱 Option 2: Build APK Locally

### **Requirements:**
- ✅ Java JDK 17 (already installed)
- ✅ Android project generated (already done)

### **Build Command:**
```bash
cd "c:\Users\Admin\Downloads\Nkoroi FC\android"
$env:JAVA_HOME="C:\Program Files\Microsoft\jdk-17.0.9.8-hotspot"
.\gradlew.bat assembleRelease
```

### **Find Your APK:**
```
android\app\build\outputs\apk\release\app-release.apk
```

### **Note:**
- First build takes 20-30 minutes
- Subsequent builds are faster (5-10 minutes)

---

## 🧪 Testing with Expo Go (Development)

### **Start Development Server:**
```bash
cd "c:\Users\Admin\Downloads\Nkoroi FC"
npx expo start --lan
```

**Or double-click:** `start-app-lan.bat`

### **On Your Phone:**
1. Open Expo Go app
2. Scan QR code or tap project name
3. App loads with live Firebase!

### **Create Test Account:**
1. Tap "Don't have an account? Register"
2. Email: `admin@nkoroifc.com`
3. Password: (min 6 characters)
4. Toggle "Admin Access" ON
5. Register & Login

---

## 👥 User Accounts & Roles

### **Admin Account:**
- Email with "admin" in it gets admin role
- Can create matches
- Can update scores
- Can add events
- Can post team updates
- Can delete matches

### **Regular User/Fan:**
- Can view matches
- Can make predictions
- Can follow matches
- Can view team stats
- Can read team updates

### **Creating Accounts:**
Users must register through the app:
1. Open app
2. Tap "Register"
3. Enter email & password
4. Check "Admin Access" if needed
5. Create account

---

## 📤 Sharing Your APK

### **Method 1: Direct File Sharing**
- Share APK via WhatsApp, Email, USB
- Users enable "Install from Unknown Sources"
- Install APK directly

### **Method 2: Google Drive**
1. Upload APK to Google Drive
2. Share link with users
3. Users download and install

### **Method 3: Firebase App Distribution (Free)**
1. Go to: https://console.firebase.google.com/project/nkoroifc-9c964/appdistribution
2. Upload your APK
3. Invite testers via email
4. They get automatic updates!

### **Method 4: Google Play Store ($25 one-time)**
1. Build production APK:
   ```bash
   eas build --platform android --profile production
   ```
2. Create Google Play Developer account ($25)
3. Upload APK to Play Console
4. Publish to store

---

## 🔧 App Configuration Files

### **Firebase Config:** `firebaseConfig.js`
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyDDkwPxdA1CwqCdXmAQz79PrN6PSCDUWuc",
  authDomain: "nkoroifc-9c964.firebaseapp.com",
  databaseURL: "https://nkoroifc-9c964-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nkoroifc-9c964",
  storageBucket: "nkoroifc-9c964.firebasestorage.app",
  messagingSenderId: "690706398047",
  appId: "1:690706398047:web:b990946497752a369dd94ea"
};
```

### **App Config:** `app.json`
- App Name: Nkoroi FC Live Score
- Package: com.nkoroifc.livescore
- Version: 1.0.0

### **Build Config:** `eas.json`
- Preview: Builds APK
- Production: Builds AAB for Play Store

---

## 🎨 Customization

### **Change App Name:**
Edit `app.json`:
```json
"name": "Your Team Name"
```

### **Change Colors:**
Edit theme colors in screen files:
- Primary: `#1a472a` (dark green)
- Accent: `#4caf50` (light green)

### **Change Logo:**
Replace `assets/icon.png` with your logo (1024x1024 PNG)

---

## 🔔 Notifications Setup

### **Current Status:**
✅ Local notifications working (in-app alerts)  
⚠️ Push notifications (remote) require standalone build

### **For Push Notifications:**
1. Build APK (not Expo Go)
2. Notifications work automatically
3. No additional setup needed!

---

## 📊 Firebase Database Structure

```
nkoroifc-9c964/
├── users/
│   └── {userId}/
│       ├── email
│       ├── isAdmin
│       └── createdAt
├── matches/
│   └── {matchId}/
│       ├── homeTeam
│       ├── awayTeam
│       ├── homeScore
│       ├── awayScore
│       ├── status (upcoming/live/finished)
│       ├── venue
│       ├── matchDate
│       └── events/
│           └── {eventId}/
│               ├── type
│               ├── team
│               ├── description
│               └── timestamp
```

---

## 🐛 Troubleshooting

### **"Firebase Auth Error"**
- Make sure you're using the built APK, not Expo Go
- Or register an account in Expo Go first

### **"No Matches Showing"**
- Login as admin
- Create your first match
- Data syncs to all users instantly

### **"Notifications Not Working"**
- In Expo Go: Limited support
- In APK: Full support
- Check phone notification settings

### **"Build Taking Too Long"**
- Local builds: 20-30 minutes first time
- EAS builds: 10-15 minutes
- Cancel and retry if stuck >45 minutes

---

## 📞 Quick Commands Reference

### **Start Development:**
```bash
npx expo start --lan
```

### **Build APK (EAS):**
```bash
eas build --platform android --profile preview
```

### **Build APK (Local):**
```bash
cd android
.\gradlew.bat assembleRelease
```

### **Check APK Status:**
Double-click `check-apk.bat`

---

## 🎉 You're Ready!

Your app is **fully functional** and ready to deploy!

**Next Steps:**
1. Build your APK (EAS or local)
2. Install on your phone
3. Create admin account
4. Add your first match
5. Share with your team!

**Need Help?**
- Firebase Console: https://console.firebase.google.com
- Expo Dashboard: https://expo.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/

---

**Built with ❤️ for Nkoroi FC**
