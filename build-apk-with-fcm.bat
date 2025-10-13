@echo off
echo ========================================
echo Build APK with FCM V1 Notifications
echo ========================================
echo.

echo Prerequisites Check:
echo ========================================
echo.
echo Before building, make sure you have:
echo   ✓ Downloaded service account JSON from Firebase
echo   ✓ Uploaded it to EAS using: npx eas credentials
echo   ✓ Tested notifications on your phone
echo.
set /p ready="Are you ready to build? (Y/N): "

if /i "%ready%"=="Y" (
    echo.
    echo Starting APK build...
    echo ========================================
    echo.
    echo This will:
    echo   1. Install dependencies
    echo   2. Build APK with EAS (10-15 minutes)
    echo   3. Include FCM V1 credentials
    echo   4. Include google-services.json
    echo.
    
    echo Step 1: Installing dependencies...
    call npm install
    
    echo.
    echo Step 2: Building APK with EAS...
    echo.
    echo Build profile: preview
    echo Platform: Android
    echo.
    
    call npx eas build -p android --profile preview
    
    echo.
    echo ========================================
    echo Build Complete!
    echo ========================================
    echo.
    echo Next steps:
    echo   1. Download the APK from the link provided
    echo   2. Install it on your phone
    echo   3. Test push notifications
    echo.
    echo To check build status, run:
    echo   npx eas build:list
    echo.
    
) else (
    echo.
    echo ⚠️ Build cancelled.
    echo.
    echo Please complete FCM V1 setup first:
    echo   1. Run: setup-fcm-v1.bat
    echo   2. Follow the steps
    echo   3. Test notifications
    echo   4. Then run this script again
    echo.
)

echo.
echo Press any key to exit...
pause >nul
