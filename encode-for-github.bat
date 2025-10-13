@echo off
echo ========================================
echo Encode Files for GitHub Secrets
echo ========================================
echo.

echo Step 1: Encoding google-services.json...
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('android/app/google-services.json'))" > google-services-base64.txt
echo ✅ Created: google-services-base64.txt
echo.

echo Step 2: Encoding Firebase Service Account...
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json'))" > firebase-service-account-base64.txt
echo ✅ Created: firebase-service-account-base64.txt
echo.

echo ========================================
echo ✅ Encoding Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Open google-services-base64.txt
echo    Copy ALL the text
echo    Go to: https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
echo    Create secret: GOOGLE_SERVICES_JSON
echo    Paste the text
echo.
echo 2. Open firebase-service-account-base64.txt
echo    Copy ALL the text
echo    Go to: https://github.com/Lavyuela/nkoroi-fc/settings/secrets/actions
echo    Create secret: FIREBASE_SERVICE_ACCOUNT
echo    Paste the text
echo.
echo 3. Push changes to GitHub:
echo    git add .
echo    git commit -m "Update workflow for FCM V1"
echo    git push origin main
echo.
echo 4. Go to GitHub Actions and run the workflow!
echo.
pause
