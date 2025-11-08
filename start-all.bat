@echo off
echo ========================================
echo Starting CodeMentor AI
echo ========================================
echo.
echo Starting Backend on http://localhost:8000
echo Starting Frontend on http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Start backend in a new window
start "CodeMentor AI - Backend" cmd /k "cd backend && python -m app"

:: Wait a few seconds for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
start "CodeMentor AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Check the new terminal windows for logs
echo Close this window when done (servers will keep running)
echo.
pause
