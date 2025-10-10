@echo off
echo ============================================
echo Nkoroi FC APK Emulator Testing
echo ============================================
echo.

set ANDROID_SDK=%LOCALAPPDATA%\Android\Sdk
set EMULATOR=%ANDROID_SDK%\emulator\emulator.exe
set ADB=%ANDROID_SDK%\platform-tools\adb.exe
set AVD_NAME=Medium_Phone_API_36.1

echo Step 1: Checking for APK file...
set APK_PATH=android\app\build\outputs\apk\release\app-release.apk

if not exist "%APK_PATH%" (
    echo ERROR: APK not found at %APK_PATH%
    echo Please download the APK from GitHub Actions first.
    echo.
    echo Go to: https://github.com/Lavyuela/nkoroi-fc/actions
    echo Download the latest artifact and extract it to: %APK_PATH%
    echo.
    pause
    exit /b 1
)

echo ✓ APK found: %APK_PATH%
echo.

echo Step 2: Starting Android Emulator...
echo This will take 1-2 minutes...
echo.
start "" "%EMULATOR%" -avd %AVD_NAME% -no-snapshot-load

echo Waiting for emulator to boot...
timeout /t 30 /nobreak >nul

echo.
echo Step 3: Waiting for device to be ready...
"%ADB%" wait-for-device
echo ✓ Emulator is ready!
echo.

echo Step 4: Installing APK...
"%ADB%" install -r "%APK_PATH%"
echo.

echo Step 5: Starting Logcat (crash monitoring)...
echo ============================================
echo CRASH LOGS WILL APPEAR BELOW:
echo ============================================
echo.

REM Clear logcat buffer
"%ADB%" logcat -c

REM Launch the app
echo Launching Nkoroi FC app...
"%ADB%" shell am start -n com.nkoroifc.livescore/.MainActivity

echo.
echo Monitoring for crashes (Press Ctrl+C to stop)...
echo ============================================
"%ADB%" logcat -s AndroidRuntime:E ReactNativeJS:E *:F

pause
