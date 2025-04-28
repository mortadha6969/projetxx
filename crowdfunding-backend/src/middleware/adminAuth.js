// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to check if the user is an admin
 * This middleware should be used after the regular auth middleware
 */
const adminAuth = async (req, res, next) => {
  try {
    // Debug information
    console.log('Admin auth middleware - req.user:', req.user);

    // The auth middleware should have already set req.user
    if (!req.user) {
      console.log('Admin auth middleware - No user found in request');
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Check if the user has admin role
    console.log('Admin auth middleware - User role:', req.user.role);
    if (req.user.role !== 'admin') {
      console.log('Admin auth middleware - User is not an admin');
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    // If we reach here, the user is an admin
    console.log('Admin auth middleware - Access granted');
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during admin authentication'
    });
  }
};

module.exports = adminAuth;
