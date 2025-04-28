require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateTransactionSchema() {
  try {
    console.log('Starting transaction schema update...');

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Check if payment_reference column exists
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM transactions LIKE 'payment_reference'
    `);

    if (columns.length === 0) {
      console.log('Adding payment_reference column to transactions table...');
      await connection.execute(`
        ALTER TABLE transactions 
        ADD COLUMN payment_reference VARCHAR(255) NULL
      `);
      console.log('Added payment_reference column');
    } else {
      console.log('payment_reference column already exists');
    }

    // Check if description column exists
    const [descColumns] = await connection.execute(`
      SHOW COLUMNS FROM transactions LIKE 'description'
    `);

    if (descColumns.length === 0) {
      console.log('Adding description column to transactions table...');
      await connection.execute(`
        ALTER TABLE transactions 
        ADD COLUMN description VARCHAR(255) NULL
      `);
      console.log('Added description column');
    } else {
      console.log('description column already exists');
    }

    console.log('Transaction schema update completed successfully!');

    // Close connection
    await connection.end();

    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateTransactionSchema();
