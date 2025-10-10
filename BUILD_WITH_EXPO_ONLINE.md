# 🚀 Build APK with Expo Online - Step by Step

## ✅ Follow These Steps Exactly

### **Step 1: Open PowerShell**
1. Press `Windows + X`
2. Click "Windows PowerShell"

### **Step 2: Navigate to Project**
```powershell
cd "c:\Users\Admin\Downloads\Nkoroi FC"
```

### **Step 3: Login to Expo**
```powershell
eas login
```

**You'll see:**
- Option to login with existing account
- OR create new account

**Choose one:**
- **If you have Expo account:** Enter email and password
- **If you don't:** Choose "Sign up" and create free account

### **Step 4: Start the Build**
```powershell
eas build --platform android --profile preview
```

**You'll be asked:**

1. **"Would you like to automatically create an EAS project?"**
   - Type: `Y` and press Enter

2. **"Generate a new Android Keystore?"**
   - Type: `Y` and press Enter

3. **Build will start!**

### **Step 5: Wait for Build**

You'll see:
```
✔ Build started, it may take a few minutes to complete.
Build details: https://expo.dev/accounts/[your-username]/projects/nkoroi-fc-live-score/builds/[build-id]
```

**Click the link** or go to: https://expo.dev

### **Step 6: Monitor Build**

1. Go to the link provided
2. Watch build progress (10-15 minutes)
3. You'll see:
   - ⏳ Queued
   - 🔄 Building
   - ✅ Finished

### **Step 7: Download APK**

When build is complete:
1. Click **"Download"** button
2. Save the APK file
3. **Done!** 🎉

---

## 📱 Install APK on Your Phone

1. Transfer APK to your phone (USB, WhatsApp, Drive)
2. Open the APK file
3. Enable "Install from Unknown Sources" if asked
4. Tap "Install"
5. Open the app!

---

## 🆘 Troubleshooting

### **"eas: command not found"**
Run:
```powershell
npm install -g eas-cli
```

### **"Not logged in"**
Run:
```powershell
eas login
```

### **Build fails**
- Check the build logs on expo.dev
- The link is provided when build starts
- Copy error message and search online

### **Can't create account**
- Use any email address
- Password must be 8+ characters
- Verify your email

---

## 💡 Tips

- **First build takes 10-15 minutes**
- **Subsequent builds are faster (5-10 minutes)**
- **You get 30 free builds per month**
- **APK link expires after 30 days** (download it!)

---

## 🎯 Quick Commands Reference

```powershell
# Navigate to project
cd "c:\Users\Admin\Downloads\Nkoroi FC"

# Login
eas login

# Build APK
eas build --platform android --profile preview

# Check build status
eas build:list
```

---

## ✅ Success!

Once you download the APK:
- ✅ Install on your phone
- ✅ Share with your team
- ✅ App works offline
- ✅ 10x faster than Expo Go
- ✅ Full notifications support

---

**Ready? Open PowerShell and start with Step 2!** 🚀
