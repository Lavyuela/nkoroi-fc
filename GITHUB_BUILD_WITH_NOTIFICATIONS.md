# 🚀 Build APK via GitHub with Push Notifications

## ✅ This Method:
- **FREE** - No EAS build limits
- **Includes FCM V1** - Push notifications work
- **Uses GitHub Actions** - Builds in the cloud
- **No new account needed** - Uses your existing GitHub

---

## 📋 Setup Steps

### **Step 1: Encode google-services.json**

We need to add your Firebase config as a GitHub secret.

**Run this command:**

```cmd
cd C:\Users\Admin\Downloads\Nkoroi FC
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('android/app/google-services.json'))" > google-services-base64.txt
```

This creates a file called `google-services-base64.txt` with encoded content.

---

### **Step 2: Add GitHub Secret**

1. **Open the encoded file:**
   - Open `google-services-base64.txt` in Notepad
   - Copy ALL the text (it's one long line)

2. **Go to GitHub:**
   - Open: https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
   - Click **"New repository secret"**

3. **Add the secret:**
   - **Name**: `GOOGLE_SERVICES_JSON`
   - **Value**: Paste the encoded text
   - Click **"Add secret"**

---

### **Step 3: Add Firebase Service Account (for FCM V1)**

We need to add your FCM V1 credentials to GitHub too.

**Run this command:**

```cmd
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json'))" > firebase-service-account-base64.txt
```

**Add to GitHub:**
1. Open `firebase-service-account-base64.txt`
2. Copy all the text
3. Go to: https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
4. Click **"New repository secret"**
5. **Name**: `FIREBASE_SERVICE_ACCOUNT`
6. **Value**: Paste the encoded text
7. Click **"Add secret"**

---

### **Step 4: Update GitHub Workflow**

The workflow needs to include the Firebase service account. I'll update it for you.

---

### **Step 5: Push to GitHub**

```cmd
cd C:\Users\Admin\Downloads\Nkoroi FC
git add .
git commit -m "Add FCM V1 support for GitHub builds"
git push origin main
```

---

### **Step 6: Trigger Build**

1. Go to: https://github.com/Lavyuela/nkoroi-fc/actions
2. Click on **"Build Android APK"** workflow
3. Click **"Run workflow"** button
4. Click **"Run workflow"** (green button)
5. Wait 5-10 minutes

---

### **Step 7: Download APK**

1. Build completes (green checkmark ✅)
2. Click on the build
3. Scroll down to **"Artifacts"** section
4. Click **"app-release"** to download
5. Extract the ZIP file
6. Install the APK on your phone

---

## 🔔 How Notifications Work with This Method

### What's Included:
- ✅ `google-services.json` - Firebase configuration
- ✅ Firebase Service Account - FCM V1 credentials
- ✅ App.js notification code - Already in your app
- ✅ Expo notifications - Handles push tokens

### How It Works:
1. **App starts** → Registers with Expo for push notifications
2. **Gets push token** → Unique identifier for device
3. **Listens to Firestore** → Real-time notification updates
4. **Receives notifications** → Via FCM V1 API

---

## 📊 Comparison: GitHub vs EAS

| Feature | GitHub Actions | EAS Build |
|---------|---------------|-----------|
| Cost | **FREE (unlimited)** | Limited free builds |
| Build Time | 5-10 minutes | 10-15 minutes |
| FCM V1 Support | ✅ Yes | ✅ Yes |
| Setup Complexity | Medium | Easy |
| Monthly Limit | **None** | Resets monthly |

---

## 🔧 Troubleshooting

### Build Fails: "google-services.json not found"
- Make sure you added the `GOOGLE_SERVICES_JSON` secret
- Check the secret name is exactly: `GOOGLE_SERVICES_JSON`
- Verify the base64 encoding was correct

### Notifications Don't Work
- Verify `FIREBASE_SERVICE_ACCOUNT` secret is added
- Check the service account JSON is correct
- Make sure app has notification permissions

### Can't Download APK
- Wait for build to complete (green checkmark)
- Look for "Artifacts" section at bottom of build page
- Download and extract the ZIP file

---

## 🎯 Quick Command Summary

```cmd
# 1. Encode google-services.json
cd C:\Users\Admin\Downloads\Nkoroi FC
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('android/app/google-services.json'))" > google-services-base64.txt

# 2. Encode Firebase service account
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json'))" > firebase-service-account-base64.txt

# 3. Push to GitHub
git add .
git commit -m "Add FCM V1 support"
git push origin main
```

---

## ✅ Success Checklist

- [ ] Encoded google-services.json to base64
- [ ] Added `GOOGLE_SERVICES_JSON` secret to GitHub
- [ ] Encoded Firebase service account to base64
- [ ] Added `FIREBASE_SERVICE_ACCOUNT` secret to GitHub
- [ ] Updated workflow file (I'll do this)
- [ ] Pushed changes to GitHub
- [ ] Triggered workflow from Actions tab
- [ ] Build completed successfully
- [ ] Downloaded APK from Artifacts
- [ ] Installed APK on phone
- [ ] Tested push notifications

---

## 🎉 Benefits

- **No EAS limits** - Build as many times as you want
- **No new account** - Use existing GitHub
- **FCM V1 included** - Modern push notifications
- **Free forever** - GitHub Actions is free for public repos
- **Fast builds** - 5-10 minutes

---

**Ready to start?** Run the encoding commands and I'll update the workflow for you!
