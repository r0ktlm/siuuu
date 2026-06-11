@echo off
echo ====================================
echo    STARTING LOCAL RETRO STREAMER    
echo ====================================
echo.
echo Installing dependencies (express)...
call npm install
echo.
echo Starting local server on http://localhost:3000...
start "" "http://localhost:3000"
node server.js
pause
