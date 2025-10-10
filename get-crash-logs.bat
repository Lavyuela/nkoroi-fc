@echo off
echo ============================================
echo Nkoroi FC Crash Log Collector
echo ============================================
echo.

set ADB=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe

echo Checking for connected devices...
"%ADB%" devices
echo.

echo Instructions:
echo 1. Connect your phone via USB
echo 2. Enable USB Debugging on your phone
echo 3. Install the APK on your phone
echo 4. Press any key when ready to monitor...
pause

echo.
echo Clearing old logs...
"%ADB%" logcat -c

echo.
echo ============================================
echo NOW OPEN THE APP ON YOUR PHONE
echo ============================================
echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo CRASH LOGS:
echo ============================================
echo.

REM Get last 500 lines and filter for errors
"%ADB%" logcat -d -v time | findstr /i "error exception crash firebase nkoroifc"

echo.
echo ============================================
echo Full detailed logs saved to crash-log.txt
echo ============================================
"%ADB%" logcat -d > crash-log.txt

echo.
echo Done! Check crash-log.txt for full details.
pause
