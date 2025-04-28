/**
 * Script to set up the database with test data
 * Run with: node setup-database.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, initializeDatabase } = require('./config/database');
const fs = require('fs');
const path = require('path');

// Import models
const { User, Campaign, Transaction } = require('./models');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Log with color
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    log('✅ Created uploads directory', colors.green);
  }
};

// Test users data
const users = [
  {
    username: 'testuser',
    email: 'user@gmail.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '12345678',
    birthdate: '1990-01-01',
    bio: 'I am a test user for the crowdfunding platform.'
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
    phone: '87654321',
    birthdate: '1985-05-15',
    bio: 'Passionate about technology and innovation.'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'Password123!',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '98765432',
    birthdate: '1992-08-20',
    bio: 'Environmental activist and community organizer.'
  }
];

// Test campaigns data
const campaigns = [
  {
    title: 'Innovative Tech Gadget',
    description: 'Help us bring this revolutionary gadget to market. It will change the way you interact with technology.',
    target: 10000,
    donated: 0,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active',
    iteration: 1
  },
  {
    title: 'Community Garden Project',
    description: 'We\'re creating a community garden to provide fresh produce for local families in need.',
    target: 5000,
    donated: 0,
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: 'active',
    iteration: 1
  },
  {
    title: 'Educational App for Kids',
    description: 'An interactive app that makes learning fun for children of all ages.',
    target: 8000,
    donated: 0,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'active',
    iteration: 1
  }
];

// Set up the database
const setupDatabase = async () => {
  try {
    log('\n=== Initializing Database ===', colors.bright + colors.cyan);
    await initializeDatabase();

    // Ensure uploads directory exists
    ensureUploadsDir();

    // Sync models with database - force: true will drop all tables and recreate them
    await sequelize.sync({ force: true });
    log('✅ Database synchronized', colors.green);

    // Create users
    log('\n=== Creating Test Users ===', colors.bright + colors.cyan);
    const createdUsers = [];
    
    for (const userData of users) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create the user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      createdUsers.push(user);
      log(`✅ Created user: ${userData.username} (${userData.email})`, colors.green);
    }

    // Create campaigns
    log('\n=== Creating Test Campaigns ===', colors.bright + colors.cyan);
    const createdCampaigns = [];
    
    for (let i = 0; i < campaigns.length; i++) {
      // Assign each campaign to a user
      const userId = createdUsers[i % createdUsers.length].id;
      
      // Create the campaign
      const campaign = await Campaign.create({
        ...campaigns[i],
        userId
      });
      
      createdCampaigns.push(campaign);
      log(`✅ Created campaign: ${campaigns[i].title}`, colors.green);
    }

    // Create some donations
    log('\n=== Creating Test Donations ===', colors.bright + colors.cyan);
    
    for (let i = 0; i < createdCampaigns.length; i++) {
      // Each user donates to campaigns they didn't create
      for (let j = 0; j < createdUsers.length; j++) {
        if (createdCampaigns[i].userId !== createdUsers[j].id) {
          const amount = Math.floor(Math.random() * 500) + 100; // Random amount between 100 and 600
          
          // Create the transaction
          await Transaction.create({
            amount,
            donorId: createdUsers[j].id,
            campaignId: createdCampaigns[i].id,
            status: 'COMPLETED'
          });
          
          // Update campaign donation stats
          await createdCampaigns[i].increment('donated', { by: amount });
          await createdCampaigns[i].increment('donors', { by: 1 });
          
          log(`✅ Created donation: $${amount} from ${createdUsers[j].username} to "${createdCampaigns[i].title}"`, colors.green);
        }
      }
    }

    log('\n=== Database Setup Complete ===', colors.bright + colors.green);
    log('You can now start the application with:', colors.yellow);
    log('npm start', colors.reset);
    
  } catch (error) {
    log(`❌ Error setting up database: ${error.message}`, colors.red);
    console.error(error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the setup function
setupDatabase();
