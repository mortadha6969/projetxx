/**
 * Script to check database tables
 */

require('dotenv').config();
const { sequelize, initializeDatabase } = require('./config/database');

async function checkTables() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected');
    
    // Check tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
    
    // Check each table structure
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📋 Table: ${tableName}`);
      
      // Get columns
      const [columns] = await sequelize.query(`SHOW COLUMNS FROM ${tableName}`);
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
      
      // Get sample data
      const [rows] = await sequelize.query(`SELECT * FROM ${tableName} LIMIT 3`);
      console.log(`\nSample data (${rows.length} rows):`);
      if (rows.length > 0) {
        console.log(JSON.stringify(rows, null, 2));
      } else {
        console.log('No data found');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
checkTables();
