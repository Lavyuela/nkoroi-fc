# Firebase Cloud Messaging (FCM) Setup Guide - Nkoroi FC App

## ✅ What's Already Configured

Your Nkoroi FC app now has **complete Firebase Cloud Messaging integration**! Here's what's been set up:

### 1. ✅ Dependencies Installed
- `@react-native-firebase/messaging` (v21.8.0) - FCM SDK
- `@notifee/react-native` (v9.0.0) - Local notifications & channels
- `react-native-share` (v10.0.2) - Image sharing

### 2. ✅ Android Configuration
- ✅ `google-services.json` in `android/app/` folder
- ✅ Notification permissions in `AndroidManifest.xml`
- ✅ FCM service configured
- ✅ Notification channels setup
- ✅ Default notification icon & color

### 3. ✅ Code Implementation
- ✅ **NotificationService.js** - Complete notification handling
- ✅ **NotificationTestScreen.js** - Testing interface
- ✅ **App.js** - Auto-initialization on app start
- ✅ Background & foreground message handlers
- ✅ Notification opened handlers
- ✅ Token refresh handlers

---

## 📱 How to Use

### **For Testing (In-App)**

1. **Build New APK:**
   ```
   Go to: https://github.com/Lavyuela/nkoroi-fc/actions/workflows/build-apk.yml
   Click: "Run workflow" → "Run workflow"
   Wait: ~10-15 minutes
   Download: New APK with FCM
   ```

2. **Access Test Screen:**
   - Open app as **Admin**
   - Go to **Admin Dashboard**
   - Tap **"Test Notifications"** (bell icon)

3. **Test Local Notifications:**
   - Tap **"Request Permission"** (if needed)
   - Tap **"Initialize Service"**
   - Tap **"Send Test Notification"** ✅
   - Check notification tray!

4. **Get FCM Token:**
   - Tap **"Get FCM Token"**
   - Copy the token (shows at bottom)
   - Use this for Firebase Console testing

---

## 🔥 Sending Notifications from Firebase Console

### **Method 1: Test Message (Single Device)**

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/nkoroifc-9c964/messaging
   ```

2. **Click "Send your first message"** or **"New campaign"**

3. **Fill in notification details:**
   - **Notification title:** `⚽ Match Update`
   - **Notification text:** `Nkoroi FC vs Opponent - Match starting soon!`
   - **Image URL (optional):** Leave blank or add image URL

4. **Click "Send test message"**

5. **Add FCM token:**
   - Paste the token from the app (from "Get FCM Token" button)
   - Click **"+"** to add it

6. **Click "Test"**

7. **Check your phone!** 📱
   - Put app in background or close it
   - Notification should appear in ~5 seconds

### **Method 2: Campaign (All Users)**

1. **Go to Firebase Console → Cloud Messaging**

2. **Click "New campaign" → "Notifications"**

3. **Fill notification details:**
   - Title: `🔥 GOAL!`
   - Text: `Nkoroi FC scores! Watch live now.`

4. **Click "Next"**

5. **Select target:**
   - **App:** `Nkoroi FC Live Score`
   - **User segment:** `All users` or custom

6. **Click "Next"** → **"Review"** → **"Publish"**

7. **All users receive notification!** 🎉

---

## 📋 Notification Types Available

### **1. Test Notification**
```javascript
NotificationService.sendTestNotification();
```
- Simple test to verify FCM works
- Shows in notification tray

### **2. Match Update**
```javascript
NotificationService.sendMatchUpdateNotification({
  id: 'match-123',
  homeTeam: 'Nkoroi FC',
  awayTeam: 'Opponent',
  venue: 'Strathmore Complex',
});
```
- Sent before match starts
- Channel: `match_updates`

### **3. Score Update**
```javascript
NotificationService.sendScoreUpdateNotification({
  id: 'match-123',
  homeTeam: 'Nkoroi FC',
  awayTeam: 'Opponent',
  homeScore: 1,
  awayScore: 0,
  scorer: 'John Doe',
  scoringTeam: 'Nkoroi FC',
});
```
- Sent when goal is scored
- Channel: `score_updates`

### **4. Custom Notification**
```javascript
NotificationService.displayNotification({
  title: 'Custom Title',
  body: 'Custom message',
  data: {
    type: 'custom',
    matchId: '123',
  },
});
```

---

## 🔧 How It Works

### **Foreground (App Open)**
1. FCM receives message
2. `onMessage` handler triggered
3. Notifee displays local notification
4. User sees notification in tray

### **Background (App Minimized)**
1. FCM receives message
2. `setBackgroundMessageHandler` triggered
3. Notifee displays notification
4. User sees notification in tray

### **Quit State (App Closed)**
1. FCM receives message
2. Android system displays notification
3. `getInitialNotification` triggered on app open
4. App can navigate based on notification data

### **Notification Tapped**
1. User taps notification
2. App opens
3. `onNotificationOpenedApp` triggered
4. App navigates to relevant screen

---

## 📊 Notification Channels (Android)

| Channel ID | Name | Importance | Use Case |
|------------|------|------------|----------|
| `default` | Default Notifications | HIGH | General notifications |
| `match_updates` | Match Updates | HIGH | Pre-match announcements |
| `score_updates` | Score Updates | HIGH | Goal notifications |

---

## 🧪 Testing Checklist

### **✅ Local Notifications (No Firebase Console Needed)**
- [ ] Request permission
- [ ] Initialize service
- [ ] Send test notification
- [ ] Send match update
- [ ] Send score update
- [ ] Check notification tray

### **✅ FCM Notifications (From Firebase Console)**
- [ ] Get FCM token from app
- [ ] Send test message to token
- [ ] Receive notification (app in background)
- [ ] Tap notification → app opens
- [ ] Send campaign to all users
- [ ] All users receive notification

### **✅ Different States**
- [ ] Foreground (app open) → Shows notification
- [ ] Background (app minimized) → Shows notification
- [ ] Quit (app closed) → Shows notification
- [ ] Tap notification → Opens app

---

## 🚀 Sending Notifications from Your Backend (Future)

When you want to send notifications programmatically:

### **1. Get Server Key:**
```
Firebase Console → Project Settings → Cloud Messaging → Server key
```

### **2. Send HTTP Request:**
```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "USER_FCM_TOKEN",
    "notification": {
      "title": "Match Update",
      "body": "Nkoroi FC vs Opponent - Live now!"
    },
    "data": {
      "matchId": "123",
      "type": "match_update"
    }
  }'
```

### **3. Send to Multiple Users:**
```javascript
// Save FCM tokens to Firestore when users log in
await firestore().collection('users').doc(userId).update({
  fcmToken: token,
});

// Retrieve tokens and send notifications
const users = await firestore().collection('users').get();
const tokens = users.docs.map(doc => doc.data().fcmToken);

// Send to multiple tokens
await admin.messaging().sendMulticast({
  tokens: tokens,
  notification: {
    title: '⚽ Match Starting!',
    body: 'Nkoroi FC vs Opponent - Live now!',
  },
});
```

---

## 📱 User Experience

### **When Notification Arrives:**
1. **Sound** plays (default notification sound)
2. **Vibration** pattern (300ms, 500ms)
3. **Icon** shows in status bar (Nkoroi FC logo)
4. **Notification** appears in tray with:
   - Title (bold)
   - Message body
   - App icon
   - Timestamp

### **When User Taps Notification:**
1. App opens (or comes to foreground)
2. Can navigate to specific screen based on `data.type`:
   - `match_update` → Match Detail screen
   - `score_update` → Match Detail screen
   - `custom` → Custom handling

---

## 🔐 Security & Best Practices

### **✅ Already Implemented:**
- ✅ Permission requests (Android 13+)
- ✅ Token refresh handling
- ✅ Background message handling
- ✅ Notification channels
- ✅ Error handling & logging

### **📝 Recommendations:**
- **Save FCM tokens** to Firestore for each user
- **Update tokens** when they refresh
- **Remove tokens** when user logs out
- **Segment users** for targeted notifications
- **Track** notification delivery & opens

---

## 🐛 Troubleshooting

### **Problem: No notifications received**
**Solutions:**
1. Check notification permission is granted
2. Verify `google-services.json` is correct
3. Ensure app is in background/closed for FCM test
4. Check Firebase Console for errors
5. Verify FCM token is correct

### **Problem: "Failed to capture view snapshot"**
**Solution:**
- Already fixed! Use preview before sharing

### **Problem: Permission denied**
**Solution:**
- Go to Android Settings → Apps → Nkoroi FC → Notifications → Enable

### **Problem: Token not generated**
**Solution:**
1. Check internet connection
2. Verify Firebase project is correct
3. Rebuild APK with latest code

---

## 📦 Build Instructions

### **Build APK with FCM:**
```bash
# All changes are committed and pushed
# Build via GitHub Actions:
https://github.com/Lavyuela/nkoroi-fc/actions/workflows/build-apk.yml

# Or build locally:
cd android
./gradlew clean
./gradlew assembleRelease
```

### **If Build Fails:**
```bash
# Clear Gradle cache
cd android
./gradlew clean
./gradlew cleanBuildCache

# Reinstall dependencies
cd ..
rm -rf node_modules
npm install

# Rebuild
cd android
./gradlew assembleRelease
```

---

## ✅ Summary

### **What You Have:**
- ✅ Complete FCM integration
- ✅ Local & remote notifications
- ✅ Test screen for admins
- ✅ Background & foreground handling
- ✅ Notification channels
- ✅ Permission management
- ✅ Token management
- ✅ Error handling

### **What You Can Do:**
- ✅ Send test notifications from app
- ✅ Send notifications from Firebase Console
- ✅ Send to single user or all users
- ✅ Customize notification content
- ✅ Track notification opens
- ✅ Navigate based on notification type

### **Next Steps:**
1. **Build new APK** with FCM
2. **Test local notifications** in app
3. **Get FCM token** from test screen
4. **Send test from Firebase Console**
5. **Verify notifications work**
6. **Send to all users** when ready!

---

## 🎉 You're Ready!

Firebase Cloud Messaging is fully integrated and ready to use. Build the APK, test notifications, and start engaging your users with real-time match updates!

**Questions?** Check the code in:
- `src/services/NotificationService.js`
- `src/screens/NotificationTestScreen.js`
- `App.js`

**Happy notifying!** 🔔⚽🎉
