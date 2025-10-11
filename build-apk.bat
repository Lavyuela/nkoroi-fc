@echo off
echo ========================================
echo Building Nkoroi FC APK with Firebase
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building APK with EAS...
echo This will take 10-15 minutes...
call npx eas-cli build --platform android --profile preview

echo.
echo ========================================
echo Build complete!
echo Download link will appear above
echo ========================================
pause
