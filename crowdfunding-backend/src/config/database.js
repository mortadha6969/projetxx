const { Sequelize } = require('sequelize');

// Get database configuration from environment variables
const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'crowdfundingdb',
  DB_PORT = 3306,
  NODE_ENV = 'development'
} = process.env;

// Create a connection to MySQL server without database specified
const rootSequelize = new Sequelize('mysql', DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false
});

// Create the main database connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    timestamps: true,
    freezeTableName: true
  }
});

// Initialize Database
const initializeDatabase = async () => {
  try {
    // First, ensure the database exists
    await rootSequelize.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    console.log("✅ Database existence checked");

    // Test connection to the database
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  } finally {
    // Close the root connection as it's no longer needed
    await rootSequelize.close();
  }
};

module.exports = { sequelize, initializeDatabase };
