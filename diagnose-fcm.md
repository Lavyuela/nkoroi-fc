# 🔍 FCM Token Issue Diagnosis

## The Problem:
- SHA-256 was added to Firebase Console
- But app still shows: "Failed to get FCM token"

## Possible Causes:

### 1. **APK/SHA-256 Mismatch**
The APK you're testing was built with a DIFFERENT signing key than the SHA-256 you added to Firebase.

**Solution:**
- Delete ALL SHA-256 fingerprints from Firebase Console
- Download the LATEST signing-report from GitHub Actions
- Add ONLY that SHA-256 to Firebase
- Reinstall the APK from that SAME build

### 2. **Multiple Builds Confusion**
You might have installed an APK from Build A, but added SHA-256 from Build B.

**Solution:**
- Note the build number/time when downloading APK
- Download signing-report from the EXACT SAME build
- Use that SHA-256

### 3. **Google Services JSON Mismatch**
The google-services.json in your APK might be outdated.

**Solution:**
- Download fresh google-services.json from Firebase Console
- Replace android/app/google-services.json
- Rebuild APK
- Add new SHA-256

### 4. **Firebase Project Issue**
Firebase project might have restrictions or issues.

**Solution:**
- Check Firebase Console → Project Settings → Cloud Messaging
- Ensure Cloud Messaging API is enabled
- Check if there are any error messages

---

## 🎯 **Recommended Action:**

Let's start completely fresh:

1. **Clear Everything:**
   - Uninstall app from device
   - Delete ALL SHA-256 fingerprints from Firebase Console

2. **Build Fresh APK:**
   - Trigger new build on GitHub Actions
   - Wait for completion
   - Download BOTH: app-release.apk AND signing-report

3. **Add Correct SHA-256:**
   - Open signing-report.txt from the build
   - Copy SHA-256
   - Add to Firebase Console
   - Save

4. **Install and Test:**
   - Install app-release.apk from the SAME build
   - Open app
   - Go to Notification Testing
   - Tap "Get Token"
   - Should work! ✅

---

## 🔍 **Debug Steps:**

If it still doesn't work, check:

1. **In Firebase Console:**
   - Go to Project Settings → General
   - Under "Your apps" → Android app
   - How many SHA-256 fingerprints are listed?
   - Copy them and share with me

2. **In signing-report.txt:**
   - What SHA-256 is shown?
   - Does it match ANY of the ones in Firebase?

3. **In the app:**
   - What exact error message do you see?
   - "Failed to get FCM token"
   - Or something else?

---

## ⚠️ **Common Mistake:**

**You added SHA-256 from Build #1, but installed APK from Build #2**

This won't work because each build might have a different signing key (if keystore changes).

**Always use APK and SHA-256 from the SAME build!**
