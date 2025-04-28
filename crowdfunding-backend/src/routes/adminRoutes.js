// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All routes in this file require authentication and admin role
router.use(auth);
router.use(adminAuth);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      status: 'success',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get users'
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Campaign, as: 'campaigns' },
        { model: Transaction, as: 'donations' }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user'
    });
  }
});

// Update user (including role)
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Fields that can be updated by admin
    const { firstName, lastName, phone, bio, role } = req.body;
    
    // Update user fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (role !== undefined) user.role = role;
    
    await user.save();
    
    // Return updated user without password
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user'
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if trying to delete an admin
    if (user.role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot delete admin users'
      });
    }
    
    await user.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
});

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });
    
    res.status(200).json({
      status: 'success',
      count: campaigns.length,
      campaigns
    });
  } catch (error) {
    console.error('Admin get campaigns error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get campaigns'
    });
  }
});

// Delete campaign
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaign not found'
      });
    }
    
    await campaign.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete campaign error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete campaign'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const userCount = await User.count();
    const campaignCount = await Campaign.count();
    const activeCount = await Campaign.count({ where: { status: 'active' } });
    const completedCount = await Campaign.count({ where: { status: 'completed' } });
    
    // Get total donations
    const totalDonated = await Campaign.sum('donated');
    
    res.status(200).json({
      status: 'success',
      stats: {
        userCount,
        campaignCount,
        activeCount,
        completedCount,
        totalDonated: totalDonated || 0
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics'
    });
  }
});

module.exports = router;
