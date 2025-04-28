/**
 * Models index file
 * Sets up all model associations
 */

const User = require('./User');
const Campaign = require('./Campaign');
const Transaction = require('./Transaction');

// User associations
User.hasMany(Campaign, {
  foreignKey: 'userId',
  as: 'campaigns',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

User.hasMany(Transaction, {
  foreignKey: 'donor_id',
  as: 'donations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Campaign associations
Campaign.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Campaign.hasMany(Transaction, {
  foreignKey: 'campaign_id',
  as: 'donations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Transaction associations
Transaction.belongsTo(User, {
  foreignKey: 'donor_id',
  as: 'donor'
});

Transaction.belongsTo(Campaign, {
  foreignKey: 'campaign_id',
  as: 'campaign'
});

module.exports = {
  User,
  Campaign,
  Transaction
};
