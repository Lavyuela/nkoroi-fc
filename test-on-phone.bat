@echo off
echo ============================================
echo Test Nkoroi FC on Your Phone with Expo Go
echo ============================================
echo.

echo Step 1: Install Expo Go on your phone
echo.
echo Android: https://play.google.com/store/apps/details?id=host.exp.exponent
echo iOS: https://apps.apple.com/app/expo-go/id982107779
echo.
echo Press any key after installing Expo Go...
pause

echo.
echo Step 2: Starting development server...
echo.
echo A QR code will appear - scan it with Expo Go app!
echo.
echo Note: Make sure your phone and PC are on the same WiFi network
echo.

npm start

pause
