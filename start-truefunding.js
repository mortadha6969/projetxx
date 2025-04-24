/**
 * Script to start both the backend and frontend servers
 * Run with: node start-truefunding.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Log with color
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Start a process
const startProcess = (command, args, cwd, name, color) => {
  const process = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe'
  });

  process.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${color}[${name}] ${line.trim()}${colors.reset}`);
      }
    });
  });

  process.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${colors.red}[${name} ERROR] ${line.trim()}${colors.reset}`);
      }
    });
  });

  process.on('close', (code) => {
    if (code !== 0) {
      log(`[${name}] Process exited with code ${code}`, colors.red);
    } else {
      log(`[${name}] Process exited successfully`, colors.green);
    }
  });

  return process;
};

// Start the backend server
const startBackend = () => {
  const backendPath = path.join(__dirname, 'crowdfunding-backend');
  log('\n=== Starting Backend Server ===', colors.bright + colors.blue);
  return startProcess('npm', ['start'], backendPath, 'Backend', colors.blue);
};

// Start the frontend server
const startFrontend = () => {
  const frontendPath = path.join(__dirname, 'frontend');
  log('\n=== Starting Frontend Server ===', colors.bright + colors.magenta);
  return startProcess('npm', ['start'], frontendPath, 'Frontend', colors.magenta);
};

// Handle process termination
const handleTermination = (backendProcess, frontendProcess) => {
  process.on('SIGINT', () => {
    log('\n=== Shutting Down Servers ===', colors.bright + colors.yellow);
    
    if (backendProcess) {
      log('Stopping backend server...', colors.yellow);
      backendProcess.kill();
    }
    
    if (frontendProcess) {
      log('Stopping frontend server...', colors.yellow);
      frontendProcess.kill();
    }
    
    log('All servers stopped. Goodbye!', colors.green);
    process.exit(0);
  });
};

// Main function
const main = () => {
  log('=== TrueFunding Application Starter ===', colors.bright + colors.green);
  log('Starting servers... Press Ctrl+C to stop all servers.', colors.yellow);
  
  // Start backend first
  const backendProcess = startBackend();
  
  // Wait a bit before starting frontend to allow backend to initialize
  setTimeout(() => {
    const frontendProcess = startFrontend();
    handleTermination(backendProcess, frontendProcess);
  }, 5000);
};

// Run the main function
main();
