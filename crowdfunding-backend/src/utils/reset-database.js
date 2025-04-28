// utils/reset-database.js
require('dotenv').config();
const { sequelize, initializeDatabase } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Reset database (drop all tables and recreate them)
const resetDatabase = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection initialized');

    // Drop all tables
    await sequelize.drop();
    console.log('✅ All tables dropped');

    // Sync all models with the database (recreate tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized (tables recreated)');

    // Clear uploads directory
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (fs.existsSync(uploadsDir)) {
      // Keep the directory but remove all files
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        // Skip .gitkeep file
        if (file === '.gitkeep') continue;
        
        fs.unlinkSync(path.join(uploadsDir, file));
      }
      console.log('✅ Uploads directory cleared');
    }

    console.log('✅ Database reset completed successfully');
    console.log('ℹ️ Run "npm run setup" to create sample data');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

// Ask for confirmation before proceeding
console.log('⚠️ WARNING: This will delete all data in the database and uploads directory!');
console.log('⚠️ Type "RESET" to confirm:');

process.stdin.once('data', (data) => {
  const input = data.toString().trim();
  if (input === 'RESET') {
    console.log('🔄 Resetting database...');
    resetDatabase();
  } else {
    console.log('❌ Reset cancelled');
    process.exit(0);
  }
});
