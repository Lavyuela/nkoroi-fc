# 🔥 Firebase Cloud Messaging API (V1) Setup Guide

## ✅ Why FCM V1?

- **Modern & Recommended**: Google's latest FCM implementation
- **More Secure**: Uses service account credentials instead of legacy keys
- **Future-Proof**: Legacy API will be deprecated eventually
- **Already Enabled**: Your Firebase project already has FCM V1 enabled!

---

## 📥 Step 1: Download Service Account JSON from Firebase

### 1a. Go to Firebase Project Settings

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **NkoroiFC** (nkoroifc-9c964)
3. Click the **⚙️ Settings gear icon** → **Project settings**

### 1b. Navigate to Service Accounts

1. Click on the **Service accounts** tab (top menu)
2. You should see a section titled **"Firebase Admin SDK"**

### 1c. Generate New Private Key

1. Scroll down to find the button: **"Generate new private key"**
2. Click it
3. A popup will appear warning you to keep this file secure
4. Click **"Generate key"**
5. A JSON file will download automatically
   - It will be named something like: `nkoroifc-9c964-firebase-adminsdk-xxxxx.json`

### 1d. Save the File Securely

⚠️ **IMPORTANT**: This file contains sensitive credentials!

- **DO NOT** commit it to Git
- **DO NOT** share it publicly
- Save it in a secure location on your computer
- You'll upload it to EAS in the next step (EAS stores it securely)

---

## 🔐 Step 2: Upload Service Account to EAS

Now you'll upload this JSON file to Expo Application Services (EAS):

### 2a. Run EAS Credentials Command

Open your terminal in the project directory and run:

```bash
npx eas credentials
```

### 2b. Follow the Prompts

1. **Select platform**: Choose **Android**

2. **Select action**: Look for one of these options:
   - **"Set up FCM V1 credentials"**
   - **"Upload FCM service account key"**
   - **"Manage credentials"** → then select FCM/Push Notifications

3. **Upload the JSON file**:
   - When prompted, provide the path to your downloaded JSON file
   - Example: `C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-xxxxx.json`

4. **Confirm**: EAS will validate and upload the credentials

### 2c. Verify Upload

After upload, you should see a confirmation message like:
```
✔ Successfully uploaded FCM V1 service account key
```

---

## 🧪 Step 3: Test Push Notifications

### 3a. Start Development Server

```bash
npx expo start
```

### 3b. Open on Physical Device

- Scan QR code with **Expo Go** app
- Watch the terminal logs for your **Expo Push Token**
- It looks like: `ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]`

### 3c. Send Test Notification

1. Go to: **https://expo.dev/notifications**
2. Paste your Expo Push Token
3. Enter:
   - **Title**: "Test Notification"
   - **Message**: "FCM V1 is working!"
4. Click **"Send a Notification"**

### 3d. Verify Receipt

- You should receive the notification on your device
- Check terminal logs for delivery confirmation

---

## 🏗️ Step 4: Build APK with FCM V1

Once testing works, build your production APK:

```bash
npx eas build -p android --profile preview
```

EAS will automatically:
- Include your FCM V1 credentials
- Bundle `google-services.json`
- Configure Firebase properly

---

## 📂 File Locations Checklist

Make sure these files are in place:

- ✅ `./android/app/google-services.json` - Already exists
- ✅ `./app.json` - Already configured
- ✅ `./App.js` - Notification code added
- 🔐 Service Account JSON - Uploaded to EAS (not in project)

---

## 🔍 Troubleshooting

### "Cannot find service account option"

If you don't see FCM V1 options in `eas credentials`:

1. Update EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Try again:
   ```bash
   npx eas credentials
   ```

### "Service account JSON invalid"

- Make sure you downloaded the correct file from **Service accounts** tab
- The file should contain fields like: `project_id`, `private_key`, `client_email`
- Re-download if needed

### "Notifications not received"

1. Verify FCM API (V1) is **Enabled** in Firebase (it is in your screenshot)
2. Check app has notification permissions
3. Ensure device has internet connection
4. Try sending from https://expo.dev/notifications first

### "Build fails with FCM error"

- Verify `google-services.json` is at `./android/app/google-services.json`
- Check package name matches: `com.nkoroifc.livescore`
- Run `npx expo-doctor` to diagnose issues

---

## 📊 What You Have vs What You Need

| Item | Status | Location |
|------|--------|----------|
| Firebase Project | ✅ Exists | nkoroifc-9c964 |
| FCM V1 API | ✅ Enabled | Firebase Console |
| google-services.json | ✅ Added | ./android/app/ |
| app.json config | ✅ Updated | Root directory |
| Notification code | ✅ Added | App.js |
| Service Account JSON | ⏳ Need to download | Firebase → Service accounts |
| EAS Credentials | ⏳ Need to upload | Via `eas credentials` |

---

## 🎯 Quick Reference Commands

```bash
# Update EAS CLI (if needed)
npm install -g eas-cli

# Upload FCM credentials
npx eas credentials

# Test locally
npx expo start

# Build APK
npx eas build -p android --profile preview

# Check build status
npx eas build:list
```

---

## 🔒 Security Best Practices

1. **Never commit** service account JSON to Git
2. **Add to .gitignore** if you save it locally:
   ```
   *firebase-adminsdk*.json
   ```
3. **Rotate keys** if accidentally exposed
4. **Use EAS Secrets** for production (credentials are stored securely)

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Service account JSON uploaded to EAS without errors
2. ✅ App generates Expo Push Token on startup
3. ✅ Test notification from expo.dev/notifications arrives
4. ✅ Built APK receives notifications

---

## 📞 Next Steps After Setup

Once FCM V1 is working:

1. **Save user tokens** to Firestore for targeted notifications
2. **Send notifications** from your admin panel
3. **Test on built APK** (not just Expo Go)
4. **Monitor** Firebase Cloud Messaging dashboard

---

**Ready to start?** Follow Step 1 to download your service account JSON! 🚀
