@echo off
echo ========================================
echo CodeMentor AI - Quick Start Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
) else (
    echo [OK] Python is installed
)

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

echo.
echo ========================================
echo Installing Backend Dependencies...
echo ========================================
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..

echo.
echo ========================================
echo Installing Frontend Dependencies...
echo ========================================
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Before starting the application:
echo 1. Make sure MongoDB is running (mongod)
echo 2. Update backend/.env with your OPENAI_API_KEY
echo.
echo To start the application:
echo 1. Run: start-backend.bat (in one terminal)
echo 2. Run: start-frontend.bat (in another terminal)
echo.
echo Or use: start-all.bat (to start both)
echo.
pause
