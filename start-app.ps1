# PowerShell script to start both backend and frontend servers

Write-Host "Starting TrueFunding application..." -ForegroundColor Green

# Start backend server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\crowdfunding-backend'; npm start"

# Wait a bit before starting the frontend
Start-Sleep -Seconds 3

# Start frontend server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host "Both servers are starting in separate windows." -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host "Press Ctrl+C in each window to stop the servers." -ForegroundColor Yellow
