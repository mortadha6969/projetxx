// models/Transaction.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
    allowNull: true, // Allow null for anonymous donations or test payments
    field: 'donor_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'campaign_id',
    references: {
      model: 'campaigns',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_reference'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  underscored: true,
  timestamps: true
});

// Note: Associations are now defined in models/index.js

module.exports = Transaction;
