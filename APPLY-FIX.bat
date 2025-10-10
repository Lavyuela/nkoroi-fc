@echo off
echo ============================================
echo Applying Crash Fix for Nkoroi FC
echo ============================================
echo.

echo This will:
echo 1. Downgrade React Native Firebase to compatible version
echo 2. Rebuild the app
echo 3. Push to GitHub for cloud build
echo.

echo Press Ctrl+C to cancel, or
pause

echo.
echo Step 1: Updating package.json...

REM Backup current package.json
copy package.json package.json.backup

REM This will be done manually - showing instructions
echo.
echo MANUAL STEP REQUIRED:
echo.
echo Open package.json and change these lines:
echo.
echo FROM:
echo     "@react-native-firebase/app": "^21.3.0",
echo     "@react-native-firebase/database": "^21.3.0",
echo     "@react-native-firebase/messaging": "^21.3.0",
echo.
echo TO:
echo     "@react-native-firebase/app": "^18.9.0",
echo     "@react-native-firebase/database": "^18.9.0",
echo     "@react-native-firebase/messaging": "^18.9.0",
echo.
echo Press any key after you've made the changes...
pause

echo.
echo Step 2: Installing dependencies...
call npm install

echo.
echo Step 3: Committing changes...
git add package.json package-lock.json
git commit -m "Fix: Downgrade React Native Firebase to v18 for compatibility"

echo.
echo Step 4: Pushing to GitHub...
git push

echo.
echo ============================================
echo Done! New build will start on GitHub Actions
echo Go to: https://github.com/Lavyuela/nkoroi-fc/actions
echo ============================================
echo.
pause
