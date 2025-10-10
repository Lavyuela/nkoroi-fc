@echo off
echo ============================================
echo Pushing to GitHub
echo ============================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/Lavyuela/nkoroi-fc.git
git branch -M main
git push -u origin main

echo.
echo ============================================
echo Done! Check GitHub Actions for build
echo ============================================
echo.
echo Go to: https://github.com/Lavyuela/nkoroi-fc/actions
echo.
pause
