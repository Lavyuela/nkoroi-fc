# Fix SHA Issue - Complete Guide

The GitHub build is still using a different SHA, which means the secrets weren't updated correctly or there's a caching issue.

## What I Just Did

1. **Added SHA verification** to the workflow
2. **Pushed the change** - a new build is starting now
3. The workflow will now **display the SHA** it's using

## Check the New Build

1. Go to: https://github.com/Lavyuela/nkoroi-fc/actions
2. Click on the latest workflow run: **"Add SHA verification step to workflow"**
3. Look for the step: **"🔍 Verify Keystore SHA Fingerprints"**
4. Check if the SHA matches:
   - **Expected SHA1**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
   - **Expected SHA256**: `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`

## If SHA Still Doesn't Match

The GitHub secrets might not have been updated correctly. Here's how to verify:

### Option A: Double-Check GitHub Secrets

1. **Go to secrets page**:
   ```
   https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
   ```

2. **Verify these secrets exist**:
   - `RELEASE_KEYSTORE` - Should be the base64 encoded debug keystore
   - `KEYSTORE_PASSWORD` - Should be `android`
   - `KEY_ALIAS` - Should be `androiddebugkey`
   - `KEY_PASSWORD` - Should be `android`

3. **If any are wrong, update them**:
   - Click on the secret name
   - Click "Update secret"
   - Enter the correct value
   - Click "Update secret"

### Option B: Use the Correct Base64 Format

The issue might be with how the keystore was encoded. Let me create a properly formatted version:

**The keystore content to paste in `RELEASE_KEYSTORE`**:

```
-----BEGIN CERTIFICATE-----
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
BQ==
-----END CERTIFICATE-----
```

**Copy everything above** (including BEGIN and END lines) and paste it into the `RELEASE_KEYSTORE` secret.

### Option C: Alternative Solution - Add GitHub SHA to Firebase

If updating secrets is difficult, you can instead add the GitHub build's SHA to Firebase:

1. **Check the workflow logs** to see what SHA GitHub is using
2. **Add that SHA to Firebase Console**:
   - Go to Firebase Console → Project Settings
   - Click your Android app
   - Scroll to "SHA certificate fingerprints"
   - Click "Add fingerprint"
   - Paste the SHA from GitHub logs
   - Save

This way, both keystores will work with Firebase.

## After Updating Secrets

1. **Wait for current build to finish** (to see the SHA in logs)
2. **If SHA doesn't match**, update the secrets as described above
3. **Trigger another build**:
   ```bash
   git commit --allow-empty -m "Test with updated secrets"
   git push origin main
   ```
4. **Check the new build logs** for the SHA verification step
5. **Download and test the APK**

## Quick Test

Once you have an APK with the correct SHA:
1. Install it on your device
2. Login - should work now
3. Go to Admin Dashboard → Send Notifications
4. Send a test notification
5. Verify all users receive it

---

**Current Status**: A new build is running with SHA verification. Check the logs to see what SHA it's using, then we can fix it accordingly.
