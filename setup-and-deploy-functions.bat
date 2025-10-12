@echo off
echo ========================================
echo Firebase Cloud Functions Setup
echo ========================================
echo.

echo This will:
echo 1. Login to Firebase
echo 2. Link your Firebase project
echo 3. Install dependencies
echo 4. Deploy Cloud Functions
echo.
echo Time required: ~10 minutes
echo.
pause

echo.
echo ========================================
echo Step 1: Login to Firebase
echo ========================================
echo.
echo A browser will open. Please:
echo - Login with ivy.waliaula@gmail.com
echo - Grant all permissions
echo - Return to this window when done
echo.
pause

call firebase login

if errorlevel 1 (
    echo.
    echo [ERROR] Login failed. Please try again.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Logged in!
echo.

echo ========================================
echo Step 2: Link Firebase Project
echo ========================================
echo.

REM Create .firebaserc file
echo { > .firebaserc
echo   "projects": { >> .firebaserc
echo     "default": "nkoroi-fc-f8f9e" >> .firebaserc
echo   } >> .firebaserc
echo } >> .firebaserc

echo [SUCCESS] Project linked!
echo.

echo ========================================
echo Step 3: Install Dependencies
echo ========================================
echo.

cd functions
echo Installing Firebase Functions dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [SUCCESS] Dependencies installed!
echo.

echo ========================================
echo Step 4: Deploy Cloud Functions
echo ========================================
echo.
echo Deploying 3 functions:
echo - sendNotification (sends FCM messages)
echo - onMatchCreated (auto-notify on match)
echo - onUpdateCreated (auto-notify on update)
echo.
echo This may take 3-5 minutes...
echo.

call firebase deploy --only functions

if errorlevel 1 (
    echo.
    echo [ERROR] Deployment failed
    echo.
    echo Common issues:
    echo 1. Billing not enabled - Go to Firebase Console and upgrade to Blaze plan (still free!)
    echo 2. APIs not enabled - Firebase will enable them automatically on retry
    echo.
    echo Try running this script again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Cloud Functions Deployed!
echo ========================================
echo.
echo Your functions are now live at:
echo https://console.firebase.google.com/project/nkoroi-fc-f8f9e/functions
echo.
echo What this means:
echo [+] Notifications now work when app is CLOSED
echo [+] Notifications work when phone is LOCKED
echo [+] Automatic notifications for matches and updates
echo [+] 100%% FREE (within free tier limits)
echo.
echo Next steps:
echo 1. Build new APK (GitHub Actions will do this automatically)
echo 2. Download and install new APK
echo 3. Test: Close app completely, create match, receive notification!
echo.
echo ========================================
pause
