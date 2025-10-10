@echo off
echo ============================================
echo Building APK - After Exclusion Added
echo ============================================
echo.
echo Killing processes...
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
timeout /t 3 /nobreak >nul

echo Building APK...
cd /d "%~dp0android"
call gradlew.bat assembleRelease

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ============================================
    echo SUCCESS! APK CREATED!
    echo ============================================
    echo.
    dir "app\build\outputs\apk\release\app-release.apk"
    echo.
    echo Location: %~dp0android\app\build\outputs\apk\release\app-release.apk
    echo.
) else (
    echo.
    echo BUILD FAILED
    echo.
)
pause
