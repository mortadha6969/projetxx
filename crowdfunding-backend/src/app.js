const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize Express App
const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://www.postman.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
// Add logging middleware for static file requests
app.use('/uploads', (req, _res, next) => {
  console.log(`Static file request: ${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Import Models
// Models and associations are defined in models/index.js
require('./models/index');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const debugAdminRoutes = require('./routes/debugAdminRoutes');
const konnectRoutes = require('./routes/konnectRoutes');

// Health check endpoint
app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API version
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// Standard routes (for backward compatibility)
// These will be deprecated in future versions
app.use('/users', userRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/transactions', transactionRoutes);
app.use('/konnect', konnectRoutes);
app.use('/admin', adminRoutes);

// Log deprecation warning for non-versioned routes
app.use(['/users', '/campaigns', '/transactions', '/konnect', '/admin'], (req, res, next) => {
  console.warn(`Deprecation warning: Non-versioned route ${req.originalUrl} was accessed. Please use ${API_PREFIX} routes instead.`);

  // Add debugging for file uploads
  if (req.files) {
    console.log('Files in request:', Object.keys(req.files));
    for (const fieldName in req.files) {
      console.log(`Files in ${fieldName}:`, req.files[fieldName].length);
    }
  }

  next();
});

// Versioned API routes (preferred approach)
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/campaigns`, campaignRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/konnect`, konnectRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// Debug admin routes (no authentication required)
app.use('/debug-admin', debugAdminRoutes);

// Error Handler Middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
