# 👑 Make ivy.waliaula@gmail.com Super Admin

## 🎯 **Quick Fix - Set Super Admin in Firebase Console**

Since you're using the old APK, you need to manually set yourself as Super Admin in Firebase.

---

## 📋 **Step-by-Step Instructions:**

### **Step 1: Open Firebase Console**
1. Go to: https://console.firebase.google.com/
2. Select: **Nkoroi FC** project
3. Click: **Firestore Database** (left sidebar)

---

### **Step 2: Create Super Admin Role**

#### **Option A: If `roles` collection doesn't exist yet:**

1. Click: **"Start collection"**
2. Collection ID: `roles`
3. Click: **"Next"**
4. Document ID: Enter the **User ID** of ivy.waliaula@gmail.com
   - If you don't know the User ID, check Authentication tab first
5. Add fields:
   ```
   Field: role
   Type: string
   Value: super_admin
   
   Field: email
   Type: string
   Value: ivy.waliaula@gmail.com
   
   Field: createdAt
   Type: timestamp
   Value: (current time)
   
   Field: isFirstUser
   Type: boolean
   Value: true
   ```
6. Click: **"Save"**

#### **Option B: If `roles` collection exists:**

1. Open: `roles` collection
2. Click: **"Add document"**
3. Document ID: Enter the **User ID** of ivy.waliaula@gmail.com
4. Add same fields as above
5. Click: **"Save"**

---

### **Step 3: Get User ID from Authentication**

If you don't know your User ID:

1. Click: **Authentication** (left sidebar)
2. Click: **"Users"** tab
3. Find: **ivy.waliaula@gmail.com**
4. Copy the **User UID** (looks like: `abc123xyz456...`)
5. Use this as Document ID in Step 2

---

## 🚀 **Easier Method: Wait for New APK**

**Recommended:** Just wait for the new APK to build and install it. Then:

1. **Uninstall** old app
2. **Install** new APK
3. **Register** ivy.waliaula@gmail.com
4. **Automatically** becomes Super Admin ✅

This is much easier than manual Firebase setup!

---

## ⚠️ **Important Notes:**

### **If using OLD APK:**
- Manual Firebase changes won't work
- Old APK uses AsyncStorage (local storage)
- Old APK doesn't connect to Firebase
- **You MUST install new APK!**

### **If using NEW APK:**
- First user to register = Super Admin automatically
- No manual setup needed
- Everything syncs across devices

---

## 📥 **Get New APK:**

**GitHub Actions:** https://github.com/Lavyuela/nkoroi-fc/actions

1. Click latest workflow run
2. Wait for build to complete (~15 min)
3. Download APK artifact
4. Install on both devices
5. Register ivy.waliaula@gmail.com
6. Automatically Super Admin! ✅

---

## 🎯 **Quick Summary:**

**Manual Method (Complex):**
1. Open Firebase Console
2. Go to Firestore Database
3. Create `roles` collection
4. Add document with your User ID
5. Set `role: super_admin`

**Automatic Method (Easy):**
1. Download new APK
2. Install on device
3. Register ivy.waliaula@gmail.com
4. Done! ✅

---

**Recommendation: Wait for new APK! It's much easier.** 🚀✅
