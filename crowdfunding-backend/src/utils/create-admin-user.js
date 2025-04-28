// utils/create-admin-user.js
require('dotenv').config();
const { initializeDatabase } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create an admin user
const createAdminUser = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection initialized');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists:', existingAdmin.username);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully:');
    console.log('   Username:', adminUser.username);
    console.log('   Email:', adminUser.email);
    console.log('   Password: admin123');
    console.log('   Role:', adminUser.role);
    console.log('⚠️ Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
