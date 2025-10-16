# 🔑 Persistent Keystore Setup - Maintain Same SHA-256

## 🎯 Goal:
Keep the **same SHA-256** across all builds so you only need to add it to Firebase **once**.

---

## ⚠️ IMPORTANT - One-Time Setup Required:

You need to create a release keystore and add it to GitHub Secrets.

---

## 📋 Step-by-Step Setup:

### **Step 1: Generate Release Keystore** (One-time only)

Run this command in your terminal (Windows PowerShell):

```powershell
cd "C:\Users\Admin\Downloads\Nkoroi FC\android\app"

keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias nkoroifc-key -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be asked for:**
- Keystore password: (choose a strong password, e.g., `NkoroiFC2025!`)
- Key password: (can be same as keystore password)
- Your name: `Nkoroi FC`
- Organization: `Nkoroi FC`
- City, State, Country: (fill as needed)

**IMPORTANT:** Write down these passwords! You'll need them.

---

### **Step 2: Get SHA-256 from Your New Keystore**

```powershell
keytool -list -v -keystore release.keystore -alias nkoroifc-key
```

**Copy the SHA-256 value** - it will look like:
```
SHA256: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:...
```

---

### **Step 3: Add SHA-256 to Firebase Console**

1. Go to: https://console.firebase.google.com/project/nkoroifc-9c964/settings/general
2. Scroll to Android app
3. **Delete ALL old SHA-256 fingerprints**
4. Click "Add fingerprint"
5. **Paste the SHA-256** from Step 2
6. Click "Save"

✅ This SHA-256 will now work for **ALL future builds**!

---

### **Step 4: Convert Keystore to Base64**

```powershell
# In PowerShell
$bytes = [System.IO.File]::ReadAllBytes("release.keystore")
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Set-Clipboard
```

The base64 string is now in your clipboard!

---

### **Step 5: Add GitHub Secrets**

1. Go to: https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
2. Click "New repository secret"
3. Add these **4 secrets**:

| Secret Name | Value |
|-------------|-------|
| `RELEASE_KEYSTORE` | Paste the base64 string from clipboard |
| `KEYSTORE_PASSWORD` | Your keystore password (e.g., `NkoroiFC2025!`) |
| `KEY_ALIAS` | `nkoroifc-key` |
| `KEY_PASSWORD` | Your key password (same as keystore password) |

---

### **Step 6: Build APK**

Now when you build:

1. Go to: https://github.com/Lavyuela/nkoroi-fc/actions/workflows/build-apk.yml
2. Click "Run workflow"
3. Wait for build to complete
4. Download APK

✅ **Every build will now have the SAME SHA-256!**

---

## 🎉 Benefits:

- ✅ **Same SHA-256 forever** - no need to update Firebase
- ✅ **Topic subscription** - both phones get notifications simultaneously
- ✅ **Production-ready** - proper release signing
- ✅ **Secure** - keystore stored safely in GitHub Secrets

---

## 🧪 Testing Topic Notifications:

After installing the new APK on both phones:

1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Under "Target" → Select **"Topic"**
5. Enter topic name: `team_updates`
6. Click "Send test message"

✅ **Both phones will receive the notification at the same time!**

---

## 📝 Notes:

- The keystore file (`release.keystore`) should **NEVER** be committed to Git
- Keep your passwords safe - you'll need them if you ever rebuild the keystore
- The base64 keystore in GitHub Secrets is encrypted and secure
- You only need to do this setup **once**

---

## ⚠️ If You Skip This:

Without setting up the release keystore:
- ❌ Each build gets a **different SHA-256**
- ❌ You'll need to add new SHA-256 to Firebase after every build
- ❌ Old APKs will stop working with FCM

**Do the setup now to save time later!** 🚀
