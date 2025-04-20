// models/Transaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    defaultValue: 'card'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
    defaultValue: 'PENDING'
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'donor_id'
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'campaign_id'
  }
}, {
  tableName: 'transactions',
  underscored: true,
  timestamps: true
});

module.exports = Transaction;
