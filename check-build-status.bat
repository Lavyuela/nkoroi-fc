@echo off
:loop
cls
echo ========================================
echo    NKOROI FC APK BUILD STATUS
echo ========================================
echo.
echo Checking build progress...
echo.

if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo [92m========================================[0m
    echo [92m   BUILD COMPLETE![0m
    echo [92m========================================[0m
    echo.
    echo [92mAPK Location:[0m
    echo android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo [92mNext Steps:[0m
    echo 1. Transfer APK to your phone
    echo 2. Install on both devices
    echo 3. Delete Firebase user ^(ivy.waliaula@gmail.com^)
    echo 4. Register fresh in app
    echo 5. Become Super Admin!
    echo.
    pause
    exit
) else (
    echo [93mStatus: Building...[0m
    echo.
    echo Gradle is compiling your app with Firebase.
    echo This usually takes 8-12 minutes.
    echo.
    echo [96mStarted: 18:42[0m
    echo [96mCurrent: %time:~0,5%[0m
    echo.
    echo Checking again in 10 seconds...
    timeout /t 10 /nobreak >nul
    goto loop
)
