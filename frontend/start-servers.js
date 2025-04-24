/**
 * Simple script to start both backend and frontend servers
 */
const { exec } = require('child_process');
const path = require('path');

console.log('Starting TrueFunding application...');

// Define paths
const frontendDir = __dirname;
const rootDir = path.join(frontendDir, '..');
const backendDir = path.join(rootDir, 'crowdfunding-backend');

// Start backend server
console.log('Starting backend server...');
const backendProcess = exec('npm start', { cwd: backendDir });

backendProcess.stdout.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data}`);
});

// Wait a bit before starting the frontend
setTimeout(() => {
  // Start frontend server
  console.log('Starting frontend server...');
  const frontendProcess = exec('npm start', { cwd: frontendDir });

  frontendProcess.stdout.on('data', (data) => {
    console.log(`[Frontend] ${data}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data}`);
  });
}, 3000);

console.log('Servers are starting...');
console.log('Backend will be available at: http://localhost:3001');
console.log('Frontend will be available at: http://localhost:3000');
console.log('Press Ctrl+C to stop both servers.');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  process.exit(0);
});
