@echo off
color 0A
title Firebase Login and Deploy
cls

echo ========================================
echo Step 1: Firebase Login
echo ========================================
echo.
echo A browser will open.
echo Please login with ivy.waliaula@gmail.com
echo and grant all permissions.
echo.
pause

firebase login

if errorlevel 1 (
    echo.
    echo Login failed! Please try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Deploying Functions
echo ========================================
echo.
echo Project: nkoroifc-9c964
echo.
echo Deploying 3 functions:
echo - sendNotification
echo - onMatchCreated  
echo - onUpdateCreated
echo.
echo This will take 3-5 minutes...
echo.

firebase deploy --only functions

echo.
echo ========================================
if errorlevel 1 (
    echo DEPLOYMENT FAILED!
    echo.
    echo Common issue: Billing not enabled
    echo.
    echo Solution:
    echo 1. Go to: https://console.firebase.google.com/project/nkoroifc-9c964/overview
    echo 2. Click "Upgrade" button
    echo 3. Select "Blaze Plan" (FREE for your usage!)
    echo 4. Add payment method
    echo 5. Run this script again
    echo.
) else (
    echo DEPLOYMENT SUCCESSFUL!
    echo.
    echo Your Cloud Functions are now live!
    echo.
    echo What this means:
    echo - Notifications work when app is CLOSED
    echo - Notifications work when phone is LOCKED
    echo - Automatic notifications for all events
    echo.
    echo View functions at:
    echo https://console.firebase.google.com/project/nkoroifc-9c964/functions
    echo.
)
echo ========================================
echo.
pause
