/**
 * Script to check database structure
 */

require('dotenv').config();
const { sequelize, initializeDatabase } = require('./config/database');

async function checkDatabase() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected');
    
    // Check tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
    
    // Check campaigns table structure
    if (tables.some(t => Object.values(t)[0] === 'campaigns')) {
      const [campaignsColumns] = await sequelize.query('SHOW COLUMNS FROM campaigns');
      console.log('\nCampaigns table columns:');
      campaignsColumns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
    }
    
    // Check users table structure
    if (tables.some(t => Object.values(t)[0] === 'users')) {
      const [usersColumns] = await sequelize.query('SHOW COLUMNS FROM users');
      console.log('\nUsers table columns:');
      usersColumns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
    }
    
    // Check transactions table structure
    if (tables.some(t => Object.values(t)[0] === 'transactions')) {
      const [transactionsColumns] = await sequelize.query('SHOW COLUMNS FROM transactions');
      console.log('\nTransactions table columns:');
      transactionsColumns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
    }
    
    // Check foreign keys
    const [foreignKeys] = await sequelize.query(`
      SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    console.log('\nForeign keys:');
    foreignKeys.forEach(fk => {
      console.log(`- ${fk.TABLE_NAME}.${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME} (${fk.CONSTRAINT_NAME})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
checkDatabase();
