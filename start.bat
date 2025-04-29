@echo off
echo Starting CrowdFunding application...

:: Use the consolidated Node.js script to start both servers
node start.js

:: If you prefer separate windows, uncomment these lines:
:: start cmd /k "cd crowdfunding-backend && npm start"
:: timeout /t 3 /nobreak > nul
:: start cmd /k "cd frontend && npm start"
