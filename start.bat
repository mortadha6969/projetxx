@echo off
echo Starting TrueFunding application...

:: Start backend server in a new command window
start cmd /k "cd crowdfunding-backend && npm start"

:: Wait a bit before starting the frontend
timeout /t 3 /nobreak > nul

:: Start frontend server in a new command window
start cmd /k "cd frontend && npm start"

echo Both servers are starting in separate windows.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo Close the command windows to stop the servers.
