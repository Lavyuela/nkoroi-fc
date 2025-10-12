@echo off
echo ========================================
echo Firebase Cloud Functions Deployment
echo ========================================
echo.

echo Step 1: Login to Firebase
echo.
echo A browser window will open. Please:
echo 1. Login with ivy.waliaula@gmail.com
echo 2. Grant permissions
echo 3. Return to this window
echo.
pause

firebase login

echo.
echo ========================================
echo Step 2: Install Dependencies
echo ========================================
echo.

cd functions
call npm install
cd ..

echo.
echo ========================================
echo Step 3: Deploy Functions
echo ========================================
echo.

firebase deploy --only functions

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your Cloud Functions are now live!
echo Notifications will work even when app is closed.
echo.
pause
