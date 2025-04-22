const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a connection to MySQL server without database specified
const rootSequelize = new Sequelize('mysql', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Create the main database connection
const sequelize = new Sequelize('crowdfundingdb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
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
        await rootSequelize.query('CREATE DATABASE IF NOT EXISTS crowdfundingdb;');
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