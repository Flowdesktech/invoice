@echo off
echo ========================================
echo Starting Invoice Management Deployment
echo ========================================
echo.

REM Build client bundle
echo Step 1: Building client bundle...
echo ----------------------------------------
call npm run build:client
if %errorlevel% neq 0 (
    echo ERROR: Client build failed!
    exit /b %errorlevel%
)
echo Client build completed successfully!
echo.

REM Build SSR bundle
echo Step 2: Building SSR bundle...
echo ----------------------------------------
call npm run build:ssr
if %errorlevel% neq 0 (
    echo ERROR: SSR build failed!
    exit /b %errorlevel%
)
echo SSR build completed successfully!
echo.

REM Copy SSR template
echo Step 3: Copying SSR template...
echo ----------------------------------------
call npm run build:copy-template
if %errorlevel% neq 0 (
    echo ERROR: Template copy failed!
    exit /b %errorlevel%
)
echo SSR template copied successfully!
echo.

REM Install functions dependencies
echo Step 4: Installing functions dependencies...
echo ----------------------------------------
cd functions
call npm install
cd ..
if %errorlevel% neq 0 (
    echo ERROR: Functions dependency install failed!
    exit /b %errorlevel%
)
echo Functions dependencies installed!
echo.

REM Deploy to Firebase
echo Step 5: Deploying to Firebase...
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
echo   - Public pages are server-side rendered (SSR)
echo   - Dashboard pages are client-side rendered (SPA)
echo.
pause
