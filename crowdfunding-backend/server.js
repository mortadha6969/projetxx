require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize, initializeDatabase } = require('./config/database');

// ✅ Initialize Express App
const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://www.postman.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from uploads directory
// Add logging middleware for static file requests
app.use('/uploads', (req, _res, next) => {
  console.log(`Static file request: ${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import Models
// Models and associations are defined in models/index.js
require('./models/index');

// ✅ Import Routes
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Note: Middleware is imported and used in the route files

// Note: We're using the routes defined in userRoutes.js instead of duplicating them here
// This comment is kept for documentation purposes

// ✅ API Routes
// Health check endpoint
app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Standard routes (for backward compatibility)
app.use('/users', userRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/transactions', transactionRoutes);

// Versioned API routes (for future use)
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// ✅ Error Handler Middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ✅ 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Database Sync and Server Start
const startServer = async () => {
  try {
    // Initialize the database connection
    await initializeDatabase();

    // Sync database
    // Using force: false will not drop tables, only create them if they don't exist
    // This is better for development to preserve data between server restarts
    const syncOptions = { force: false };

    await sequelize.sync(syncOptions);
    console.log('✅ Database synchronized');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created');
    }

    // Try to use port 3001, but if it's in use, use a different port
    const PORT = process.env.PORT || 3001;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔑 Environment: ${process.env.NODE_ENV}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try using port 3002 instead
        const newPort = PORT + 1;
        console.log(`⚠️ Port ${PORT} is in use, trying port ${newPort} instead...`);
        app.listen(newPort, () => {
          console.log(`🚀 Server running on port ${newPort}`);
          console.log(`📁 API Documentation: http://localhost:${newPort}/api-docs`);
          console.log(`🔑 Environment: ${process.env.NODE_ENV}`);
        });
      } else {
        console.error('❌ Server error:', err);
      }
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error(error);
    process.exit(1);
  }
};

startServer();
