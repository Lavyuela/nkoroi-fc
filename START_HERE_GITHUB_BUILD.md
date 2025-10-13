# 🚀 START HERE - Build APK via GitHub

## ✅ Changes Pushed to GitHub!

Your workflow is updated and ready. Now follow these 3 simple steps:

---

## 📋 Step 1: Add GitHub Secrets (2 minutes)

### Go to: https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions

### Add Secret #1:
1. Click **"New repository secret"**
2. **Name**: `GOOGLE_SERVICES_JSON`
3. **Value**: 
   - Open file: `google-services-base64.txt`
   - Copy ALL the text (it's one long line)
   - Paste it
4. Click **"Add secret"**

### Add Secret #2:
1. Click **"New repository secret"** again
2. **Name**: `FIREBASE_SERVICE_ACCOUNT`
3. **Value**:
   - Open file: `firebase-service-account-base64.txt`
   - Copy ALL the text (it's one long line)
   - Paste it
4. Click **"Add secret"**

---

## 📋 Step 2: Run the Build (1 minute)

### Go to: https://github.com/Lavyuela/nkoroi-fc/actions

1. Click **"Build Android APK"** (left sidebar)
2. Click **"Run workflow"** button (top right)
3. Make sure branch is: **main**
4. Click **"Run workflow"** (green button)

---

## 📋 Step 3: Download APK (after 10 minutes)

1. Wait for build to complete (green ✅)
2. Click on the completed build
3. Scroll to bottom → **"Artifacts"** section
4. Click **"app-release"** to download
5. Extract ZIP → Install APK on phone

---

## 🎉 That's It!

Your APK will have:
- ✅ Push notifications (FCM V1)
- ✅ Firebase integration
- ✅ All your app features

---

## 🔔 Test Notifications

After installing:
1. Open the app
2. Grant notification permissions
3. Test from your admin panel
4. Or add notification in Firestore

---

## 🆘 Need Help?

Check these files:
- `GITHUB_BUILD_READY.md` - Detailed instructions
- `GITHUB_BUILD_WITH_NOTIFICATIONS.md` - Full guide

---

**Start with Step 1:** Add the 2 secrets to GitHub!
