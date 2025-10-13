# 🔧 Notification Troubleshooting Guide

## ❌ Notification Not Received - Diagnosis

You ran the test script and Firestore shows the notification was created, but you didn't receive it on your phone. Let's diagnose why.

---

## 🔍 Step 1: Verify You Have the NEW APK

### **Did you rebuild after my fix?**

The fix I made was pushed 30 minutes ago. You need to:

1. ✅ Go to GitHub Actions
2. ✅ Run "Build Android APK" workflow
3. ✅ Wait for build to complete
4. ✅ Download NEW APK
5. ✅ Uninstall old app
6. ✅ Install new APK

**If you're still using the old APK, the fix isn't there!**

---

## 🔍 Step 2: Check Notification Permissions

### On your phone:

1. **Settings** → **Apps** → **Nkoroi FC Live Score**
2. Tap **Notifications**
3. Check:
   - ✅ Notifications: **ON**
   - ✅ "Default" channel: **Enabled**
   - ✅ Sound: **Enabled**
   - ✅ Pop on screen: **Enabled**

---

## 🔍 Step 3: Check if App is Running

The Firestore listener only works when the app is running:

1. **Open the app**
2. **Don't close it** (keep it in background is OK)
3. **Then** create notification in Firestore

**If app is force-closed, notifications won't work!**

---

## 🔍 Step 4: Test with Expo Push Service

This bypasses Firestore and tests if notifications work at all:

### **Get your Expo Push Token:**

1. Open the app
2. If you can see logs, look for: `Expo Push Token: ExponentPushToken[...]`
3. Copy that token

### **Test at Expo's website:**

1. Go to: **https://expo.dev/notifications**
2. Paste your Expo Push Token
3. Enter:
   - Title: "Direct Test"
   - Message: "Testing Expo push"
4. Click "Send a Notification"

**If this works:** Problem is with Firestore listener
**If this doesn't work:** Problem is with notification permissions or app setup

---

## 🔍 Step 5: Check App Logs

Connect your phone via USB and run:

```cmd
adb logcat | findstr "Expo Push Token"
```

This will show your push token.

Then run:

```cmd
adb logcat | findstr /C:"📬" /C:"✅" /C:"❌" /C:"🔔"
```

This shows all notification activity. You should see:
```
🔔 Notification listener started at: ...
📥 Firestore snapshot received, changes: 1
📬 New notification detected: ...
```

If you don't see these logs, the app isn't running properly.

---

## 🎯 Most Likely Issues:

### **Issue 1: Old APK**
- **Solution**: Rebuild from GitHub Actions with latest code

### **Issue 2: App Not Running**
- **Solution**: Open app and keep it running

### **Issue 3: Permissions Denied**
- **Solution**: Enable notifications in app settings

### **Issue 4: Notification Created Before App Started**
- **Solution**: Open app FIRST, then create notification

---

## 🚀 Recommended Test Sequence:

1. **Uninstall old app**
2. **Download latest APK from GitHub Actions**
3. **Install new APK**
4. **Open app**
5. **Check Settings → Apps → Notifications (enable all)**
6. **Keep app open**
7. **Run:** `node send-test-notification.js`
8. **Watch phone**

---

## 🆘 If Still Not Working:

### **Try Expo Push Test:**

1. Get your Expo Push Token from app logs
2. Test at: https://expo.dev/notifications
3. If that works, problem is Firestore listener
4. If that doesn't work, problem is notification permissions

### **Check Build Version:**

Make sure your APK includes the fix:
- Latest commit should be: "Fix notification channel setup and add debug logging"
- Build should be from AFTER this commit

---

## 📝 Quick Checklist:

- [ ] Downloaded NEW APK from GitHub (after my fix)
- [ ] Uninstalled old app
- [ ] Installed new APK
- [ ] Opened app
- [ ] Granted notification permissions
- [ ] App is running (not force-closed)
- [ ] Created notification AFTER opening app
- [ ] Notification has recent timestamp

---

**Next Step:** Rebuild the APK from GitHub Actions and try again with the new version!
