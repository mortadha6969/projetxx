const { Sequelize } = require('sequelize'); 
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'crowdfundingdb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
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
        },
        dialectOptions: {
            multipleStatements: true,
            supportBigNumbers: true,
            bigNumberStrings: true
        }
    }
);

// Test Database Connection and Create Database if not exists
const initializeDatabase = async () => {
    try {
        // Create database if it doesn't exist
        const tempSequelize = new Sequelize(
            'mysql',
            process.env.DB_USER || 'root',
            process.env.DB_PASSWORD || '',
            {
                host: process.env.DB_HOST || 'localhost',
                dialect: 'mysql',
                logging: false
            }
        );

        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'crowdfundingdb'};`);
        await tempSequelize.close();

        // Test connection to the actual database
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");
    } catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};

initializeDatabase();

module.exports = sequelize;