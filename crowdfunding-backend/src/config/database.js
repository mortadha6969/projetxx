const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Check if we should use SQLite instead of MySQL
const useSQLite = process.env.USE_SQLITE === 'true';

// Create a connection to MySQL server without database specified (only if using MySQL)
let rootSequelize;
if (!useSQLite) {
    rootSequelize = new Sequelize('mysql', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    });
}

// Create the main database connection
let sequelize;

if (useSQLite) {
    // SQLite configuration
    const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');

    // Ensure the directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: console.log,
        define: {
            timestamps: true,
            freezeTableName: true
        }
    });
} else {
    // MySQL configuration
    sequelize = new Sequelize(
        process.env.DB_NAME || 'crowdfundingdb',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
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
        }
    );
}

// Initialize Database
const initializeDatabase = async () => {
    try {
        if (!useSQLite) {
            // First, ensure the database exists (MySQL only)
            await rootSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'crowdfundingdb'};`);
            console.log("✅ Database existence checked");
        } else {
            console.log("✅ Using SQLite database");
        }

        // Test connection to the database
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        return sequelize;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    } finally {
        // Close the root connection if it exists
        if (!useSQLite && rootSequelize) {
            await rootSequelize.close();
        }
    }
};

module.exports = { sequelize, initializeDatabase };
