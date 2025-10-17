@echo off
echo ========================================
echo Checking App Crash Logs
echo ========================================
echo.
echo Make sure your Android device is connected via USB
echo.
pause
echo.
echo Getting crash logs...
echo.
adb logcat -d | findstr -i "error exception crash nkoroi"
echo.
echo ========================================
echo Logs shown above
echo ========================================
pause
