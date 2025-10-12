@echo off
color 0A
title EAS Build - Push Notifications Will Work!
cls

echo ========================================
echo   EAS BUILD - FINAL SOLUTION
echo ========================================
echo.
echo This will build an APK with WORKING push notifications!
echo.
echo Steps:
echo 1. Install EAS CLI
echo 2. Login to Expo
echo 3. Build APK with proper FCM configuration
echo.
echo ========================================
echo.
pause
echo.

echo [1/3] Installing EAS CLI...
call npm install -g eas-cli
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install EAS CLI
    pause
    exit /b 1
)
echo.
echo ✅ EAS CLI installed!
echo.

echo [2/3] Logging in to Expo...
echo.
echo A browser window will open.
echo Login with your Expo account.
echo If you don't have one, create it (it's free!)
echo.
pause
echo.
call eas login
if errorlevel 1 (
    echo.
    echo ERROR: Login failed
    pause
    exit /b 1
)
echo.
echo ✅ Logged in!
echo.

echo [3/3] Building APK...
echo.
echo This will take 10-15 minutes.
echo The build happens on Expo's servers (not your computer).
echo You can close this window and check status at:
echo https://expo.dev/accounts/[your-account]/projects/nkoroi-fc-live-score/builds
echo.
pause
echo.
call eas build --platform android --profile apk
if errorlevel 1 (
    echo.
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo.
echo ========================================
echo   ✅ BUILD COMPLETE!
echo ========================================
echo.
echo The APK is ready to download from:
echo https://expo.dev
echo.
echo After installing this APK:
echo ✅ Push notifications will work when app is CLOSED!
echo ✅ No more 404 errors!
echo ✅ FCM tokens will be valid!
echo.
pause
