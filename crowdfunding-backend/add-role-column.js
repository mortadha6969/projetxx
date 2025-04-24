// add-role-column.js
require('dotenv').config();
const { sequelize } = require('./config/database');
const mysql = require('mysql2/promise');

async function addRoleColumn() {
  try {
    console.log('Connecting to database...');
    
    // Create a direct connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfunding'
    });
    
    console.log('Connected to database');
    
    // Check if the role column already exists
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM User LIKE 'role'
    `);
    
    if (columns.length > 0) {
      console.log('Role column already exists');
    } else {
      // Add the role column to the User table
      console.log('Adding role column to User table...');
      await connection.execute(`
        ALTER TABLE User 
        ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
      `);
      console.log('Role column added successfully');
    }
    
    // Close the connection
    await connection.end();
    
    // Now create the admin user
    console.log('Creating admin user...');
    await sequelize.authenticate();
    
    // Get the User model
    const User = require('./models/User');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { 
        email: 'admin@example.com' 
      } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Update role to admin if it's not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }
      
      console.log('Admin credentials:');
      console.log('Email:', 'admin@example.com');
      console.log('Password: Admin123!');
      
      await sequelize.close();
      return;
    }
    
    // Create admin user
    const bcrypt = require('bcryptjs');
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };
    
    const admin = await User.create(adminData);
    
    console.log('Admin user created successfully');
    console.log('Admin credentials:');
    console.log('Email:', adminData.email);
    console.log('Password: Admin123!');
    
    await sequelize.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
addRoleColumn();
