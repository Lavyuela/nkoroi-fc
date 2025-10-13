@echo off
echo ========================================
echo Firebase Cloud Messaging V1 Setup
echo ========================================
echo.

echo STEP 1: Download Service Account JSON
echo ========================================
echo.
echo 1. Open: https://console.firebase.google.com/
echo 2. Select project: NkoroiFC
echo 3. Click Settings (gear icon) -^> Project settings
echo 4. Click "Service accounts" tab
echo 5. Click "Generate new private key"
echo 6. Save the JSON file to your Downloads folder
echo.
echo Press any key when you have downloaded the file...
pause >nul
echo.

echo STEP 2: Upload to EAS
echo ========================================
echo.
echo I will now run: npx eas credentials
echo.
echo When prompted:
echo   - Select platform: Android
echo   - Select action: Set up push notification credentials
echo   - Provide path to your JSON file
echo.
echo Press any key to continue...
pause >nul
echo.

call npx eas credentials

echo.
echo ========================================
echo Did the upload succeed? (Y/N)
set /p success="Enter Y if you see 'Successfully uploaded': "

if /i "%success%"=="Y" (
    echo.
    echo ✅ Great! FCM V1 credentials uploaded successfully!
    echo.
    echo STEP 3: Test Notifications
    echo ========================================
    echo.
    echo I will now start the development server.
    echo.
    echo What to do:
    echo   1. Open Expo Go app on your phone
    echo   2. Scan the QR code that appears
    echo   3. Look for "Expo Push Token" in the logs
    echo   4. Copy the token
    echo   5. Go to: https://expo.dev/notifications
    echo   6. Paste the token and send a test notification
    echo.
    echo Press any key to start the dev server...
    pause >nul
    echo.
    
    call npx expo start
    
) else (
    echo.
    echo ⚠️ Upload failed or was cancelled.
    echo.
    echo Troubleshooting:
    echo   - Make sure you downloaded the JSON file
    echo   - Use the full path to the file
    echo   - Example: C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-xxxxx.json
    echo.
    echo Try running this script again.
    echo.
)

echo.
echo Press any key to exit...
pause >nul
