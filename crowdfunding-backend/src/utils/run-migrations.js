// utils/run-migrations.js
require('dotenv').config();
const { initializeDatabase } = require('../config/database');
const addCategoryToCampaigns = require('../migrations/add-category-to-campaigns');

const runMigrations = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection initialized');

    // Run migrations
    console.log('Running migrations...');
    await addCategoryToCampaigns();
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations
runMigrations();
