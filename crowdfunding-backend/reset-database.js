/**
 * Script to reset the database and seed it with test data
 * Run with: node reset-database.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize, initializeDatabase } = require('./config/database');

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

// Reset the database
const resetDatabase = async () => {
  try {
    log('\n=== Initializing Database ===', colors.bright + colors.cyan);
    await initializeDatabase();

    // Delete the SQLite database file if it exists
    const dbPath = path.join(__dirname, 'database.sqlite');
    if (fs.existsSync(dbPath)) {
      log('🗑️ Removing existing SQLite database...', colors.yellow);
      fs.unlinkSync(dbPath);
      log('✅ Removed existing SQLite database', colors.green);
    }

    log('\n=== Database Reset Complete ===', colors.bright + colors.green);
    log('Now run the seed script to populate the database:', colors.yellow);
    log('node seed-database.js', colors.reset);
    
  } catch (error) {
    log(`❌ Error resetting database: ${error.message}`, colors.red);
    console.error(error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the reset function
resetDatabase();
