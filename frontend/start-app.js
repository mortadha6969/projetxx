/**
 * Script to start both the backend and frontend servers
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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

// Check if a directory exists
const directoryExists = (dirPath) => {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
};

// Start a server process
const startServer = (name, command, cwd, color) => {
  log(`Starting ${name} server...`, color + colors.bright);
  
  if (!directoryExists(cwd)) {
    log(`Error: Directory ${cwd} does not exist.`, colors.red);
    return null;
  }
  
  const isWindows = process.platform === 'win32';
  const shell = isWindows ? true : '/bin/bash';
  
  const serverProcess = spawn(command, [], { 
    cwd, 
    shell,
    stdio: 'pipe'
  });
  
  serverProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        log(`[${name}] ${line}`, color);
      }
    });
  });
  
  serverProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        log(`[${name}] ${line}`, colors.red);
      }
    });
  });
  
  serverProcess.on('close', (code) => {
    log(`${name} server process exited with code ${code}`, code === 0 ? colors.green : colors.red);
  });
  
  return serverProcess;
};

// Main function
const main = () => {
  log('Starting TrueFunding application...', colors.bright + colors.green);
  
  // Define paths
  const frontendDir = __dirname;
  const rootDir = path.join(frontendDir, '..');
  const backendDir = path.join(rootDir, 'crowdfunding-backend');
  
  // Start backend server
  const backendProcess = startServer('Backend', 'npm start', backendDir, colors.cyan);
  
  // Wait a bit before starting the frontend to let the backend initialize
  setTimeout(() => {
    // Start frontend server
    const frontendProcess = startServer('Frontend', 'npm start', frontendDir, colors.magenta);
    
    if (!frontendProcess) {
      if (backendProcess) {
        log('Killing backend process due to frontend startup failure', colors.red);
        backendProcess.kill();
      }
      process.exit(1);
    }
  }, 3000);
  
  // Handle process termination
  const cleanup = () => {
    log('\nShutting down servers...', colors.yellow);
    if (backendProcess) backendProcess.kill();
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

// Run the main function
main();
