@echo off
cd /d "c:\Users\Admin\Downloads\Nkoroi FC"
echo ========================================
echo Building Nkoroi FC APK
echo ========================================
echo.
echo Step 1: Login to EAS
npx eas login
echo.
echo Step 2: Configure EAS Build
npx eas build:configure
echo.
echo Step 3: Build APK
npx eas build --platform android --profile preview
echo.
echo ========================================
echo Build complete! Download link will appear above.
echo ========================================
pause
