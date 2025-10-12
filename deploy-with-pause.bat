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

REM Check if logged in
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo You are not logged in to Firebase.
    echo.
    echo Opening browser for login...
    echo Please login with ivy.waliaula@gmail.com
    echo.
    firebase login
    echo.
    if errorlevel 1 (
        echo Login failed!
        echo.
        pause
        exit /b 1
    )
)

echo Logged in successfully!
echo.
echo ========================================
echo Deploying Functions...
echo ========================================
echo.
echo This will take 3-5 minutes...
echo.

firebase deploy --only functions 2>&1

echo.
echo ========================================
echo Deployment finished!
echo ========================================
echo.
echo Check the output above for any errors.
echo.
echo Common errors:
echo - "Billing account not configured" = Need to upgrade to Blaze plan
echo - "APIs not enabled" = Run deployment again
echo.
echo.
pause
