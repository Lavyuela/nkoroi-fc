# 🚀 Simple APK Build Guide

## ⚠️ **GitHub Actions Failed - Use EAS Build Instead**

The GitHub Actions build failed because it needs Expo configuration. Let's use EAS Build (Expo's cloud build service).

---

## ✅ **Easiest Method: EAS Build (Recommended)**

### **Step 1: Install EAS CLI**
```bash
npm install -g eas-cli
```

### **Step 2: Login to Expo**
```bash
eas login
```

**Don't have an account?**
- Go to: https://expo.dev/signup
- Create FREE account
- Come back and run `eas login`

### **Step 3: Build APK**
```bash
cd "C:\Users\Admin\Downloads\Nkoroi FC"
eas build --platform android --profile preview
```

**This will:**
1. Upload your code to Expo servers
2. Build APK in the cloud (10-15 min)
3. Give you a download link ✅

---

## 📱 **After Build Completes:**

You'll see:
```
✅ Build finished
📱 Download: https://expo.dev/artifacts/eas/abc123.apk
```

**Then:**
1. Click the link
2. Download APK to your computer
3. Transfer to phone (USB, Google Drive, etc.)
4. Install on both devices
5. Go to Firebase Console → Authentication
6. Delete ivy.waliaula@gmail.com (if exists)
7. Open app → Register ivy.waliaula@gmail.com
8. **Result: Super Admin!** ✅

---

## 🔧 **Alternative: Manual Commands**

Open PowerShell and run these one by one:

```powershell
# Navigate to project
cd "C:\Users\Admin\Downloads\Nkoroi FC"

# Install dependencies (if not done)
npm install

# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

---

## ⏱️ **Timeline:**

```
Step 1: Install EAS CLI (1 min)
Step 2: Login to Expo (1 min)
Step 3: Start build (2 min to upload)
Wait: Expo builds APK (10-15 min)
Result: Download link ready! ✅
```

---

## 🎯 **Why This Works:**

```
EAS Build (Cloud):
├── You run command on your computer
├── Code uploads to Expo servers
├── Expo builds APK in the cloud
├── No Android SDK needed
├── No complex setup
└── Just works! ✅

GitHub Actions (Failed):
├── Needs Expo token in secrets
├── Needs proper configuration
├── More complex setup
└── We'll fix later
```

---

## 📋 **Quick Checklist:**

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Start build: `eas build --platform android --profile preview`
- [ ] Wait 15 minutes
- [ ] Download APK from link
- [ ] Install on devices
- [ ] Delete Firebase user
- [ ] Register fresh
- [ ] Become Super Admin! ✅

---

## 🆘 **Troubleshooting:**

### **"eas: command not found"**
```bash
npm install -g eas-cli
```

### **"Not logged in"**
```bash
eas login
```

### **"No Expo account"**
1. Go to: https://expo.dev/signup
2. Create account (FREE)
3. Run `eas login` again

### **Build fails**
- Check internet connection
- Make sure you're logged in
- Try again

---

## 🚀 **DO THIS NOW:**

**Open PowerShell and run:**

```powershell
npm install -g eas-cli
eas login
cd "C:\Users\Admin\Downloads\Nkoroi FC"
eas build --platform android --profile preview
```

**Then wait 15 minutes and download your APK!** ✅

---

## 📞 **Need Help?**

If you see any errors, copy the error message and let me know!

---

**This is the SIMPLEST way to build the APK with Firebase!** 🔥✅
