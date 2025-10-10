@echo off
echo Checking if APK build is complete...
echo.
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo SUCCESS! APK is ready!
    echo ========================================
    echo.
    echo Location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo You can now install this APK on your Android device!
    echo.
) else (
    echo Build is still in progress...
    echo Please wait and run this script again in a few minutes.
    echo.
)
pause
