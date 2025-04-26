require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateTransactionDonor() {
  try {
    console.log('Starting transaction donor update...');

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Modify donor_id column to allow NULL
    console.log('Modifying donor_id column to allow NULL...');
    await connection.execute(`
      ALTER TABLE transactions 
      MODIFY COLUMN donor_id INT NULL
    `);
    console.log('Modified donor_id column to allow NULL');

    console.log('Transaction donor update completed successfully!');

    // Close connection
    await connection.end();

    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateTransactionDonor();
