// add-dummy-data.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Transaction = require('./models/Transaction');

async function addDummyData() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    // Check if there are already users in the database
    const userCount = await User.count();
    if (userCount > 0) {
      console.log(`Database already has ${userCount} users. Skipping dummy data creation.`);
      await sequelize.close();
      return;
    }

    console.log('Creating dummy data...');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    console.log('Created admin user:', adminUser.username);

    // Create regular users
    const users = await Promise.all([
      User.create({
        username: 'john',
        email: 'john@example.com',
        password: await bcrypt.hash('Password123!', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      }),
      User.create({
        username: 'jane',
        email: 'jane@example.com',
        password: await bcrypt.hash('Password123!', 10),
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user'
      }),
      User.create({
        username: 'bob',
        email: 'bob@example.com',
        password: await bcrypt.hash('Password123!', 10),
        firstName: 'Bob',
        lastName: 'Johnson',
        role: 'user'
      })
    ]);

    console.log('Created regular users:', users.map(user => user.username).join(', '));

    // Create campaigns
    const campaigns = await Promise.all([
      Campaign.create({
        userId: users[0].id,
        title: 'Help Fund My Education',
        description: 'I am raising money to pay for my college tuition. Any amount helps! I am studying computer science and hope to become a software engineer.\n\nThank you for your support!',
        target: 10000,
        donated: 2500,
        donors: 15,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        imageUrl: '/uploads/default-campaign-1.jpg',
        status: 'active'
      }),
      Campaign.create({
        userId: users[1].id,
        title: 'Save Our Local Park',
        description: 'Our local park needs renovation. We are raising funds to install new playground equipment and plant trees.\n\nPlease help us make our community better!',
        target: 5000,
        donated: 3500,
        donors: 25,
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        imageUrl: '/uploads/default-campaign-2.jpg',
        status: 'active'
      }),
      Campaign.create({
        userId: users[2].id,
        title: 'Support My Art Exhibition',
        description: 'I am an emerging artist looking to host my first exhibition. The funds will go towards venue rental, marketing, and materials.\n\nI appreciate your support for the arts!',
        target: 3000,
        donated: 3000,
        donors: 20,
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        imageUrl: '/uploads/default-campaign-3.jpg',
        status: 'completed'
      })
    ]);

    console.log('Created campaigns:', campaigns.map(campaign => campaign.title).join(', '));

    // Create transactions
    const transactions = await Promise.all([
      Transaction.create({
        amount: 500,
        donor_id: users[1].id,
        campaign_id: campaigns[0].id,
        status: 'COMPLETED'
      }),
      Transaction.create({
        amount: 200,
        donor_id: users[2].id,
        campaign_id: campaigns[0].id,
        status: 'COMPLETED'
      }),
      Transaction.create({
        amount: 1000,
        donor_id: users[0].id,
        campaign_id: campaigns[1].id,
        status: 'COMPLETED'
      }),
      Transaction.create({
        amount: 500,
        donor_id: users[2].id,
        campaign_id: campaigns[1].id,
        status: 'COMPLETED'
      }),
      Transaction.create({
        amount: 1500,
        donor_id: users[0].id,
        campaign_id: campaigns[2].id,
        status: 'COMPLETED'
      }),
      Transaction.create({
        amount: 500,
        donor_id: users[1].id,
        campaign_id: campaigns[2].id,
        status: 'COMPLETED'
      })
    ]);

    console.log('Created transactions:', transactions.length);

    console.log('Dummy data created successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: Admin123!');

    console.log('\nRegular user credentials:');
    console.log('Email: john@example.com');
    console.log('Password: Password123!');

    await sequelize.close();
  } catch (error) {
    console.error('Error creating dummy data:', error);
    process.exit(1);
  }
}

// Run the function
addDummyData();
