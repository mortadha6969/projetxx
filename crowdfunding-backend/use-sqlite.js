/**
 * Script to configure the application to use SQLite instead of MySQL
 * Run with: node use-sqlite.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

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

// Path to .env file
const envPath = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  log('❌ .env file not found. Creating a new one...', colors.yellow);
  
  // Create a new .env file with SQLite configuration
  const envContent = `# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crowdfundingdb
DB_PORT=3306

# Database Fallback
USE_SQLITE=true

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000`;

  fs.writeFileSync(envPath, envContent);
  log('✅ Created new .env file with SQLite configuration', colors.green);
} else {
  // Read existing .env file
  log('📄 Reading existing .env file...', colors.cyan);
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Update USE_SQLITE to true
  envConfig.USE_SQLITE = 'true';
  
  // Convert config object back to string
  const newEnvContent = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // Write updated content back to .env file
  fs.writeFileSync(envPath, newEnvContent);
  log('✅ Updated .env file to use SQLite', colors.green);
}

// Check if database.sqlite exists and delete it if it does
const dbPath = path.join(__dirname, 'database.sqlite');
if (fs.existsSync(dbPath)) {
  log('🗑️ Removing existing SQLite database...', colors.yellow);
  fs.unlinkSync(dbPath);
  log('✅ Removed existing SQLite database', colors.green);
}

// Check if uploads directory exists and create it if it doesn't
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  log('📁 Creating uploads directory...', colors.cyan);
  fs.mkdirSync(uploadsPath);
  log('✅ Created uploads directory', colors.green);
}

log('\n=== Configuration Complete ===', colors.bright + colors.green);
log('The application is now configured to use SQLite.', colors.reset);
log('You can start the server with:', colors.yellow);
log('npm start', colors.reset);
log('\nA new SQLite database will be created automatically when you start the server.', colors.reset);
