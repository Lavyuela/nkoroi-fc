@echo off
echo ============================================
echo Fixing WSL Ubuntu Installation
echo ============================================
echo.

echo Step 1: Terminating any running WSL instances...
wsl --shutdown
timeout /t 3 /nobreak >nul

echo.
echo Step 2: Unregistering Ubuntu (if exists)...
wsl --unregister Ubuntu
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Installing fresh Ubuntu...
wsl --install -d Ubuntu --web-download

echo.
echo ============================================
echo Ubuntu will open in a new window
echo ============================================
echo.
echo When it opens:
echo 1. Wait for setup to complete
echo 2. Enter username (e.g., admin)
echo 3. Enter password (twice)
echo 4. Then run the setup script
echo.
pause
