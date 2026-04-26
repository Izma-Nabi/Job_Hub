@echo off
REM Quick Authentication Fix Script for Windows
REM This script will set up the database and test the connection

cls
echo.
echo ========================================
echo  Job Portal - Quick Authentication Fix
echo ========================================
echo.

REM Change to job directory
cd /d "d:\SEMESTER-Projects\job\job"

echo [STEP 1] Verifying npm packages installed...
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

echo [STEP 2] Setting up database...
echo.
echo Running database verification script...
echo This will:
echo  - Connect to SQL Server
echo  - Create database if needed
echo  - Create tables if needed
echo  - Test password hashing
echo  - Test registration and login flow
echo.

call node verify-db.js

if errorlevel 1 (
    echo.
    echo ERROR: Database setup failed
    echo Please check:
    echo  1. SQL Server is running
    echo  2. Database credentials in .env are correct
    echo  3. Database "JobPortalDB_F" can be accessed with user "job_portal"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Open Terminal 1: npm run dev:backend
echo    (This starts backend on port 5000)
echo.
echo 2. Open Terminal 2: npm run dev:frontend  
echo    (This starts frontend on port 3000)
echo.
echo 3. Open browser: http://localhost:3000
echo.
echo 4. Click "Sign Up" and create an account
echo.
echo 5. Click "Sign In" and login with your new account
echo.
echo If you see "[REGISTER]" or "[LOGIN]" logs in Terminal 1,
echo the authentication is now working!
echo.
echo ========================================
echo.

pause
