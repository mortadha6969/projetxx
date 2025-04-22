// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');
const { ValidationError } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { username, email, password, phone, birthdate } = req.body;

    // Validate required fields
    if (!username || !email || !password || !phone || !birthdate) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required: username, email, password, phone, and birthdate'
      });
    }

    // Create user with validation
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      birthdate
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1d' }
    );

    // Return success response without password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      createdAt: user.createdAt
    };

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error instanceof ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      return res.status(400).json({
        status: 'error',
        message: `${field} is already taken`
      });
    }

    // Handle other errors
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again later.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find user with email
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'password'] // Only select needed fields
    });

    // If no user found with that email
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '24h' }
    );

    // Return success response without password
    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again later.'
    });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const campaign = await Campaign.create({
      ...req.body,
      userId
    });

    res.status(201).json({
      status: 'success',
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create campaign'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude password from the response
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
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Fields that can be updated
    const { firstName, lastName, phone, bio } = req.body;

    // Update user fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    // Handle profile image upload
    if (req.file) {
      // Set new profile image path
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    // Save updated user
    await user.save();

    // Return updated user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password and new password are required'
      });
    }

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword; // The beforeUpdate hook will hash the password
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
};

exports.makeDonation = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { campaignId, amount } = req.body;

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaign not found'
      });
    }

    const transaction = await Transaction.create({
      amount,
      donorId: userId,
      campaignId,
      status: 'COMPLETED'
    });

    // Update campaign donation stats
    await campaign.increment('donated', { by: amount });
    await campaign.increment('donors');

    res.status(201).json({
      status: 'success',
      message: 'Donation successful',
      transaction
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process donation'
    });
  }
};
