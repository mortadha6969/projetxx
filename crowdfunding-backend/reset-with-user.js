require('dotenv').config();
const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');

async function resetWithUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Dropping and recreating tables...');
    await sequelize.sync({ force: true });
    
    // Create a test user directly with SQL to bypass model hooks
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    const insertUserQuery = `
      INSERT INTO User (username, email, password, phone, birthdate, createdAt, updatedAt)
      VALUES ('testuser', 'test@example.com', '${hashedPassword}', '1234567890', '1990-01-01', NOW(), NOW())
    `;
    
    await sequelize.query(insertUserQuery);
    
    console.log('Test user created successfully!');
    console.log('You can now log in with:');
    console.log('Email: test@example.com');
    console.log('Password: Password123!');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetWithUser();
