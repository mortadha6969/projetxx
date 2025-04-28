/**
 * Script to create an admin user in the database
 * Run with: node create-admin-user.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, initializeDatabase } = require('./config/database');
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected');

    // Define admin user data
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10), // Hash the password
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };

    // Try direct SQL query first (more reliable with table inconsistencies)
    try {
      // Check if admin already exists
      const [existingAdmins] = await sequelize.query(`
        SELECT * FROM users WHERE email = ?
      `, {
        replacements: [adminData.email]
      });

      if (existingAdmins.length > 0) {
        console.log('✅ Admin user already exists, updating password and role...');

        // Update admin password and role
        await sequelize.query(`
          UPDATE users
          SET password = ?, role = 'admin'
          WHERE email = ?
        `, {
          replacements: [adminData.password, adminData.email]
        });

        console.log('✅ Admin password and role updated successfully');
      } else {
        console.log('Creating new admin user...');

        // Create admin user
        await sequelize.query(`
          INSERT INTO users (
            username, email, password, first_name, last_name, role, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, 'admin', NOW(), NOW()
          )
        `, {
          replacements: [
            adminData.username,
            adminData.email,
            adminData.password,
            adminData.firstName,
            adminData.lastName
          ]
        });

        console.log('✅ Admin user created successfully with SQL');
      }

      console.log('Admin credentials:');
      console.log('Email:', adminData.email);
      console.log('Password: password123');
      return;
    } catch (sqlError) {
      console.error('SQL approach failed, trying ORM approach:', sqlError);

      // Fall back to ORM approach
      // Check if admin already exists
      const existingAdmin = await User.findOne({ where: { email: adminData.email } });

      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        existingAdmin.password = adminData.password;
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Password updated and role set to admin');
      } else {
        // Create the admin
        await User.create(adminData);
        console.log('✅ Admin user created successfully with ORM');
      }

      console.log('Admin credentials:');
      console.log('Email:', adminData.email);
      console.log('Password: password123');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
createAdminUser();
