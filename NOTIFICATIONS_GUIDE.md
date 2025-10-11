# 📬 Firebase Notifications - Complete Guide

## ✅ **What's Been Added:**

### **Automatic Notifications:**
1. ✅ **New Match Created** → All users notified
2. ✅ **Score Updated** → All users notified
3. ✅ **Team Update Posted** → All users notified
4. ✅ **Real-time delivery** via Firebase Cloud Messaging

---

## 🎯 **How It Works:**

### **When Admin Creates Match:**
```
Admin (Device 1):
├── Creates match: "Nkoroi vs Arsenal"
├── Saved to Firebase Firestore
└── Notification sent to ALL users

All Fans (All Devices):
├── Receive notification: "⚽ New Match!"
├── Notification shows: "Nkoroi vs Arsenal"
└── Tap notification → Opens app to match details
```

### **When Admin Updates Score:**
```
Admin (Device 1):
├── Updates score: Nkoroi 2 - 1 Arsenal
├── Saved to Firebase Firestore
└── Notification sent to ALL users

All Fans (All Devices):
├── Receive notification: "🔔 Score Update!"
├── Notification shows: "Nkoroi 2 - 1 Arsenal"
└── Match screen updates in real-time
```

### **When Admin Posts Update:**
```
Admin (Device 1):
├── Posts team update: "Training tomorrow at 5pm"
├── Saved to Firebase Firestore
└── Notification sent to ALL users

All Fans (All Devices):
├── Receive notification: "📢 Team Update!"
├── Notification shows: "Training tomorrow at 5pm"
└── Tap notification → Opens app to updates
```

---

## 📱 **Notification Flow:**

### **Step 1: User Opens App**
```
App starts
  ↓
Request notification permission
  ↓
User grants permission ✅
  ↓
Firebase generates FCM token
  ↓
Token saved to user's Firestore document
  ↓
User ready to receive notifications! ✅
```

### **Step 2: Admin Creates Content**
```
Admin creates match/update
  ↓
Content saved to Firestore
  ↓
Notification function triggered
  ↓
Get all user FCM tokens from Firestore
  ↓
Queue notification for all tokens
  ↓
Firebase Cloud Messaging sends to devices ✅
```

### **Step 3: Fans Receive Notification**
```
Firebase sends notification
  ↓
Device receives notification
  ↓
Notification appears on lock screen
  ↓
User taps notification
  ↓
App opens to relevant content ✅
```

---

## 🔔 **Notification Types:**

### **1. New Match Notification**
```
Title: ⚽ New Match!
Body: Nkoroi FC vs Arsenal
Data: { matchId, type: 'new_match' }
Sent to: ALL users
Triggered by: Admin creates match
```

### **2. Score Update Notification**
```
Title: 🔔 Score Update!
Body: Nkoroi FC 2 - 1 Arsenal
Data: { matchId, type: 'score_update' }
Sent to: ALL users
Triggered by: Admin updates match score
```

### **3. Team Update Notification**
```
Title: 📢 Team Update!
Body: Training tomorrow at 5pm
Data: { updateId, type: 'team_update' }
Sent to: ALL users
Triggered by: Admin posts team update
```

---

## 🎯 **Who Gets Notifications:**

### **Current Implementation:**
- ✅ **ALL users** receive notifications
- ✅ **Super Admins** receive notifications
- ✅ **Admins** receive notifications
- ✅ **Fans** receive notifications

### **Future: Role-Based Notifications**
You can also send notifications to specific roles:

```javascript
// Send to only Fans
await sendNotificationToRole('fan', 'Title', 'Body');

// Send to only Admins
await sendNotificationToRole('admin', 'Title', 'Body');

// Send to everyone
await sendNotificationToAllUsers('Title', 'Body');
```

---

## 📊 **Notification Storage:**

### **Firestore Collections:**

#### **users collection:**
```javascript
{
  "user-id-123": {
    email: "fan@example.com",
    fcmToken: "ExponentPushToken[...]",  // ← FCM token stored here
    fcmTokenUpdatedAt: timestamp,
    createdAt: timestamp
  }
}
```

#### **notifications collection:**
```javascript
{
  "notification-id-123": {
    title: "⚽ New Match!",
    body: "Nkoroi FC vs Arsenal",
    data: { matchId: "match-123", type: "new_match" },
    tokens: ["token1", "token2", "token3"],  // All user tokens
    createdAt: timestamp,
    sent: false  // Will be true when Firebase sends it
  }
}
```

---

## 🚀 **Testing Notifications:**

### **Test 1: New Match Notification**
1. **Device 1 (Admin):** Login as Super Admin
2. **Device 2 (Fan):** Login as Fan
3. **Device 1:** Create a new match
4. **Device 2:** Should receive notification ✅
5. **Tap notification:** App opens to match ✅

### **Test 2: Score Update Notification**
1. **Device 1 (Admin):** Open a match
2. **Device 2 (Fan):** Keep app in background
3. **Device 1:** Update the score
4. **Device 2:** Should receive notification ✅
5. **Tap notification:** App opens to updated match ✅

### **Test 3: Team Update Notification**
1. **Device 1 (Admin):** Go to Updates screen
2. **Device 2 (Fan):** Keep app in background
3. **Device 1:** Post a team update
4. **Device 2:** Should receive notification ✅
5. **Tap notification:** App opens to updates ✅

### **Test 4: Cross-Device Sync**
1. **Device 1:** Create match
2. **Device 2:** Receive notification
3. **Device 3:** Receive notification
4. **All devices:** See same match instantly ✅

---

## 🔍 **Verifying Notifications Work:**

### **Check 1: FCM Token Saved**
1. Open Firebase Console
2. Go to Firestore Database
3. Open `users` collection
4. Find your user document
5. Check `fcmToken` field exists ✅

### **Check 2: Notification Queued**
1. Create a match as Admin
2. Go to Firestore Database
3. Open `notifications` collection
4. Should see new notification document ✅
5. Check `tokens` array has user tokens ✅

### **Check 3: App Logs**
When app starts, you should see:
```
✅ Notifications enabled, FCM token: ExponentPushToken[...]
```

When match is created:
```
✅ Match created: match-123
✅ Notification queued for 5 users
```

---

## ⚙️ **Notification Settings:**

### **User Permissions:**
- Users must grant notification permission
- Permission requested on first app launch
- Can be changed in device settings

### **Notification Channels (Android):**
- Match notifications
- Score updates
- Team updates
- System notifications

---

## 🎯 **Expected Behavior:**

### **Scenario 1: Admin Creates Match**
```
Admin Device:
1. Opens app
2. Creates match: "Nkoroi vs Arsenal"
3. Match saved to Firebase
4. Sees success message

Fan Devices (All):
1. Receive notification: "⚽ New Match!"
2. Notification shows: "Nkoroi vs Arsenal"
3. Tap notification → App opens
4. See new match in list ✅
```

### **Scenario 2: Admin Updates Score**
```
Admin Device:
1. Opens match
2. Updates score: 2-1
3. Score saved to Firebase
4. Sees updated score

Fan Devices (All):
1. Receive notification: "🔔 Score Update!"
2. Notification shows: "Nkoroi 2 - 1 Arsenal"
3. If app is open → Score updates instantly
4. If app is closed → Tap notification to see ✅
```

### **Scenario 3: Multiple Admins**
```
Admin 1 (Device 1):
1. Creates match
2. Notification sent to ALL users (including Admin 2)

Admin 2 (Device 2):
1. Receives notification ✅
2. Can also create matches
3. Can update scores
4. Sends notifications to ALL users ✅
```

---

## 📋 **Troubleshooting:**

### **Issue: Not receiving notifications**
**Causes:**
1. Notification permission not granted
2. FCM token not saved
3. App not connected to Firebase

**Fixes:**
1. Check device notification settings
2. Reinstall app and grant permission
3. Check Firebase Console for FCM token
4. Verify `google-services.json` is in place

### **Issue: Notifications delayed**
**Cause:** Firebase Cloud Messaging delivery time
**Normal:** 1-5 seconds delay
**Fix:** This is normal behavior

### **Issue: Duplicate notifications**
**Cause:** Multiple FCM tokens for same user
**Fix:** Clear app data and re-login

---

## ✅ **Summary:**

### **What's Automatic:**
- ✅ New match → Notification sent
- ✅ Score update → Notification sent
- ✅ Team update → Notification sent
- ✅ All users notified instantly
- ✅ Works across all devices
- ✅ Real-time delivery

### **What Admins Do:**
1. Create match → Fans notified automatically ✅
2. Update score → Fans notified automatically ✅
3. Post update → Fans notified automatically ✅

### **What Fans Experience:**
1. Receive notification on phone ✅
2. Tap notification → App opens ✅
3. See new content instantly ✅
4. Real-time updates without refresh ✅

---

**Notifications are fully automatic! Admins just create content, Firebase handles the rest.** 📬✅
