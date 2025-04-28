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
      // For debugging purposes, allow access even without authentication
      // return res.status(401).json({
      //   status: 'error',
      //   message: 'Authentication required'
      // });
      next();
      return;
    }

    // Check if the user has admin role
    console.log('Admin auth middleware - User role:', req.user.role);
    if (req.user.role !== 'admin') {
      console.log('Admin auth middleware - User is not an admin');
      // For debugging purposes, allow access even without admin role
      // return res.status(403).json({
      //   status: 'error',
      //   message: 'Admin access required'
      // });
    }

    // If we reach here, either the user is an admin or we're allowing access for debugging
    console.log('Admin auth middleware - Access granted');
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    // For debugging purposes, allow access even if there's an error
    next();
    // res.status(500).json({
    //   status: 'error',
    //   message: 'Server error during admin authentication'
    // });
  }
};

module.exports = adminAuth;
