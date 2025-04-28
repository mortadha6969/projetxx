require('dotenv').config();
const app = require('./app');
const { sequelize, initializeDatabase } = require('./config/database');

// Database Sync and Server Start
const startServer = async () => {
  try {
    // Initialize the database connection
    await initializeDatabase();
    
    // Force sync to recreate tables - be careful with this in production!
    // In production, you should use { force: false } or { alter: true }
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { force: false } 
      : { force: true };
      
    await sequelize.sync(syncOptions);
    console.log('✅ Database synchronized');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
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
