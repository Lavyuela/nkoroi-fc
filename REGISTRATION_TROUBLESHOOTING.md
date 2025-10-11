# 🔧 Registration Troubleshooting Guide

## 🚨 **"Registration Refused" - Possible Causes:**

### **1. Still Using OLD APK**
**Symptom:** Error says "Account already exists"
**Cause:** Old APK checking AsyncStorage
**Fix:** 
- Verify you downloaded from GitHub Actions
- Check file date (should be recent)
- Uninstall completely before installing

### **2. Firebase Not Connected**
**Symptom:** Error says "Registration failed. Please try again."
**Cause:** `google-services.json` missing or Firebase not initialized
**Fix:** 
- Check if `google-services.json` is in `android/app/`
- Rebuild APK if file was added after build

### **3. Email Already in Firebase**
**Symptom:** Error says "An account with this email already exists"
**Cause:** Email already registered in Firebase Auth
**Fix:**
- Go to Firebase Console → Authentication
- Delete the existing user
- Try registering again

### **4. Weak Password**
**Symptom:** Error says "Password must be at least 6 characters"
**Cause:** Password too short
**Fix:** Use password with 6+ characters

### **5. Invalid Email**
**Symptom:** Error says "Invalid email address"
**Cause:** Email format incorrect
**Fix:** Use proper email format (e.g., ivy.waliaula@gmail.com)

### **6. No Internet Connection**
**Symptom:** Registration hangs or times out
**Cause:** Device not connected to internet
**Fix:** Connect to WiFi or mobile data

---

## 🔍 **How to Diagnose:**

### **Step 1: Check Which APK You Have**

Open the app and go to Account screen:

**OLD APK:**
```
Mode: Offline Mode (Local Storage)
```

**NEW APK:**
```
Mode: Firebase Cloud Sync (Real-time)
```

If you see "Offline Mode", you have the WRONG APK!

---

### **Step 2: Check Firebase Console**

1. Go to: https://console.firebase.google.com/
2. Select: Nkoroi FC project
3. Click: **Authentication**
4. Check: **Users** tab

**If you see ivy.waliaula@gmail.com listed:**
- This means the email is already registered in Firebase
- You need to DELETE this user first
- Then try registering again

**How to delete:**
1. Click on the user
2. Click "Delete user"
3. Confirm deletion
4. Try registering again in the app

---

### **Step 3: Check Internet Connection**

Firebase requires internet to work:
- ✅ WiFi connected
- ✅ Mobile data enabled
- ✅ Good signal strength

---

### **Step 4: Check App Logs**

If you can access logs (via USB debugging):

**Look for:**
```
✅ User registered: ivy.waliaula@gmail.com as super_admin
```

**Or errors like:**
```
❌ auth/email-already-in-use
❌ auth/network-request-failed
❌ auth/invalid-api-key
```

---

## 🛠️ **Solutions:**

### **Solution 1: Delete Existing Firebase User**

1. **Firebase Console:** https://console.firebase.google.com/
2. **Select:** Nkoroi FC
3. **Go to:** Authentication → Users
4. **Find:** ivy.waliaula@gmail.com
5. **Click:** Three dots (⋮) → Delete user
6. **Confirm:** Delete
7. **Try again:** Register in app ✅

---

### **Solution 2: Clear App Data & Reinstall**

1. **Uninstall** app completely
2. **Clear** any remaining data:
   - Settings → Apps → Nkoroi FC → Clear data
3. **Restart** device
4. **Install** new APK
5. **Try registering** ✅

---

### **Solution 3: Verify APK is Correct**

**Check APK file:**
- File name should include date/time
- File size should be ~40-60 MB
- Downloaded from GitHub Actions (not old file)

**To be 100% sure:**
1. Delete all APK files from Downloads
2. Go to GitHub Actions again
3. Download fresh APK
4. Install
5. Try registering

---

### **Solution 4: Check google-services.json**

The APK MUST have been built AFTER you added `google-services.json`:

**Timeline check:**
1. When did you add `google-services.json`? 
2. When was the APK built (check GitHub Actions timestamp)?
3. APK build time MUST be AFTER file was added

**If APK is older:**
- Trigger new build (push any change to GitHub)
- Wait for build to complete
- Download new APK
- Install

---

## 📋 **Step-by-Step Fresh Start:**

### **Complete Reset:**

1. **Firebase Console:**
   - Delete all users from Authentication
   - Delete all documents from Firestore (if any)

2. **Device 1:**
   - Uninstall app
   - Clear app data (Settings → Apps)
   - Restart device
   - Install NEW APK
   - Open app
   - Register: ivy.waliaula@gmail.com

3. **Check Firebase:**
   - Go to Authentication → Users
   - Should see: ivy.waliaula@gmail.com ✅
   - Go to Firestore → roles collection
   - Should see: Document with role = 'super_admin' ✅

4. **Check App:**
   - Should show: "👑 Super Admin Mode" ✅

---

## 🎯 **Most Common Issue:**

**90% of the time, the issue is:**

```
❌ User downloaded OLD APK (before Firebase was added)
❌ Or APK was built before google-services.json was added
```

**Solution:**
1. Check GitHub Actions for LATEST build
2. Build timestamp should be AFTER Firebase code was pushed
3. Download that APK
4. Install
5. Register ✅

---

## 📞 **What to Tell Me:**

If it still doesn't work, tell me:

1. **Exact error message** you see
2. **Account screen shows:** "Offline Mode" or "Firebase Cloud Sync"?
3. **Firebase Console:** Do you see ivy.waliaula@gmail.com in Authentication?
4. **APK source:** Downloaded from where? When?
5. **Internet:** Connected to WiFi/data?

---

## ✅ **Expected Behavior (NEW APK):**

```
1. Open app → See Register screen
2. Enter: ivy.waliaula@gmail.com + password
3. Click: Register
4. Loading spinner appears
5. Success! → Auto-login
6. Home screen shows: "👑 Super Admin Mode"
7. Account screen shows: "Firebase Cloud Sync (Real-time)"
8. Firebase Console shows: User in Authentication ✅
```

---

**Most likely you need to delete the existing Firebase user first!**

**Go here:** https://console.firebase.google.com/ → Authentication → Delete ivy.waliaula@gmail.com → Try again ✅
