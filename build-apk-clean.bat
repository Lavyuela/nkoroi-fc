@echo off
echo ========================================
echo Building Nkoroi FC APK (Clean Build)
echo ========================================
echo.

echo Step 1: Closing VS Code to release file locks...
taskkill /F /IM Code.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Cleaning build folders...
cd android
call gradlew clean --no-daemon
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Building APK...
call gradlew assembleRelease --no-daemon

echo.
echo ========================================
echo Build complete!
echo APK location: android\app\build\outputs\apk\release\app-release.apk
echo ========================================
pause
