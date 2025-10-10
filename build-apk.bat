@echo off
cd /d "c:\Users\Admin\Downloads\Nkoroi FC\android"
echo ========================================
echo Building Nkoroi FC APK (Local Build)
echo ========================================
echo.
echo This will take 5-10 minutes...
echo.
call gradlew.bat assembleRelease
echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo APK Location:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo You can now share this APK file!
echo ========================================
pause
