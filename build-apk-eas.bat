@echo off
cd /d "c:\Users\Admin\Downloads\Nkoroi FC"
echo ========================================
echo Building Nkoroi FC APK with EAS
echo ========================================
echo.
echo This will:
echo 1. Login to Expo (or create account)
echo 2. Start cloud build (10-15 minutes)
echo 3. Give you download link when done
echo.
echo ========================================
echo.
eas build --platform android --profile preview
echo.
echo ========================================
echo Build complete or in progress!
echo Check https://expo.dev for status
echo ========================================
pause
