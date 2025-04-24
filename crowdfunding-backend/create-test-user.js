/**
 * Script to create a test user in the database
 * Run with: node create-test-user.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, initializeDatabase } = require('./config/database');
const User = require('./models/User');

async function createTestUser() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected');

    // Define test user data
    const testUser = {
      username: 'testuser',
      email: 'user@gmail.com',
      password: await bcrypt.hash('password123', 10), // Hash the password
      phone: '12345678',
      birthdate: '1990-01-01'
    };

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: testUser.email } });

    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Email:', testUser.email);
      console.log('Password: password123');
      return;
    }

    // Create the user
    const user = await User.create(testUser);

    console.log('✅ Test user created successfully');
    console.log('Email:', testUser.email);
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
createTestUser();
