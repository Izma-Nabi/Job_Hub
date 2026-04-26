@echo off
REM JobHub Quick Start Script for Windows
REM This script will start both backend and frontend servers

echo.
echo ================================================
echo         JobHub - Job Portal Quick Start
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js found
echo.

REM Check if backend dependencies are installed
if not exist "node_modules" (
    echo [!] Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo [✓] Backend dependencies installed
) else (
    echo [✓] Backend dependencies already installed
)

echo.

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo [!] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo [✓] Frontend dependencies installed
) else (
    echo [✓] Frontend dependencies already installed
)

echo.
echo ================================================
echo.
echo Configuration:
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo Instructions:
echo   1. This script will open TWO terminal windows
echo   2. Keep both terminals open while developing
echo   3. Press CTRL+C to stop the servers
echo.
echo Starting servers in 3 seconds...
echo.
timeout /t 3

REM Start backend server
echo [►] Starting backend server...
start cmd /k "title Backend Server (Port 5000) && npm run dev:backend"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend server
echo [►] Starting frontend server...
start cmd /k "title Frontend Dev Server (Port 3000) && cd frontend && npm run dev"

echo.
echo ================================================
echo Servers are starting...
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:3000
echo ================================================
echo.
echo Opening frontend in browser...
timeout /t 3

REM Try to open browser
start http://localhost:3000

echo.
echo [✓] Setup complete!
echo.
echo If browsers didn't open automatically, visit:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo To stop the servers: Close the terminal windows or press CTRL+C
echo.
pause
