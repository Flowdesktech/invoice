@echo off
echo ========================================
echo Starting Invoice Management Deployment
echo ========================================
echo.

REM Build the frontend
echo Step 1: Building frontend...
echo ----------------------------------------
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    exit /b %errorlevel%
)
echo Frontend build completed successfully!
echo.

REM Deploy to Firebase
echo Step 2: Deploying to Firebase...
echo ----------------------------------------
call firebase deploy
if %errorlevel% neq 0 (
    echo ERROR: Firebase deployment failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Deployment completed successfully!
echo ========================================
echo.
echo Your app is now live at your Firebase hosting URL.
echo.
pause
