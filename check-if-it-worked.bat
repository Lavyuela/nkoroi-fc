@echo off
echo Checking if notification was sent...
echo.
timeout /t 3 /nobreak >nul
firebase functions:log
echo.
echo.
echo Look for:
echo - "New notification created"
echo - "Sending notification to X devices"
echo - "Successfully sent: X"
echo.
pause
