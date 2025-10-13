@echo off
echo ========================================
echo FCM V1 Setup - Simple Method
echo ========================================
echo.

set SERVICE_ACCOUNT=C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json

echo Checking if service account file exists...
if not exist "%SERVICE_ACCOUNT%" (
    echo.
    echo ❌ Error: Service account JSON not found!
    echo Expected location: %SERVICE_ACCOUNT%
    echo.
    echo Please make sure you downloaded the file from Firebase.
    echo.
    pause
    exit /b 1
)

echo ✓ Service account file found!
echo.
echo ========================================
echo INSTRUCTIONS FOR MANUAL UPLOAD
echo ========================================
echo.
echo I will now open the EAS credentials tool.
echo.
echo When you see the prompts, do this:
echo.
echo 1. Use ARROW KEYS to select "Android"
echo    Press ENTER
echo.
echo 2. Select "Set up push notification credentials"
echo    (or similar option about FCM/notifications)
echo    Press ENTER
echo.
echo 3. When asked for the file path, copy this:
echo.
echo    %SERVICE_ACCOUNT%
echo.
echo    Right-click in the terminal to paste
echo    Press ENTER
echo.
echo 4. Wait for "Successfully uploaded" message
echo.
echo ========================================
echo.
echo Press any key when you're ready to start...
pause >nul
echo.

echo Starting EAS credentials tool...
echo.
call npx eas credentials

echo.
echo ========================================
echo.
set /p success="Did you see 'Successfully uploaded'? (Y/N): "

if /i "%success%"=="Y" (
    echo.
    echo ✅ Great! FCM V1 is now set up!
    echo.
    echo Next: Test notifications
    echo ========================================
    echo.
    echo Run: npx expo start
    echo Then open the app on your phone with Expo Go
    echo.
    set /p test="Would you like to start the dev server now? (Y/N): "
    
    if /i "%test%"=="Y" (
        echo.
        echo Starting development server...
        call npx expo start
    )
) else (
    echo.
    echo ⚠️ Let's try again. Make sure to:
    echo   - Select Android
    echo   - Choose the FCM/push notification option
    echo   - Paste the full file path
    echo.
)

echo.
pause
