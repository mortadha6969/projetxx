const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../config/database');

// Path to the migration file
const migrationPath = path.join(__dirname, '..', 'migrations', 'add-document-url-to-campaigns.js');

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // Load the migration file
    const migration = require(migrationPath);
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
