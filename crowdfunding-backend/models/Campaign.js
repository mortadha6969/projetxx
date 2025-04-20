const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  target: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  donated: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  donors: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'image_url'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'General'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  }
}, {
  tableName: 'campaigns',
  underscored: true,
  timestamps: true
});

module.exports = Campaign;