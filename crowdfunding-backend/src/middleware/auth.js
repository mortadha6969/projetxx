// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    // Log only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - authHeader:', authHeader ? 'exists' : 'missing');
    }

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'No authentication token provided'
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format'
      });
    }

    // Get the token without 'Bearer '
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token is required'
      });
    }

    try {
      // Get JWT_SECRET with fallback for development
      const jwtSecret = process.env.JWT_SECRET || 'secretKey'; // Use the same fallback as in userController.js

      console.log('Auth middleware - Using JWT_SECRET:', jwtSecret ? 'Secret is set' : 'Secret is NOT set');

      // Log warning if using default secret in production
      if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
        console.warn('WARNING: Using default JWT_SECRET in production environment!');
      }

      console.log('Auth middleware - Verifying token:', token.substring(0, 10) + '...');

      // Verify token without strict options for now
      const decoded = jwt.verify(token, jwtSecret);

      // Add user info to request
      req.user = decoded;

      // Ensure the role is set
      if (!req.user.role) {
        req.user.role = 'user';
      }

      // Check token expiration manually as an extra precaution
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired'
        });
      }

      next();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth middleware - Token verification error:', err.name);
      }

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired'
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid authentication token'
        });
      } else {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication failed'
        });
      }
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = auth;
