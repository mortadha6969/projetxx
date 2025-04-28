// utils/setup-database.js
require('dotenv').config();
const { sequelize, initializeDatabase } = require('../config/database');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

// Initialize database and create tables
const setupDatabase = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection initialized');

    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized (tables created)');

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
    console.log('✅ Admin user created:', adminUser.username);

    // Create test user
    const testUserPassword = await bcrypt.hash('test123', 10);
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: testUserPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    });
    console.log('✅ Test user created:', testUser.username);

    // Create sample campaigns
    const campaign1 = await Campaign.create({
      title: 'Help Build a School',
      description: 'We are raising funds to build a new school in a rural area. This school will provide education to over 500 children who currently have to walk more than 5km to the nearest school.',
      target: 50000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: testUser.id,
      imageUrl: '/uploads/image-default-campaign.png',
      status: 'active'
    });
    console.log('✅ Sample campaign created:', campaign1.title);

    const campaign2 = await Campaign.create({
      title: 'Community Garden Project',
      description: 'Help us create a community garden that will provide fresh produce for local families and serve as an educational space for schools.',
      target: 10000,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      userId: adminUser.id,
      imageUrl: '/uploads/image-default-campaign.png',
      status: 'active'
    });
    console.log('✅ Sample campaign created:', campaign2.title);

    // Create sample transactions
    await Transaction.create({
      amount: 1000,
      method: 'card',
      status: 'COMPLETED',
      donorId: adminUser.id,
      campaignId: campaign1.id,
      description: 'Sample donation'
    });
    console.log('✅ Sample transaction created');

    console.log('✅ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
