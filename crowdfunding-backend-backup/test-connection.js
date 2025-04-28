/**
 * Script to test database connection
 */

const fs = require('fs');
const path = require('path');

// Create a new .env file with correct encoding
const envContent = `PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crowdfundingdb
DB_PORT=3306
USE_SQLITE=false
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
ALLOWED_ORIGINS=http://localhost:3000

# Konnect Payment Gateway Configuration
KONNECT_API_URL=https://api.konnect.network/api/v2
KONNECT_API_KEY=your_konnect_api_key_here
KONNECT_RECEIVER_WALLET_ID=your_konnect_wallet_id_here
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001`;

// Write the .env file
fs.writeFileSync(path.join(__dirname, '.env'), envContent, 'utf8');
console.log('Created new .env file with correct encoding');

require('dotenv').config();
const { sequelize, initializeDatabase } = require('./config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Environment variables:');
    console.log('- DB_HOST:', process.env.DB_HOST);
    console.log('- DB_USER:', process.env.DB_USER);
    console.log('- DB_NAME:', process.env.DB_NAME);
    console.log('- USE_SQLITE:', process.env.USE_SQLITE);

    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected successfully');

    // Check tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));

    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error testing connection:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the function
testConnection();
