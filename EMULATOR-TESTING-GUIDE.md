# 📱 Nkoroi FC APK Emulator Testing Guide

## 🎯 Quick Start

### Option 1: Test on Your Phone (Easiest)
```bash
# Run this script:
get-crash-logs.bat

# Then:
# 1. Connect phone via USB
# 2. Enable USB Debugging
# 3. Open the app
# 4. Check crash-log.txt for errors
```

### Option 2: Test on Emulator
```bash
# Run this script:
test-apk-emulator.bat

# It will:
# 1. Start the emulator
# 2. Install the APK
# 3. Launch the app
# 4. Show crash logs
```

---

## 🔍 What Was Fixed

### Problem: Version Incompatibility
- **React Native Firebase v21** doesn't work with **React Native 0.81.4**
- Caused immediate crashes on app launch

### Solution Applied:
- Downgraded to **React Native Firebase v18.9.0**
- This version is compatible with React Native 0.81.4
- Maintains all features (cloud sync + push notifications)

---

## 📋 Testing Checklist

After downloading the new APK from GitHub Actions:

### ✅ Basic Functionality:
- [ ] App opens without crashing
- [ ] Login screen appears
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Home screen loads

### ✅ Firebase Features:
- [ ] Can create a match (admin)
- [ ] Match appears in Firebase console
- [ ] Match syncs to other devices
- [ ] Can update match score
- [ ] Real-time updates work

### ✅ Push Notifications:
- [ ] Permission request appears
- [ ] Can accept notifications
- [ ] FCM token generated (check logs)
- [ ] Notifications received (when implemented)

---

## 🐛 If It Still Crashes

### Step 1: Get Crash Logs
```bash
# On Windows:
get-crash-logs.bat

# Manual command:
adb logcat -d > crash-log.txt
```

### Step 2: Check for These Errors

#### Error: "Default FirebaseApp is not initialized"
**Fix:** google-services.json issue
```bash
# Verify file exists:
dir android\app\google-services.json
```

#### Error: "Unable to resolve module @react-native-firebase"
**Fix:** Dependencies not installed
```bash
npm install
cd android
./gradlew clean
```

#### Error: "Native module cannot be null"
**Fix:** Auto-linking issue
```bash
cd android
./gradlew clean
cd ..
npx react-native link
```

---

## 🚀 Manual Emulator Setup

If the script doesn't work, here's the manual process:

### 1. Start Emulator
```bash
# List available emulators:
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -list-avds

# Start emulator:
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1
```

### 2. Install APK
```bash
# Wait for emulator to boot, then:
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe install -r android\app\build\outputs\apk\release\app-release.apk
```

### 3. Launch App
```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe shell am start -n com.nkoroifc.livescore/.MainActivity
```

### 4. Monitor Logs
```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe logcat | findstr /i "error crash firebase"
```

---

## 📊 Expected Logcat Output (Success)

When the app works correctly, you should see:
```
I/ReactNativeJS: Firebase initialized successfully
I/ReactNativeJS: FCM Token: [long token string]
I/ReactNativeJS: Notification permission granted
D/FirebaseDatabase: Connected to Firebase Realtime Database
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Emulator Won't Start
**Solution:**
- Open Android Studio
- Tools → AVD Manager
- Click Play button on emulator
- Wait 2-3 minutes for boot

### Issue 2: ADB Not Found
**Solution:**
```bash
# Add to PATH:
set PATH=%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools
```

### Issue 3: APK Not Found
**Solution:**
- Download from GitHub Actions
- Extract to: `android\app\build\outputs\apk\release\`
- Rename to: `app-release.apk`

### Issue 4: Installation Failed
**Solution:**
```bash
# Uninstall old version first:
adb uninstall com.nkoroifc.livescore

# Then install new:
adb install -r app-release.apk
```

---

## 📱 Testing on Real Device

### Enable USB Debugging:
1. Settings → About Phone
2. Tap "Build Number" 7 times
3. Go back → Developer Options
4. Enable "USB Debugging"
5. Connect phone to PC
6. Accept debugging prompt on phone

### Install APK:
```bash
adb install -r app-release.apk
```

### Get Logs:
```bash
# Clear old logs:
adb logcat -c

# Open app on phone

# Get crash logs:
adb logcat -d > crash-log.txt
```

---

## 🎉 Success Indicators

### App is Working When:
1. ✅ App icon appears on home screen
2. ✅ App opens to login screen (not black screen)
3. ✅ Can navigate between screens
4. ✅ No "Unfortunately, app has stopped" message
5. ✅ Firebase console shows connection

### Firebase is Working When:
1. ✅ Logcat shows "Firebase initialized"
2. ✅ Can create match in app
3. ✅ Match appears in Firebase console
4. ✅ Match syncs to other devices
5. ✅ Real-time updates work

---

## 📞 Next Steps

1. **Download new APK** from GitHub Actions (wait ~15 min)
2. **Run `test-apk-emulator.bat`** or `get-crash-logs.bat`
3. **Check if app opens** without crashing
4. **Test Firebase features** (create match, update score)
5. **Share results** - If still crashes, share crash-log.txt

---

## 🔗 Useful Links

- **GitHub Actions:** https://github.com/Lavyuela/nkoroi-fc/actions
- **Firebase Console:** https://console.firebase.google.com/project/nkoroifc-9c964
- **ADB Commands:** https://developer.android.com/tools/adb

---

## 💡 Pro Tips

1. **Always clear logcat** before testing: `adb logcat -c`
2. **Filter logs** for your app: `adb logcat | findstr nkoroifc`
3. **Check Firebase console** to verify data sync
4. **Test on Android 12+** for best compatibility
5. **Keep USB Debugging enabled** for easier testing
