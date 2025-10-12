@echo off
echo ========================================
echo Deploying Firebase Cloud Functions
echo ========================================
echo.

cd functions
echo Installing dependencies...
call npm install
cd ..

echo.
echo Deploying functions to Firebase...
echo This will take 3-5 minutes...
echo.

firebase deploy --only functions

if errorlevel 1 (
    echo.
    echo ========================================
    echo DEPLOYMENT FAILED
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Billing not enabled
    echo    Solution: Go to https://console.firebase.google.com/project/nkoroifc-9c964/overview
    echo              Click "Upgrade" and enable Blaze plan (still FREE for your usage!)
    echo.
    echo 2. Not logged in
    echo    Solution: Run: firebase login
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Functions Deployed!
echo ========================================
echo.
echo Your Cloud Functions are now live!
echo.
echo View them at:
echo https://console.firebase.google.com/project/nkoroifc-9c964/functions
echo.
echo What this means:
echo - Notifications now work when app is CLOSED
echo - Notifications work when phone is LOCKED  
echo - Automatic notifications for all events
echo.
echo Next: Install the new APK and test!
echo.
pause
