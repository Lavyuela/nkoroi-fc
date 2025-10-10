@echo off
echo ============================================
echo Rebuilding Nkoroi FC APK
echo ============================================
echo.

cd /d "%~dp0android"

echo Cleaning previous build...
call gradlew.bat clean

echo.
echo Building new APK...
echo This will take 5-10 minutes...
echo.

call gradlew.bat assembleRelease

echo.
echo ============================================
echo BUILD COMPLETE!
echo.
echo APK Location:
echo %~dp0android\app\build\outputs\apk\release\app-release.apk
echo ============================================
echo.
pause
