# Simple SHA Fix - Just Add It to Firebase

Stop fighting with GitHub secrets. Just add the GitHub build's SHA to Firebase.

## Step 1: Get the SHA from GitHub Build

### Option A: From Workflow Logs (Current Build)
1. Go to: https://github.com/Lavyuela/nkoroi-fc/actions
2. Click on the latest workflow run
3. Click on "🔍 Verify Keystore SHA Fingerprints" step
4. Copy the SHA1 and SHA256 values shown

### Option B: Download APK and Extract SHA
1. Download the APK from GitHub Actions artifacts
2. Run this command where you downloaded it:
   ```bash
   keytool -printcert -jarfile app-release.apk
   ```
3. Copy the SHA1 and SHA256 from the output

### Option C: Check Previous Build Logs
If you saw the SHA in a previous build, just use that one.

## Step 2: Add SHA to Firebase Console

1. **Go to Firebase Console**:
   ```
   https://console.firebase.google.com/project/nkoroifc-9c964/settings/general
   ```

2. **Scroll down** to "Your apps" section

3. **Click on your Android app** (com.nkoroifc.livescore)

4. **Scroll to "SHA certificate fingerprints"**

5. **Click "Add fingerprint"**

6. **Paste the SHA-1** from GitHub build

7. **Click "Add fingerprint" again**

8. **Paste the SHA-256** from GitHub build

9. **Done!** No need to rebuild

## Step 3: Test

1. Download the existing APK from GitHub (the one with different SHA)
2. Install it on your device
3. It should work now because Firebase recognizes the SHA

## Why This Works

Firebase allows **multiple SHA fingerprints** per app. You can have:
- Your local debug keystore SHA (already registered)
- Your GitHub release keystore SHA (add this now)
- Any other keystores you use

All of them will work with Firebase authentication and FCM.

## Current SHAs in Firebase

You should have these registered:

1. **Local Debug Keystore** (already there):
   - SHA1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
   - SHA256: `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`

2. **GitHub Release Keystore** (add this):
   - SHA1: [Get from workflow logs or APK]
   - SHA256: [Get from workflow logs or APK]

## No More Rebuilding Needed

Once you add the SHA to Firebase, the existing APK will work immediately. No need to:
- Update GitHub secrets
- Rebuild the app
- Wait for workflows
- Fight with base64 encoding

Just add the SHA and you're done! 🎉

---

**Next Step**: Tell me the SHA from your GitHub build logs and I'll confirm it's correct, or just add it directly to Firebase Console.
