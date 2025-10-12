@echo off
color 0A
title Firebase Cloud Functions Deployment
cls

echo ========================================
echo Firebase Cloud Functions Deployment
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
echo ========================================
echo.

firebase deploy --only functions

echo.
echo ========================================
if errorlevel 1 (
    echo DEPLOYMENT FAILED!
    echo.
    echo Common issue: Billing not enabled
    echo Solution: Go to Firebase Console and upgrade to Blaze plan
    echo https://console.firebase.google.com/project/nkoroifc-9c964/overview
) else (
    echo DEPLOYMENT SUCCESSFUL!
    echo.
    echo Your Cloud Functions are now live!
    echo Notifications will work when app is closed!
)
echo ========================================
echo.
pause
