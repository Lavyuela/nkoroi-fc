@echo off
echo ========================================
echo Building Nkoroi FC APK (Optimized)
echo ========================================
echo.
echo This build has been optimized to prevent hanging:
echo - Disabled new architecture
echo - Enabled Gradle daemon
echo - Enabled caching
echo - Reduced architectures to ARM only
echo.
echo This will take 15-25 minutes on first build.
echo.
echo ========================================
echo.

cd /d "%~dp0android"

echo Setting Java Home...
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.9.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo.
echo Cleaning previous builds...
call gradlew.bat clean

echo.
echo Starting APK build...
echo.
call gradlew.bat assembleRelease --no-daemon --info

echo.
echo ========================================
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo SUCCESS! APK is ready!
    echo.
    echo Location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo You can now install this on your Android device!
    echo.
) else (
    echo.
    echo Build may have failed. Check the output above for errors.
    echo.
)
echo ========================================
pause
