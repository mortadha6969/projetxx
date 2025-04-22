const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const backwardCompatibilityRoutes = require('./routes/backwardCompatibility');

// Initialize Express App
const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Use Routes - New API structure with /api prefix
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/transactions', transactionRoutes);

// Backward compatibility routes - Old API structure without /api prefix
app.use('/', backwardCompatibilityRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Route not found' 
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
