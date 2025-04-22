require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, initializeDatabase } = require('./config/database');

// ✅ Initialize Express App
const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import Models
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Transaction = require('./models/Transaction');

// ✅ Model Associations with cascade delete
User.hasMany(Campaign, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});
Campaign.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(Transaction, {
  foreignKey: 'donorId',
  as: 'donations',
  onDelete: 'CASCADE',
  hooks: true
});
Transaction.belongsTo(User, {
  foreignKey: 'donorId',
  as: 'donor'
});

Campaign.hasMany(Transaction, {
  foreignKey: 'campaignId',
  onDelete: 'CASCADE',
  hooks: true
});
Transaction.belongsTo(Campaign, {
  foreignKey: 'campaignId'
});

// ✅ Import Routes
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// ✅ Use Routes
app.use('/users', userRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/transactions', transactionRoutes);

// ✅ Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Database Sync and Server Start
const startServer = async () => {
  try {
    // Initialize the database connection
    await initializeDatabase();

    // Force sync to recreate tables - be careful with this in production!
    await sequelize.sync({ force: true });
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

startServer();
