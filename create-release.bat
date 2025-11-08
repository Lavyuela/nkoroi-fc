@echo off
echo ========================================
echo Nkoroi FC - Create GitHub Release
echo ========================================
echo.

REM Check if APK exists in Downloads
set APK_PATH="%USERPROFILE%\Downloads\app-release.apk"

if not exist %APK_PATH% (
    echo ERROR: APK not found at %APK_PATH%
    echo.
    echo Please download the APK from GitHub Actions first:
    echo https://github.com/Lavyuela/nkoroi-fc/actions
    echo.
    echo Then save it as: %APK_PATH%
    pause
    exit /b 1
)

echo Found APK: %APK_PATH%
echo.

REM Get version from package.json
for /f "tokens=2 delims=:, " %%a in ('type package.json ^| findstr /C:"version"') do set VERSION=%%a
set VERSION=%VERSION:"=%

echo Creating release v%VERSION%...
echo.

REM Create release using GitHub CLI (if available) or manual instructions
where gh >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using GitHub CLI...
    gh release create v%VERSION% %APK_PATH% --title "Nkoroi FC v%VERSION%" --notes "Stable release with all features and bug fixes"
    echo.
    echo ========================================
    echo Release created successfully!
    echo.
    echo Permanent download link:
    echo https://github.com/Lavyuela/nkoroi-fc/releases/download/v%VERSION%/app-release.apk
    echo ========================================
) else (
    echo GitHub CLI not found. Please create release manually:
    echo.
    echo 1. Go to: https://github.com/Lavyuela/nkoroi-fc/releases/new
    echo 2. Tag: v%VERSION%
    echo 3. Title: Nkoroi FC v%VERSION%
    echo 4. Upload APK from: %APK_PATH%
    echo 5. Click "Publish release"
    echo.
    echo Opening browser...
    start https://github.com/Lavyuela/nkoroi-fc/releases/new
)

pause
