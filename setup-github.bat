@echo off
echo ============================================
echo GitHub Setup for Nkoroi FC
echo ============================================
echo.

echo Step 1: Configuring Git...
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

echo.
echo Step 2: Initializing Git repository...
git init

echo.
echo Step 3: Adding all files...
git add .

echo.
echo Step 4: Creating initial commit...
git commit -m "Initial commit - Nkoroi FC v1.0.3 with improvements"

echo.
echo ============================================
echo Git Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Go to: https://github.com/new
echo 2. Create repository named: nkoroi-fc
echo 3. Make it PUBLIC (for free builds)
echo 4. Click "Create repository"
echo 5. Copy the commands GitHub shows you
echo 6. Run them in this window
echo.
echo Example:
echo   git remote add origin https://github.com/USERNAME/nkoroi-fc.git
echo   git branch -M main
echo   git push -u origin main
echo.
pause
