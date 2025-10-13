# 🚀 FCM V1 Setup - Step by Step Commands

Follow these steps **IN ORDER**. I'll tell you exactly what to do and where.

---

## 📥 STEP 1: Download Service Account JSON from Firebase

### What to do:
1. Open your web browser
2. Go to: **https://console.firebase.google.com/**
3. Click on your project: **NkoroiFC**
4. Click the **⚙️ gear icon** (top left) → **Project settings**
5. Click the **"Service accounts"** tab at the top
6. Scroll down and click the blue button: **"Generate new private key"**
7. A popup appears → Click **"Generate key"**
8. A file downloads (name like: `nkoroifc-9c964-firebase-adminsdk-xxxxx.json`)
9. **Save it to your Downloads folder** (remember the exact filename!)

⚠️ **IMPORTANT**: Keep this file secure! Don't share it or commit it to Git.

---

## 🔐 STEP 2: Upload Service Account to EAS

### Open Command Prompt:
1. Press `Windows + R`
2. Type: `cmd`
3. Press Enter

### Navigate to your project:
```cmd
cd C:\Users\Admin\Downloads\Nkoroi FC
```

### Run EAS credentials command:
```cmd
npx eas credentials
```

### Follow the prompts (I'll tell you what to select):

**Prompt 1:** "Select platform"
```
→ Use arrow keys to select: Android
→ Press Enter
```

**Prompt 2:** "What do you want to do?"
```
→ Look for one of these options:
   - "Set up push notification credentials"
   - "Manage credentials"
   - "Configure FCM"
→ Select it and press Enter
```

**Prompt 3:** "Select credentials type" (if asked)
```
→ Select: "FCM V1 service account key"
→ Press Enter
```

**Prompt 4:** "Path to service account JSON file"
```
→ Type the full path to your downloaded file, for example:
   C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-xxxxx.json
→ Press Enter
```

**Expected result:**
```
✔ Successfully uploaded FCM V1 service account key
```

✅ **Done!** Your FCM V1 credentials are now uploaded to EAS.

---

## 🧪 STEP 3: Test Notifications on Your Phone

### In the same Command Prompt, run:
```cmd
npx expo start
```

### What happens:
- A QR code appears in the terminal
- Metro bundler starts
- You'll see a URL like: `exp://192.168.x.x:8081`

### On your phone:
1. Open **Expo Go** app (download from Play Store if you don't have it)
2. Scan the QR code from the terminal
3. App will load on your phone

### Watch the terminal logs:
Look for a line that says:
```
✅ Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

**Copy this token!** You'll need it for testing.

---

## 📬 STEP 4: Send Test Notification

### Open your web browser:
1. Go to: **https://expo.dev/notifications**

### Fill in the form:
- **Expo Push Token**: Paste the token you copied
- **Title**: `Test Notification`
- **Message**: `FCM V1 is working!`
- **Sound**: Leave as default

### Click: **"Send a Notification"**

### Check your phone:
- You should receive the notification! 🎉
- If you don't see it, check the terminal for errors

---

## 🏗️ STEP 5: Build APK with FCM V1

### In Command Prompt (same window):

First, stop the dev server:
```
Press: Ctrl + C
Type: Y
Press: Enter
```

### Now build the APK:
```cmd
npx eas build -p android --profile preview
```

### What happens:
- EAS will ask you to log in (if not already)
- Build will start (takes 10-15 minutes)
- You'll get a URL to track progress

### Track the build:
```cmd
npx eas build:list
```

### When build completes:
- You'll get a download link
- Download the APK
- Install on your phone
- Test notifications again!

---

## 📋 Complete Command Reference

Here are all the commands in order:

```cmd
# 1. Navigate to project
cd C:\Users\Admin\Downloads\Nkoroi FC

# 2. Upload FCM credentials
npx eas credentials

# 3. Test locally
npx expo start

# 4. Build APK
npx eas build -p android --profile preview

# 5. Check build status
npx eas build:list
```

---

## ❓ Troubleshooting

### "npx is not recognized"
**Solution**: Install Node.js from https://nodejs.org/

### "eas credentials" shows no FCM option
**Solution**: Update EAS CLI first:
```cmd
npm install -g eas-cli
```
Then try again:
```cmd
npx eas credentials
```

### "Cannot find service account file"
**Solution**: Make sure you use the full path:
```cmd
C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-xxxxx.json
```
(Replace `xxxxx` with your actual filename)

### "Expo Go not connecting"
**Solution**: 
- Make sure phone and computer are on same WiFi
- Try tunnel mode:
```cmd
npx expo start --tunnel
```

### No push token appears
**Solution**:
- Use a physical device (not emulator)
- Grant notification permissions when prompted
- Restart the app

---

## ✅ Success Checklist

- [ ] Downloaded service account JSON from Firebase
- [ ] Ran `npx eas credentials` successfully
- [ ] Uploaded service account JSON
- [ ] Ran `npx expo start`
- [ ] Got Expo Push Token in logs
- [ ] Sent test notification from expo.dev/notifications
- [ ] Received notification on phone
- [ ] Built APK with `npx eas build`
- [ ] Installed APK and tested notifications

---

## 🎯 What's Next?

After successful setup:
1. Your APK will have working push notifications
2. You can send notifications from your admin panel
3. Notifications work even when app is closed
4. FCM V1 is future-proof and secure

---

**Need help?** Let me know which step you're on and I'll assist! 🚀
