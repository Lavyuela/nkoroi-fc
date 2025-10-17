# How to Get SHA from GitHub Actions Build

Your GitHub Actions build uses a different keystore (stored in secrets), which generates a different SHA-1/SHA-256 than your local debug keystore.

## Quick Fix: Add GitHub Build SHA to Firebase

### Method 1: Extract SHA from APK (Easiest)

1. **Download the APK from GitHub Actions**
   - Go to: https://github.com/Lavyuela/nkoroi-fc/actions
   - Click on the latest successful build
   - Download the APK artifact

2. **Extract SHA from APK**
   ```bash
   # On Windows (in the folder where you downloaded the APK)
   keytool -printcert -jarfile app-release.apk
   ```

3. **Copy the SHA-1 and SHA-256** from the output

4. **Add to Firebase Console**
   - Go to Firebase Console → Project Settings
   - Click on your Android app
   - Scroll to "SHA certificate fingerprints"
   - Click "Add fingerprint"
   - Paste the SHA-1
   - Click "Add fingerprint" again
   - Paste the SHA-256

### Method 2: Use Debug Keystore for GitHub (Simpler)

Instead of using a separate release keystore, use your debug keystore for GitHub builds too:

1. **Encode your debug keystore**
   ```bash
   # In your project root
   certutil -encode android\app\debug.keystore debug-keystore-base64.txt
   ```

2. **Update GitHub Secret**
   - Go to GitHub → Settings → Secrets and variables → Actions
   - Update `RELEASE_KEYSTORE` with the content of `debug-keystore-base64.txt`
   - Update `KEYSTORE_PASSWORD` to `android`
   - Update `KEY_ALIAS` to `androiddebugkey`
   - Update `KEY_PASSWORD` to `android`

3. **Rebuild on GitHub**
   - Push any change or manually trigger the workflow
   - The new APK will have the same SHA as your local builds

### Method 3: Get SHA from GitHub Workflow (Add to Workflow)

Add this step to your `.github/workflows/build-apk.yml` to print the SHA:

```yaml
- name: 📋 Display SHA Fingerprints
  run: |
    cd android
    keytool -list -v -keystore app/release.keystore \
      -alias ${{ secrets.KEY_ALIAS }} \
      -storepass ${{ secrets.KEYSTORE_PASSWORD }} \
      -keypass ${{ secrets.KEY_PASSWORD }} | grep -E "SHA1|SHA256"
```

Then check the workflow logs to see the SHA values.

## Current Situation

### Your Local Debug Keystore SHA
Run this to see your local SHA:
```bash
cd android
keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Look for:
- **SHA1**: (copy this)
- **SHA256**: (copy this)

### Firebase Console
Make sure BOTH SHAs are added:
1. Your local debug keystore SHA (for development)
2. Your GitHub release keystore SHA (for production APK)

## Recommended Solution

**Use the same keystore everywhere** (debug keystore is fine for testing):

1. Update GitHub secrets to use debug keystore
2. This way, local builds and GitHub builds have the same SHA
3. No need to manage multiple SHAs in Firebase

OR

**Keep separate keystores** (more secure for production):

1. Extract SHA from GitHub-built APK
2. Add it to Firebase Console
3. Keep both SHAs registered in Firebase

## Quick Test

After adding the SHA to Firebase:
1. Download the APK from GitHub
2. Install it on your device
3. Try to login - it should work now!
4. Test sending notifications

---

**Need help?** Let me know which method you prefer and I'll guide you through it!
