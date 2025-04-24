/**
 * Script to install required dependencies for the frontend
 */

const { execSync } = require('child_process');

// List of dependencies to install
const dependencies = [
  'axios',
  'react-router-dom',
  'react-hook-form',
  'react-icons',
  'react-toastify'
];

console.log('Installing frontend dependencies...');

try {
  // Install dependencies
  execSync(`npm install ${dependencies.join(' ')}`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ All dependencies installed successfully!');
  console.log('\nYou can now start the frontend with:');
  console.log('npm start');
} catch (error) {
  console.error('\n❌ Error installing dependencies:', error.message);
  console.log('\nPlease try installing them manually with:');
  console.log(`npm install ${dependencies.join(' ')}`);
}
