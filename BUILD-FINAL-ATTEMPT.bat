@echo off
echo ============================================
echo FINAL BUILD ATTEMPT - Defender Disabled
echo ============================================
echo.
echo Step 1: Killing ALL processes...
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM adb.exe /T 2>nul
taskkill /F /IM Code.exe /T 2>nul
taskkill /F /IM explorer.exe /T 2>nul
timeout /t 2 /nobreak >nul
start explorer.exe
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Deleting build folders...
cd /d "%~dp0android"
rmdir /S /Q app\build 2>nul
rmdir /S /Q .gradle 2>nul
rmdir /S /Q build 2>nul

echo.
echo Step 3: Building APK...
call gradlew.bat assembleRelease

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ============================================
    echo SUCCESS! APK CREATED!
    echo ============================================
    echo.
    echo Copying APK to Downloads...
    copy "app\build\outputs\apk\release\app-release.apk" "C:\Users\Admin\Downloads\nkoroifc-v1.0.3-NEW.apk"
    echo.
    echo APK saved to: C:\Users\Admin\Downloads\nkoroifc-v1.0.3-NEW.apk
    echo.
    dir "C:\Users\Admin\Downloads\nkoroifc-v1.0.3-NEW.apk"
    echo.
    echo ============================================
    echo TURN WINDOWS DEFENDER BACK ON NOW!
    echo ============================================
) else (
    echo.
    echo ============================================
    echo BUILD FAILED
    echo ============================================
    echo.
    echo TURN WINDOWS DEFENDER BACK ON NOW!
)
echo.
pause
