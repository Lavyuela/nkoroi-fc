# Update GitHub Secrets to Use Debug Keystore

This will make your GitHub Actions builds use the same keystore as your local builds, so they have the same SHA fingerprints.

## Step 1: Copy the Base64 Encoded Keystore

The debug keystore has been encoded and saved to:
```
android\app\debug-keystore-base64.txt
```

**Copy ALL the content** from that file (including the BEGIN and END lines).

## Step 2: Update GitHub Secrets

1. **Go to your GitHub repository**:
   ```
   https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
   ```

2. **Update these secrets**:

   ### RELEASE_KEYSTORE
   - Click on `RELEASE_KEYSTORE`
   - Click "Update secret"
   - Paste the ENTIRE content from `debug-keystore-base64.txt`
   - Click "Update secret"

   ### KEYSTORE_PASSWORD
   - Click on `KEYSTORE_PASSWORD`
   - Click "Update secret"
   - Enter: `android`
   - Click "Update secret"

   ### KEY_ALIAS
   - Click on `KEY_ALIAS`
   - Click "Update secret"
   - Enter: `androiddebugkey`
   - Click "Update secret"

   ### KEY_PASSWORD
   - Click on `KEY_PASSWORD`
   - Click "Update secret"
   - Enter: `android`
   - Click "Update secret"

## Step 3: Trigger a New Build

After updating the secrets, trigger a new build:

### Option A: Push a Small Change
```bash
git commit --allow-empty -m "Rebuild with debug keystore"
git push origin main
```

### Option B: Manual Trigger
1. Go to: https://github.com/Lavyuela/nkoroi-fc/actions
2. Click on "Build Android APK" workflow
3. Click "Run workflow"
4. Click the green "Run workflow" button

## Step 4: Verify

Once the build completes:

1. **Download the new APK** from GitHub Actions
2. **Install it** on your device
3. **Test login and notifications** - should work now!

## Why This Works

Your local debug keystore SHA:
- **SHA1**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- **SHA256**: `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`

These are already registered in Firebase Console, so when GitHub builds use the same keystore, the APK will work with Firebase authentication and FCM.

## Alternative: Add GitHub Build SHA to Firebase

If you prefer to keep separate keystores:

1. Download the current APK from GitHub Actions
2. Extract its SHA:
   ```bash
   keytool -printcert -jarfile app-release.apk
   ```
3. Add that SHA to Firebase Console → Project Settings → Your Android App → Add fingerprint

---

**Recommended**: Use the debug keystore for both (simpler and works perfectly for development/testing).
