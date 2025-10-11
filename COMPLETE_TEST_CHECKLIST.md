# ✅ Complete Test Checklist - Before Using App

## 🔧 **Critical Bugs Fixed:**

### **1. Matches Not Appearing**
- ❌ **Bug:** `subscribeToMatches` was ordering by `date` field
- ✅ **Fix:** Changed to `createdAt` (the actual field name)
- **Result:** Matches will now appear on home screen

### **2. Updates Failing**
- ❌ **Bug:** Function `createTeamUpdate` didn't exist
- ✅ **Fix:** Added alias `export const createTeamUpdate = createUpdate`
- **Result:** Team updates will now save successfully

### **3. No Notifications**
- ❌ **Bug:** Notifications saved to Firestore but never shown
- ✅ **Fix:** App.js now listens to Firebase and shows Expo notifications
- **Result:** Notifications will appear on all devices

### **4. Missing getMatch Function**
- ❌ **Bug:** MatchDetailScreen imported `getMatch` but it didn't exist
- ✅ **Fix:** Added `getMatch` function
- **Result:** Match details will load properly

### **5. Text Not Visible in User Management**
- ❌ **Bug:** Chip text was too small (10px)
- ✅ **Fix:** Increased to 12px with bold font
- **Result:** Role badges are now clearly readable

---

## 📋 **Complete Test Checklist:**

### **Phase 1: Installation (Both Devices)**

- [ ] Download latest APK from GitHub Actions
- [ ] Verify build name: "CRITICAL BUGS FIXED"
- [ ] Uninstall old Nkoroi FC app
- [ ] Install new APK
- [ ] Allow "Install from unknown sources"

### **Phase 2: Firebase Cleanup**

- [ ] Go to Firebase Console: https://console.firebase.google.com/
- [ ] Select Nkoroi FC project
- [ ] **Authentication → Users:** Delete ALL users
- [ ] **Firestore → roles:** Delete collection
- [ ] **Firestore → users:** Delete collection
- [ ] **Firestore → matches:** Delete collection
- [ ] **Firestore → updates:** Delete collection
- [ ] **Firestore → notifications:** Delete collection
- [ ] Verify all collections are empty

### **Phase 3: Registration (Device 1)**

- [ ] Open app
- [ ] **Permission popup appears** ✅
- [ ] Allow notifications
- [ ] Click "Register"
- [ ] Email: ivy.waliaula@gmail.com
- [ ] Password: (at least 6 characters)
- [ ] Click "Register"
- [ ] **Should see:** "👑 Super Admin Mode" ✅
- [ ] **Verify in Firebase:**
  - [ ] Authentication → 1 user exists
  - [ ] Firestore → roles collection created
  - [ ] Role document shows: `role: super_admin`

### **Phase 4: Login (Device 2)**

- [ ] Open app
- [ ] **Permission popup appears** ✅
- [ ] Allow notifications
- [ ] Click "Login"
- [ ] Email: ivy.waliaula@gmail.com
- [ ] Password: (same as Device 1)
- [ ] Click "Login"
- [ ] **Should see:** "👑 Super Admin Mode" ✅

---

## 🎯 **Functionality Tests:**

### **Test 1: Create Match**

**Device 1:**
- [ ] Click "+" button (bottom right)
- [ ] Select "Create Match"
- [ ] Home Team: "Nkoroi FC"
- [ ] Away Team: "Test Team"
- [ ] Venue: "Home Ground"
- [ ] Select date and time
- [ ] Click "Create Match"
- [ ] **Success message appears** ✅
- [ ] **Match appears on home screen** ✅

**Device 2:**
- [ ] **Notification received:** "⚽ New Match! Nkoroi FC vs Test Team" ✅
- [ ] **Match appears on home screen** ✅

**Firebase Console:**
- [ ] Firestore → matches collection exists
- [ ] Match document contains all data
- [ ] Firestore → notifications collection exists
- [ ] Notification document created

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 2: Start Match & Add Goal**

**Device 1:**
- [ ] Click on the match
- [ ] Match details screen opens
- [ ] Click "Start Match" button
- [ ] **Status changes to "LIVE"** ✅
- [ ] Click "Goal" or "Add Event"
- [ ] Select "Home" team
- [ ] Enter player name (optional)
- [ ] Click "Add"
- [ ] **Score updates: 1-0** ✅

**Device 2:**
- [ ] **Notification received:** "⚽ GOAL! 0'" ✅
- [ ] Open match
- [ ] **Score shows: 1-0** ✅
- [ ] **Event appears in match timeline** ✅

**Firebase Console:**
- [ ] Match document updated
- [ ] `homeScore: 1`
- [ ] `status: live`
- [ ] `events` array contains goal
- [ ] New notification document created

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 3: Create Team Update**

**Device 1:**
- [ ] Go to "Updates" tab
- [ ] Click "+" button
- [ ] Title: "Training Tomorrow"
- [ ] Content: "Team training at 5 PM"
- [ ] Type: "Training"
- [ ] Click "Post Update"
- [ ] **Success message appears** ✅
- [ ] **Update appears in list** ✅

**Device 2:**
- [ ] **Notification received:** "📢 Team Update! Training Tomorrow" ✅
- [ ] Go to "Updates" tab
- [ ] **Update appears in list** ✅

**Firebase Console:**
- [ ] Firestore → updates collection exists
- [ ] Update document contains title, content, type
- [ ] New notification document created

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 4: User Management**

**Device 1:**
- [ ] Go to "Account" tab
- [ ] Click "User Management"
- [ ] **See yourself listed** ✅
- [ ] **"Super Admin" badge visible and readable** ✅
- [ ] **"You" chip visible** ✅
- [ ] Stats show: "Super: 1, Admins: 0, Fans: 0" ✅

**Register another user (Device 2 or web):**
- [ ] Register: mangajuliah5@gmail.com
- [ ] Should become "Fan"

**Device 1 - Make Admin:**
- [ ] Refresh User Management
- [ ] **See 2 users** ✅
- [ ] Click menu (⋮) on mangajuliah5@gmail.com
- [ ] Click "Make Admin"
- [ ] Confirm
- [ ] **"Admin" badge appears** ✅

**Firebase Console:**
- [ ] roles collection has 2 documents
- [ ] mangajuliah5@gmail.com role updated to `admin`

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 5: Real-Time Sync**

**Device 1:**
- [ ] Create a new match

**Device 2:**
- [ ] **Match appears within 1 second** ✅

**Device 1:**
- [ ] Add a goal to the match

**Device 2:**
- [ ] **Score updates within 1 second** ✅
- [ ] **Event appears in timeline** ✅

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 6: Notifications Permission**

**Fresh Install:**
- [ ] Uninstall app
- [ ] Install APK
- [ ] Open app
- [ ] **Permission popup appears immediately** ✅
- [ ] Click "Allow"
- [ ] **Can receive notifications** ✅

**Result:** ✅ PASS / ❌ FAIL

---

## 🐛 **Known Issues to Watch For:**

### **If matches don't appear:**
1. Check Firebase Console → matches collection exists?
2. Check console logs: "✅ Loaded X matches from Firebase"
3. If error: "orderBy requires an index" → Wait 5 minutes for Firebase to create index

### **If updates fail:**
1. Check console logs for errors
2. Verify `createTeamUpdate` function exists in firebaseService.js
3. Check Firebase Console → updates collection

### **If notifications don't appear:**
1. Check phone notification settings
2. Check Do Not Disturb is OFF
3. Check Firebase Console → notifications collection has documents
4. Check console logs: "📬 Notification shown: ..."

### **If text not visible:**
1. Check User Management screen
2. Role badges should have white text on colored background
3. Font size should be 12px, bold

---

## ✅ **Success Criteria:**

All tests must PASS for the app to be considered working:

- ✅ Matches create and appear on both devices
- ✅ Notifications received on both devices
- ✅ Updates create and appear on both devices
- ✅ Real-time sync works (< 1 second delay)
- ✅ User management works
- ✅ Text is clearly visible
- ✅ Permission popup appears on first launch

---

## 📊 **Final Verification:**

After all tests pass:

1. **Create 3 matches** → All appear on both devices ✅
2. **Add goals to each** → Notifications received ✅
3. **Create 2 updates** → Notifications received ✅
4. **Register 2 more users** → User management shows all ✅
5. **Make one admin** → Role updates correctly ✅

**If ALL tests pass → App is ready for production!** 🚀✅

---

## 🔥 **Critical Files Modified:**

1. **src/services/firebaseService.js**
   - Fixed `subscribeToMatches` orderBy field
   - Added `createTeamUpdate` alias
   - Added `getMatch` function
   - Simplified notification sending

2. **App.js**
   - Added Expo notification permission request
   - Added Firebase notification listener
   - Shows notifications when created

3. **src/screens/UserManagementScreen.js**
   - Increased chip text size (10px → 12px)
   - Made text bold for better visibility

---

**Test thoroughly before declaring success!** ✅
