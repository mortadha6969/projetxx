/**
 * Script to install all required dependencies for the project
 * Run with: node install-dependencies.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Log with color
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Execute a command and log output
const execute = (command, cwd = process.cwd()) => {
  try {
    log(`Executing: ${command}`, colors.cyan);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    log(error.message, colors.red);
    return false;
  }
};

// Backend dependencies
const backendDependencies = [
  'express',
  'cors',
  'dotenv',
  'sequelize',
  'mysql2',
  'sqlite3',
  'bcryptjs',
  'jsonwebtoken',
  'multer',
  'uuid'
];

// Frontend dependencies
const frontendDependencies = [
  'axios',
  'react-router-dom',
  'react-hook-form',
  'react-icons',
  'react-toastify'
];

// Install dependencies
const installDependencies = () => {
  log('\n=== Installing Backend Dependencies ===', colors.bright + colors.green);
  const backendPath = path.join(__dirname, 'crowdfunding-backend');
  
  if (execute(`npm install ${backendDependencies.join(' ')}`, backendPath)) {
    log('✅ Backend dependencies installed successfully!', colors.green);
  } else {
    log('❌ Failed to install backend dependencies.', colors.red);
  }
  
  log('\n=== Installing Frontend Dependencies ===', colors.bright + colors.green);
  const frontendPath = path.join(__dirname, 'frontend');
  
  if (execute(`npm install ${frontendDependencies.join(' ')}`, frontendPath)) {
    log('✅ Frontend dependencies installed successfully!', colors.green);
  } else {
    log('❌ Failed to install frontend dependencies.', colors.red);
  }
  
  log('\n=== Installation Complete ===', colors.bright + colors.green);
  log('You can now start the application with:', colors.yellow);
  log('1. Start the backend: cd crowdfunding-backend && npm start', colors.reset);
  log('2. Start the frontend: cd frontend && npm start', colors.reset);
};

// Run the installation
installDependencies();
