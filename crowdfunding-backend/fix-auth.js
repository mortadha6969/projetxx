require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixAuth() {
  try {
    console.log('Starting database fix...');
    
    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });
    
    console.log('Connected to MySQL database');
    
    // Drop existing tables
    console.log('Dropping existing tables...');
    await connection.execute('DROP TABLE IF EXISTS transactions');
    await connection.execute('DROP TABLE IF EXISTS Campaign');
    await connection.execute('DROP TABLE IF EXISTS User');
    
    // Create User table
    console.log('Creating User table...');
    await connection.execute(`
      CREATE TABLE User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        phone VARCHAR(255),
        birthdate DATE,
        bio TEXT,
        profileImage VARCHAR(255),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    
    // Create Campaign table
    console.log('Creating Campaign table...');
    await connection.execute(`
      CREATE TABLE Campaign (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        target DECIMAL(10,2) NOT NULL,
        donated DECIMAL(10,2) NOT NULL DEFAULT 0,
        donors INT NOT NULL DEFAULT 0,
        endDate DATETIME NOT NULL,
        imageUrl VARCHAR(255),
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        iteration INT NOT NULL DEFAULT 1,
        previousIterationId INT,
        iterationEndReason TEXT,
        files JSON,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY (previousIterationId) REFERENCES Campaign(id)
      )
    `);
    
    // Create transactions table
    console.log('Creating transactions table...');
    await connection.execute(`
      CREATE TABLE transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(15,2) NOT NULL,
        method VARCHAR(255) DEFAULT 'card',
        status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
        donor_id INT,
        campaign_id INT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY (donor_id) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY (campaign_id) REFERENCES Campaign(id) ON DELETE CASCADE
      )
    `);
    
    // Create test user
    console.log('Creating test user...');
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await connection.execute(`
      INSERT INTO User (username, email, password, phone, birthdate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['testuser', 'test@example.com', hashedPassword, '1234567890', '1990-01-01', now, now]);
    
    console.log('Database fix completed successfully!');
    console.log('Test user created:');
    console.log('  Username: testuser');
    console.log('  Email: test@example.com');
    console.log('  Password: Password123!');
    
    // Close connection
    await connection.end();
    
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAuth();
