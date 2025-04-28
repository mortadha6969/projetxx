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
      birthdate: '1990-01-01',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };

    // Try direct SQL query first (more reliable with table inconsistencies)
    try {
      // Check if user already exists
      const [existingUsers] = await sequelize.query(`
        SELECT * FROM users WHERE email = ?
      `, {
        replacements: [testUser.email]
      });

      if (existingUsers.length > 0) {
        console.log('✅ Test user already exists, updating password...');

        // Update user password
        await sequelize.query(`
          UPDATE users
          SET password = ?
          WHERE email = ?
        `, {
          replacements: [testUser.password, testUser.email]
        });

        console.log('✅ User password updated successfully');
      } else {
        console.log('Creating new test user...');

        // Create test user
        await sequelize.query(`
          INSERT INTO users (
            username, email, password, phone, birthdate, role, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, NOW(), NOW()
          )
        `, {
          replacements: [
            testUser.username,
            testUser.email,
            testUser.password,
            testUser.phone,
            testUser.birthdate,
            testUser.role
          ]
        });

        console.log('✅ Test user created successfully with SQL');
      }

      console.log('Email:', testUser.email);
      console.log('Password: password123');
      return;
    } catch (sqlError) {
      console.error('SQL approach failed, trying ORM approach:', sqlError);

      // Fall back to ORM approach
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: testUser.email } });

      if (existingUser) {
        console.log('✅ Test user already exists');
        existingUser.password = testUser.password;
        await existingUser.save();
        console.log('✅ Password updated');
      } else {
        // Create the user
        await User.create(testUser);
        console.log('✅ Test user created successfully with ORM');
      }

      console.log('Email:', testUser.email);
      console.log('Password: password123');
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
createTestUser();
