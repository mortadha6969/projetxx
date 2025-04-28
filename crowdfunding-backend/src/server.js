require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./app');
const { sequelize, initializeDatabase } = require('./config/database');

// Database Sync and Server Start
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
    const uploadsDir = path.join(__dirname, '..', 'uploads');
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();
