@echo off
echo ============================================
echo Make Yourself Super Admin
echo ============================================
echo.

echo This script will help you become a Super Admin
echo.

echo Option 1: Clear app data and re-register (EASIEST)
echo ------------------------------------------------
echo 1. Go to Settings on your phone
echo 2. Apps -^> Nkoroi FC -^> Storage
echo 3. Tap "Clear Data"
echo 4. Open app and register
echo 5. You'll be Super Admin automatically!
echo.

echo Option 2: Check current Super Admins via ADB
echo ------------------------------------------------
echo Make sure your phone is connected via USB with USB Debugging enabled
echo.
set /p continue="Press Enter to check Super Admins via ADB (or Ctrl+C to cancel)..."

echo.
echo Checking for connected devices...
adb devices

echo.
echo Checking Super Admin list...
adb shell "run-as com.nkoroifc cat shared_prefs/RCTAsyncLocalStorage_V1.xml | grep superAdmins"

echo.
echo If you see your email in the list above, you're already a Super Admin!
echo If not, use Option 1 (Clear Data) or ask another Super Admin to promote you.
echo.

pause
