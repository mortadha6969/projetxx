// routes/debugAdminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');

// Debug admin routes - no authentication required
// These routes are for debugging purposes only

// Get all users
router.get('/users', async (req, res) => {
  try {
    console.log('Debug admin: Getting all users');
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    console.log(`Debug admin: Found ${users.length} users`);
    console.log('Debug admin: User data sample:', users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })));

    res.status(200).json({
      status: 'success',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Debug admin get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get users'
    });
  }
});

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    console.log('Debug admin: Getting all campaigns');
    const campaigns = await Campaign.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });

    console.log(`Debug admin: Found ${campaigns.length} campaigns`);
    if (campaigns.length > 0) {
      console.log('Debug admin: Campaign data sample:', campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        userId: campaign.userId,
        target: campaign.target,
        donated: campaign.donated
      })));
    }

    res.status(200).json({
      status: 'success',
      count: campaigns.length,
      campaigns
    });
  } catch (error) {
    console.error('Debug admin get campaigns error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get campaigns'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    console.log('Debug admin: Getting dashboard statistics');

    // Get user count
    const userCount = await User.count();
    console.log(`Debug admin: User count: ${userCount}`);

    // Get campaign counts
    const campaignCount = await Campaign.count();
    console.log(`Debug admin: Campaign count: ${campaignCount}`);

    const activeCount = await Campaign.count({ where: { status: 'active' } });
    console.log(`Debug admin: Active campaign count: ${activeCount}`);

    const completedCount = await Campaign.count({ where: { status: 'completed' } });
    console.log(`Debug admin: Completed campaign count: ${completedCount}`);

    // Get total donations
    const totalDonated = await Campaign.sum('donated') || 0;
    console.log(`Debug admin: Total donated: ${totalDonated}`);

    // Create stats object
    const stats = {
      userCount,
      campaignCount,
      activeCount,
      completedCount,
      totalDonated
    };

    console.log('Debug admin: Dashboard statistics:', stats);

    // If all counts are 0, add some dummy data for testing
    if (userCount === 0 && campaignCount === 0) {
      console.log('Debug admin: All counts are 0, adding dummy data');
      stats.userCount = 5;
      stats.campaignCount = 10;
      stats.activeCount = 7;
      stats.completedCount = 3;
      stats.totalDonated = 12500;
    }

    res.status(200).json({
      status: 'success',
      stats
    });
  } catch (error) {
    console.error('Debug admin dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics'
    });
  }
});

module.exports = router;
