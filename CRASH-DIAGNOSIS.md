# Nkoroi FC APK Crash Diagnosis & Fixes

## 🔍 Most Likely Crash Causes (In Order)

### 1. **React Native Firebase Version Mismatch** ⚠️ MOST LIKELY
**Problem:** Using React Native Firebase v21 with React Native 0.81.4 may be incompatible.

**Symptoms:**
- App crashes immediately on launch
- No UI appears
- Native module initialization error

**Fix:**
```json
// In package.json, change:
"@react-native-firebase/app": "^21.3.0",
"@react-native-firebase/database": "^21.3.0",
"@react-native-firebase/messaging": "^21.3.0",

// To compatible versions:
"@react-native-firebase/app": "^18.9.0",
"@react-native-firebase/database": "^18.9.0",
"@react-native-firebase/messaging": "^18.9.0",
```

---

### 2. **Missing React Native Firebase Auto-linking**
**Problem:** React Native Firebase requires additional native setup that may not be auto-linked in Expo.

**Symptoms:**
- "Unable to resolve module @react-native-firebase/app"
- Native module not found

**Fix:**
React Native Firebase doesn't work well with Expo managed workflow. You need to:
- Use bare React Native workflow, OR
- Use Firebase Web SDK (but we removed this due to crashes), OR
- Stick with AsyncStorage (demo mode)

---

### 3. **Expo + React Native Firebase Conflict**
**Problem:** Expo SDK 54 doesn't support React Native Firebase out of the box.

**Symptoms:**
- Immediate crash
- "Invariant Violation" errors
- Module resolution errors

**Fix:**
You're using Expo, which doesn't support React Native Firebase natively. Options:
1. **Eject from Expo** (complex)
2. **Use Expo's Firebase packages** (limited features)
3. **Keep demo mode** (AsyncStorage only - most stable)

---

### 4. **Google Services Plugin Not Applied**
**Problem:** The google-services.json isn't being processed properly.

**Symptoms:**
- Firebase initialization fails
- "Default FirebaseApp is not initialized"

**Fix:**
Already added in latest commit, but verify:
- `android/build.gradle` has `classpath("com.google.gms:google-services:4.4.0")`
- `android/app/build.gradle` has `apply plugin: "com.google.gms.google-services"`
- `android/app/google-services.json` exists

---

## 🎯 RECOMMENDED FIX (Most Stable)

Since you're using **Expo + React Native 0.81.4**, the most stable solution is:

### Option A: Revert to Demo Mode (Guaranteed to Work)
```bash
# This will make the app stable but local-only
git revert HEAD
git push
```

### Option B: Use Expo-Compatible Firebase
Replace React Native Firebase with Expo Firebase:
```json
{
  "dependencies": {
    "firebase": "^10.7.1",  // Web SDK (but needs careful implementation)
    // Remove all @react-native-firebase/* packages
  }
}
```

### Option C: Proper React Native Firebase Setup (Complex)
1. Eject from Expo: `npx expo prebuild`
2. Install React Native Firebase properly
3. Configure native modules manually
4. Test thoroughly

---

## 📱 Quick Test Commands

### Test on Emulator:
```bash
test-apk-emulator.bat
```

### Get Crash Logs from Real Device:
```bash
get-crash-logs.bat
```

### Check Specific Error:
```bash
adb logcat | findstr /i "firebase"
adb logcat | findstr /i "nkoroifc"
adb logcat | findstr /i "crash"
```

---

## 🔧 Immediate Action Plan

1. **Run `get-crash-logs.bat`** on your phone to see exact error
2. **Check if error mentions:**
   - "Firebase" → Version mismatch or Expo conflict
   - "Module not found" → Auto-linking issue
   - "Native module" → React Native Firebase incompatibility
3. **Based on error, choose:**
   - **Simple fix:** Revert to demo mode (stable, local-only)
   - **Full fix:** Wait for me to implement Expo-compatible solution

---

## 🚨 Critical Issue Identified

**The problem:** You're using **Expo** with **React Native Firebase**.

**These are incompatible** without ejecting from Expo!

React Native Firebase requires native modules that Expo's managed workflow doesn't support.

**Solution:** I need to revert to a stable version that works with Expo.

---

## Next Steps

1. Run `get-crash-logs.bat` to confirm the error
2. Share the crash log with me
3. I'll implement the proper fix based on the actual error
