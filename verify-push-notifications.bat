@echo off
echo ========================================
echo Push Notification Verification
echo ========================================
echo.
echo This will show you if push notifications are working.
echo.
echo Make sure you:
echo 1. Installed the NEW APK
echo 2. Opened the app
echo 3. Created a notification (match/update)
echo.
pause
echo.
echo Checking Cloud Function logs...
echo.
firebase functions:log
echo.
echo ========================================
echo What to look for:
echo ========================================
echo.
echo GOOD SIGNS:
echo - "Found FCM token for user [id]"
echo - "Sending FCM notification to X devices"
echo - "Successfully sent: X"
echo - "Message sent successfully to token"
echo.
echo BAD SIGNS:
echo - "No FCM tokens found"
echo - "Error sending to token"
echo - "404" or "invalid token"
echo.
pause
