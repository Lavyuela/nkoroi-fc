@echo off
echo ========================================
echo Getting SHA from GitHub Build
echo ========================================
echo.
echo 1. Go to: https://github.com/Lavyuela/nkoroi-fc/actions
echo.
echo 2. Click on the latest completed workflow
echo.
echo 3. Look for the step: "Verify Keystore SHA Fingerprints"
echo.
echo 4. Copy the SHA1 and SHA256 values
echo.
echo 5. Then go to Firebase Console:
echo    https://console.firebase.google.com/project/nkoroifc-9c964/settings/general
echo.
echo 6. Scroll to your Android app
echo.
echo 7. Click "Add fingerprint" and paste the SHA1
echo.
echo 8. Click "Add fingerprint" again and paste the SHA256
echo.
echo ========================================
echo DONE! Your APK will work immediately
echo ========================================
pause
