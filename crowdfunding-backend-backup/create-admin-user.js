// create-admin-user.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function createAdminUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    // Admin user data
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { 
        email: adminData.email 
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
      console.log('Email:', adminData.email);
      console.log('Password: Admin123!');
      
      await sequelize.close();
      return;
    }
    
    // Create admin user
    const admin = await User.create(adminData);
    
    console.log('Admin user created successfully');
    console.log('Admin credentials:');
    console.log('Email:', adminData.email);
    console.log('Password: Admin123!');
    
    await sequelize.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
