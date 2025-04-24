require('dotenv').config();
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Force sync to drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log('Database reset successful');
    
    // Create a test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      phone: '1234567890',
      birthdate: '1990-01-01'
    });
    
    console.log('Test user created:', {
      id: testUser.id,
      username: testUser.username,
      email: testUser.email
    });
    
    console.log('You can now log in with:');
    console.log('Email: test@example.com');
    console.log('Password: Password123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
