@echo off
echo ============================================
echo Nkoroi FC APK Build - Workaround Method
echo ============================================
echo.

REM Close File Explorer windows
taskkill /F /IM explorer.exe 2>nul
timeout /t 2 /nobreak >nul
start explorer.exe

echo Step 1: Stopping all Java processes...
taskkill /F /IM java.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Stopping Gradle daemon...
cd /d "%~dp0android"
call gradlew.bat --stop 2>nul
cd ..

echo Step 3: Attempting to delete build folders only...
rmdir /S /Q "android\app\build" 2>nul
rmdir /S /Q "android\.gradle" 2>nul
rmdir /S /Q "android\build" 2>nul

echo Step 4: Building APK...
cd android
call gradlew.bat clean
call gradlew.bat assembleRelease

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ============================================
    echo SUCCESS! APK CREATED!
    echo ============================================
    echo.
    echo Location: %~dp0android\app\build\outputs\apk\release\app-release.apk
    echo.
    dir "app\build\outputs\apk\release\app-release.apk"
) else (
    echo ============================================
    echo BUILD FAILED
    echo ============================================
)

echo.
pause
