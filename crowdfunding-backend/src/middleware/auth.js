const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email'] // Only select needed fields
    });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};

module.exports = auth;
