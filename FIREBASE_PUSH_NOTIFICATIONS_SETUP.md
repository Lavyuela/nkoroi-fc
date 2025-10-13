# 🔔 Firebase Push Notifications Setup Guide

## ✅ What's Already Done

1. **google-services.json** ✓
   - Located at: `./android/app/google-services.json`
   - Package name: `com.nkoroifc.livescore`
   - Project ID: `nkoroifc-9c964`

2. **app.json Configuration** ✓
   - `googleServicesFile` configured
   - `useNextNotificationsApi` enabled
   - Notifications icon and color configured
   - Plugins added: `expo-notifications`, `@react-native-firebase/app`

3. **App.js Notification Code** ✓
   - Push token registration
   - Notification handlers
   - Firestore listener for real-time notifications
   - Android notification channel setup

## 🚀 Next Steps to Complete Setup

### Step 1: Upload FCM Credentials to EAS

You need to link your Firebase credentials with Expo/EAS:

```bash
npx eas credentials
```

**Follow these prompts:**
1. Select platform: **Android**
2. Select action: **Upload FCM key** (or similar option)
3. You'll need your Firebase Server Key:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: **nkoroifc-9c964**
   - Go to **Project Settings** (gear icon) → **Cloud Messaging** tab
   - Find **Server key** or **Legacy server key**
   - Copy and paste it when prompted

> **Note:** If you don't see the FCM key option, you may need to enable Cloud Messaging API in Google Cloud Console.

---

### Step 2: Test Notifications on Physical Device

#### 2a. Start the Development Server

```bash
npx expo start
```

#### 2b. Open on Your Phone
- Scan the QR code with Expo Go app
- Watch the terminal/logs for your **Expo Push Token**
- It will look like: `ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]`

#### 2c. Send a Test Notification
1. Go to: https://expo.dev/notifications
2. Paste your Expo Push Token
3. Enter a title and message
4. Click **Send a Notification**
5. You should receive it on your phone! 🎉

---

### Step 3: Enable Firebase Cloud Messaging API

If you encounter issues with FCM:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **nkoroifc-9c964**
3. Go to **APIs & Services** → **Library**
4. Search for **Firebase Cloud Messaging API**
5. Click **Enable**

---

### Step 4: Build Your APK with Notifications

Once testing works in Expo Go, build your APK:

```bash
npx eas build -p android --profile preview
```

This will:
- Include your `google-services.json`
- Bundle Firebase configuration
- Enable push notifications in the standalone APK

---

## 📱 Testing Checklist

- [ ] Run `npx eas credentials` and upload FCM key
- [ ] Start app with `npx expo start`
- [ ] Open app on physical device
- [ ] Copy Expo Push Token from logs
- [ ] Send test notification from https://expo.dev/notifications
- [ ] Verify notification appears on device
- [ ] Build APK with `npx eas build -p android --profile preview`
- [ ] Install APK on device and test notifications again

---

## 🔧 Troubleshooting

### No Push Token Generated
- Make sure you're using a **physical device** (not emulator)
- Check that notification permissions are granted
- Restart the app and check logs

### Notifications Not Received
- Verify FCM credentials are uploaded to EAS
- Check Firebase Cloud Messaging API is enabled
- Ensure app has notification permissions
- Check device is connected to internet

### Build Fails
- Verify `google-services.json` exists at `./android/app/google-services.json`
- Check package name matches: `com.nkoroifc.livescore`
- Run `npx expo-doctor` to check for issues

---

## 📊 Current Configuration Summary

| Setting | Value |
|---------|-------|
| Package Name | `com.nkoroifc.livescore` |
| Firebase Project | `nkoroifc-9c964` |
| Google Services File | `./android/app/google-services.json` |
| Notification Icon | `./assets/nkoroifclogo.png` |
| Notification Color | `#4FC3F7` |
| EAS Project ID | `7f3faf6f-5c89-4a7b-8bd5-03e48f0c6098` |

---

## 🎯 Quick Commands Reference

```bash
# Upload FCM credentials
npx eas credentials

# Start development server
npx expo start

# Build preview APK
npx eas build -p android --profile preview

# Check build status
npx eas build:list

# View build logs
npx eas build:view [BUILD_ID]
```

---

## 📝 Notes

- Your app already has Firestore listener for real-time notifications
- Expo Push Tokens are automatically generated on app start
- Consider saving user tokens to Firestore for targeted notifications
- Test thoroughly on physical device before building APK

---

**Last Updated:** Configuration complete, ready for FCM credential upload and testing.
